package graphqlapp

/*
TLMT-2546
*/
import (
	context "context"
	"database/sql"
	"os"
	"strings"

	"github.com/target/goalert/graphql2"
	"github.com/target/goalert/search"
	"github.com/target/goalert/service"
	"github.com/target/goalert/superservice"
)

type Superservice App

func (q *Query) Superservices(ctx context.Context, opts *graphql2.SuperServiceSearchOptions) (conn *graphql2.SuperServiceConnection, err error) {
	if opts == nil {
		opts = &graphql2.SuperServiceSearchOptions{}
	}

	var searchOpts superservice.SearchOptions

	if opts.Search != nil {
		searchOpts.Search = *opts.Search
	}
	searchOpts.Omit = opts.Omit

	if opts.After != nil && *opts.After != "" {
		err = search.ParseCursor(*opts.After, &searchOpts)
		if err != nil {
			return nil, err
		}
	}
	if opts.First != nil {
		searchOpts.Limit = *opts.First
	}
	if searchOpts.Limit == 0 {
		searchOpts.Limit = 15
	}

	searchOpts.Limit++

	//ss, err := q.SuperserviceStore.FindAll(ctx)
	ss, err := q.SuperserviceStore.Search(ctx, &searchOpts)

	if err != nil {
		return nil, err
	}

	conn = new(graphql2.SuperServiceConnection)
	conn.PageInfo = &graphql2.PageInfo{}
	if len(ss) == searchOpts.Limit {
		ss = ss[:len(ss)-1]
		conn.PageInfo.HasNextPage = true
	}
	if len(ss) > 0 {
		last := ss[len(ss)-1]
		searchOpts.After.Name = last.Name

		cur, err := search.Cursor(searchOpts)
		if err != nil {
			return conn, err
		}
		conn.PageInfo.EndCursor = &cur
	}
	conn.Nodes = ss

	conn.Nodes = ss
	return conn, err

}

func (q *Query) Listservices(ctx context.Context, id string) ([]service.Service, error) {
	return q.SuperserviceStore.FindServicesBySuperService(ctx, id)

}

func (q *Query) Superservice(ctx context.Context, id string) (*graphql2.SuperserviceListAll, error) {
	//TLMT-5041
	rbacenabled := os.Getenv("RBAC_ENABLED")
	if strings.EqualFold(rbacenabled, "true") {
		superservice, _ := q.SuperserviceStore.FindByID(ctx, id)
		// RBAC - start
		// if ctx.Value("token") != nil {
		// 	token := ctx.Value("token").(string)
		// 	if err != nil {
		// 		return nil, err
		// 	}
		// 	roles := ctx.Value("user_groups").([]string)
		// 	if err != nil {
		// 		return nil, err
		// 	}
		// 	if superservice != nil {
		// 		// role, err := (*App)(q).checkAuthFromCasbin("supersvc_"+superservice.Name, roles, token)
		// 		// if len(role) == 0 || err != nil {
		// 		// 	*superservice.Permission = "editor"
		// 		// 	superservice.Adgroup = ""

		// 		// } else {
		// 		// 	superservice.Permission = &role[0][3]
		// 		// 	superservice.Adgroup = role[0][0]
		// 		// }
		// 	}
		//}
		return superservice, nil
	} else {
		superservice, err := q.SuperserviceStore.FindByID(ctx, id)
		if superservice != nil {
			superservice.Adgroup = ""
		}
		return superservice, err
	}

}

func (m *Mutation) CreateSuperService(ctx context.Context, input graphql2.CreateSuperServiceInput) (result *graphql2.Superservice, err error) {

	err = withContextTx(ctx, m.DB, func(ctx context.Context, tx *sql.Tx) error {
		ss := &graphql2.Superservice{
			Name:        input.Name,
			Description: input.Description,
			Services:    input.Services,
		}

		ssvc := superservice.Superservice{
			Name:        input.Name,
			Description: input.Description,
			Services:    input.Services,
		}

		_, err := ssvc.Normalize()
		if err != nil {
			return err
		}

		result, err = m.SuperserviceStore.CreateServiceTx(ctx, tx, ss)
		if err != nil {
			return err
		}

		return err
	})

	return result, err
}

func (a *Mutation) UpdateSuperService(ctx context.Context, input graphql2.UpdateSuperServiceInput) (bool, error) {
	tx, err := a.DB.BeginTx(ctx, nil)
	if err != nil {
		return false, err
	}
	defer tx.Rollback()

	ss := &graphql2.UpdateSuperServiceInput{
		ID:          input.ID,
		Name:        input.Name,
		Description: input.Description,
		Services:    input.Services,
	}
	if ss.Name != nil {
		err = a.SuperserviceStore.UpdateTx(ctx, tx, ss)

		if err != nil {
			return false, err
		}

		err = tx.Commit()
		if err != nil {
			return false, err
		}
	}

	return true, nil
}
