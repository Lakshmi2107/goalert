package superservice

/*
 TLMT-2546
*/
import (
	"context"
	"database/sql"
	"fmt"

	"github.com/google/uuid"
	"github.com/target/goalert/graphql2"
	"github.com/target/goalert/permission"
	"github.com/target/goalert/service"
	"github.com/target/goalert/util"
	"github.com/target/goalert/util/sqlutil"
)

type Store interface {
	FindAll(ctx context.Context) ([]graphql2.Superservice, error)
	FindServicesBySuperService(ctx context.Context, id string) ([]service.Service, error)
	CreateServiceTx(context.Context, *sql.Tx, *graphql2.Superservice) (*graphql2.Superservice, error)
	DeleteTx(ctx context.Context, tx *sql.Tx, ids []string) error
	UpdateTx(context.Context, *sql.Tx, *graphql2.UpdateSuperServiceInput) error
	FindByID(ctx context.Context, id string) (*graphql2.SuperserviceListAll, error)
	Search(ctx context.Context, opts *SearchOptions) ([]graphql2.Superservice, error)
}

type DB struct {
	db                         *sql.DB
	findAll                    *sql.Stmt
	findServicesBySuperService *sql.Stmt
	insert                     *sql.Stmt
	insertMapping              *sql.Stmt
	delete                     *sql.Stmt
	deleteMapping              *sql.Stmt
	update                     *sql.Stmt
	findOne                    *sql.Stmt
}

func NewDB(ctx context.Context, db *sql.DB) (*DB, error) {
	prep := &util.Prepare{DB: db, Ctx: ctx}
	p := prep.P

	s := &DB{db: db}

	s.findAll = p(`
		SELECT
			*
		FROM
			super_services
		
	`)
	s.findOne = p(`
		SELECT * FROM super_services WHERE id = $1
	`)
	s.findServicesBySuperService = p(`
		SELECT s.id,s.name,s.description FROM services s INNER JOIN super_service_mapping ss ON s.id= ss.service_id WHERE ss.super_service_id=$1

	`)
	s.insert = p(`
		INSERT INTO super_services VALUES($1,$2,$3)
	`)
	s.insertMapping = p(`
		INSERT INTO super_service_mapping(super_service_id,service_id)
		VALUES($1,unnest($2::uuid[]))

	`)
	s.delete = p(`
		DELETE FROM super_services WHERE id=any($1)
	`)
	s.deleteMapping = p(`
		DELETE FROM super_service_mapping WHERE super_service_id=any($1)
	`)
	s.update = p(`
		UPDATE super_services SET name=$2, description=$3 WHERE id=$1
	`)
	return s, prep.Err
}

func (db *DB) FindAll(ctx context.Context) ([]graphql2.Superservice, error) {
	rows, err := db.findAll.QueryContext(ctx)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var s graphql2.Superservice
	var result []graphql2.Superservice
	for rows.Next() {
		err = rows.Scan(
			&s.ID,
			&s.Name,
			&s.Description,
		)
		if err != nil {
			return nil, err
		}
		result = append(result, s)
	}
	return result, nil
}

func (db *DB) FindServicesBySuperService(ctx context.Context, id string) ([]service.Service, error) {

	rows, err := db.findServicesBySuperService.QueryContext(ctx, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var s service.Service
	var result []service.Service
	for rows.Next() {
		err = rows.Scan(
			&s.ID,
			&s.Name,
			&s.Description,
		)
		if err != nil {
			return nil, err
		}
		result = append(result, s)
	}
	return result, nil
}

func (db *DB) FindByID(ctx context.Context, id string) (*graphql2.SuperserviceListAll, error) {

	row, err := db.findOne.QueryContext(ctx, id)
	if err != nil {
		return nil, err
	}
	defer row.Close()
	var ss graphql2.SuperserviceListAll
	fmt.Println(row)
	for row.Next() {
		err = row.Scan(
			&ss.ID,
			&ss.Name,
			&ss.Description,
		)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}

	}

	rows, err := db.findServicesBySuperService.QueryContext(ctx, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var s service.Service
	var result []service.Service
	for rows.Next() {
		err = rows.Scan(
			&s.ID,
			&s.Name,
			&s.Description,
		)
		if err != nil {
			return nil, err
		}
		result = append(result, s)
	}
	ss.Services = result
	return &ss, nil
}

func (db *DB) CreateServiceTx(ctx context.Context, tx *sql.Tx, s *graphql2.Superservice) (*graphql2.Superservice, error) {
	err := permission.LimitCheckAny(ctx, permission.Admin, permission.User)
	if err != nil {
		return nil, err
	}

	s.ID = uuid.New().String()
	stmt := db.insert
	if tx != nil {
		stmt = tx.Stmt(stmt)
	}
	_, err = stmt.ExecContext(ctx, s.ID, s.Name, s.Description)
	if err != nil {
		return nil, err
	}
	fmt.Println("SuperID", s.ID)
	stmt1 := db.insertMapping
	if tx != nil {
		stmt1 = tx.Stmt(stmt1)
	}
	_, err = stmt1.ExecContext(ctx, s.ID, sqlutil.UUIDArray(s.Services))
	if err != nil {
		return nil, err
	}

	return s, nil
}

func (db *DB) DeleteTx(ctx context.Context, tx *sql.Tx, ids []string) error {
	err := permission.LimitCheckAny(ctx, permission.Admin, permission.User)
	if err != nil {
		return err
	}
	stmt := db.deleteMapping
	if tx != nil {
		stmt = tx.StmtContext(ctx, stmt)
	}
	stmt.ExecContext(ctx, sqlutil.UUIDArray(ids))
	s := db.delete
	if tx != nil {
		s = tx.StmtContext(ctx, s)
	}
	_, err = s.ExecContext(ctx, sqlutil.UUIDArray(ids))
	return err
}

func (db *DB) UpdateTx(ctx context.Context, tx *sql.Tx, s *graphql2.UpdateSuperServiceInput) error {
	err := permission.LimitCheckAny(ctx, permission.Admin, permission.User)
	if err != nil {
		return err
	}
	stmt := db.deleteMapping
	if tx != nil {
		stmt = tx.StmtContext(ctx, stmt)
	}
	stmt.ExecContext(ctx, sqlutil.UUIDArray([]string{s.ID}))

	stmt1 := db.insertMapping
	if tx != nil {
		stmt1 = tx.Stmt(stmt1)
	}
	stmt1.ExecContext(ctx, s.ID, sqlutil.UUIDArray(s.Services))

	_, err = wrap(tx, db.update).ExecContext(ctx, s.ID, s.Name, s.Description)
	return err
}

func wrap(tx *sql.Tx, s *sql.Stmt) *sql.Stmt {
	if tx == nil {
		return s
	}
	return tx.Stmt(s)
}
