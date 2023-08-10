package superservice

/*
 TLMT-2546
*/
import (
	"context"
	"database/sql"
	"text/template"

	"github.com/pkg/errors"
	"github.com/target/goalert/graphql2"
	"github.com/target/goalert/search"
	"github.com/target/goalert/util/sqlutil"
	"github.com/target/goalert/validation/validate"
)

type SearchOptions struct {
	// Search is matched case-insensitive against the service name and description.
	Search string `json:"s,omitempty"`

	// Omit specifies a list of service IDs to exclude from the results.
	Omit []string `json:"m,omitempty"`

	// Limit will limit the number of results.
	Limit int `json:"-"`

	After SearchCursor `json:"a,omitempty"`
}

type SearchCursor struct {
	Name string `json:"n"`
}

var searchTemplate = template.Must(template.New("search").Funcs(search.Helpers()).Parse(`
	SELECT
		ss.id,
		ss.name,
		ss.description
	FROM super_services ss
	WHERE true
	{{if .Omit}}
		AND not ss.id = any(:omit)
	{{end}}
	{{- if and .Search}}
		AND {{prefixSearch "search" "ss.name"}} OR {{prefixSearch "search" "ss.description"}}
	{{- end}}
	{{- if .After.Name}}
		AND
		
			(lower(ss.name) > lower(:afterName))
	{{- end}}
	ORDER BY lower(ss.name)
	LIMIT {{.Limit}}
`))

type renderData SearchOptions

func (opts renderData) Normalize() (*renderData, error) {
	if opts.Limit == 0 {
		opts.Limit = search.DefaultMaxResults
	}

	err := validate.Many(
		validate.Search("Search", opts.Search),
		validate.Range("Limit", opts.Limit, 0, search.MaxResults),
		validate.ManyUUID("Omit", opts.Omit, 50),
	)
	if opts.After.Name != "" {
		err = validate.Many(err, validate.IDName("After.Name", opts.After.Name))
	}

	if err != nil {
		return nil, err
	}
	return &opts, nil
}
func (opts renderData) QueryArgs() []sql.NamedArg {
	return []sql.NamedArg{
		sql.Named("search", opts.Search),
		sql.Named("afterName", opts.After.Name),
		sql.Named("omit", sqlutil.UUIDArray(opts.Omit)),
	}
}

func (db *DB) Search(ctx context.Context, opts *SearchOptions) ([]graphql2.Superservice, error) {
	if opts == nil {
		opts = &SearchOptions{}
	}

	data, err := (*renderData)(opts).Normalize()
	if err != nil {
		return nil, err
	}

	query, args, err := search.RenderQuery(ctx, searchTemplate, data)
	if err != nil {
		return nil, errors.Wrap(err, "render query")
	}

	rows, err := db.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []graphql2.Superservice
	for rows.Next() {
		var s graphql2.Superservice
		err = rows.Scan(&s.ID, &s.Name, &s.Description)
		if err != nil {
			return nil, err
		}

		result = append(result, s)
	}

	return result, nil
}
