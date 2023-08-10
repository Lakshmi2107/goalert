package superservice

/*
 TLMT-2546
*/
import (
	"github.com/target/goalert/service"
	"github.com/target/goalert/validation/validate"
)

type Superservice struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`

	// RBAC - start
	Permission string `json:"permission"`
	AdGroup    string `json:"adgroup"`

	Services []string `json:"services"`
}

type SuperServiceListAll struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`

	// RBAC - start
	Permission string `json:"permission"`
	AdGroup    string `json:"adgroup"`

	Services []service.Service `json:"services"`
}

func (s Superservice) Normalize() (*Superservice, error) {
	err := validate.Many(
		validate.IDName("Name", s.Name),
		validate.Text("Description", s.Description, 1, 255),
	)
	if err != nil {
		return nil, err
	}

	return &s, nil
}
