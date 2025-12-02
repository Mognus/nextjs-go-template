package module

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// Module represents a pluggable feature module
// Each module can register routes, run migrations, and provide middleware
type Module interface {
	// Name returns the module name (e.g., "auth", "todos")
	Name() string

	// RegisterRoutes registers HTTP routes for this module
	RegisterRoutes(router fiber.Router)

	// Migrate runs database migrations for this module
	// Returns error if migration fails
	Migrate(db *gorm.DB) error
}

// Registry manages all registered modules
type Registry struct {
	modules []Module
}

// NewRegistry creates a new module registry
func NewRegistry() *Registry {
	return &Registry{
		modules: make([]Module, 0),
	}
}

// Register adds a module to the registry
func (r *Registry) Register(m Module) {
	r.modules = append(r.modules, m)
}

// RegisterAll calls RegisterRoutes on all modules
func (r *Registry) RegisterAll(router fiber.Router) {
	for _, m := range r.modules {
		m.RegisterRoutes(router)
	}
}

// MigrateAll runs migrations for all modules
func (r *Registry) MigrateAll(db *gorm.DB) error {
	for _, m := range r.modules {
		if err := m.Migrate(db); err != nil {
			return err
		}
	}
	return nil
}

// GetModules returns all registered modules
func (r *Registry) GetModules() []Module {
	return r.modules
}
