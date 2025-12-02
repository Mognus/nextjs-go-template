package main

import (
	"log"
	"os"

	"PROJECT_NAME/pkg/module"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	// Import your modules here (will be replaced in customer projects)
	// MODULES:IMPORT
	// Example:
	// "github.com/yourcompany/auth-module"
	// "github.com/yourcompany/todo-module"
	// END:MODULES:IMPORT
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment")
	}

	// Connect to database
	db := connectDatabase()

	// Create module registry
	registry := module.NewRegistry()

	// Register modules here (will be replaced in customer projects)
	// MODULES:REGISTER
	// Example:
	// registry.Register(auth.New(db, os.Getenv("JWT_SECRET")))
	// registry.Register(todo.New(db))
	// END:MODULES:REGISTER

	// Run migrations
	log.Println("Running database migrations...")
	if err := registry.MigrateAll(db); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}
	log.Println("✅ Migrations completed")

	// Create Fiber app
	app := fiber.New(fiber.Config{
		ErrorHandler: errorHandler,
	})

	// Middleware
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     getEnv("CORS_ALLOW_ORIGINS", "http://localhost:3000"),
		AllowCredentials: true,
	}))

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"modules": getModuleNames(registry),
		})
	})

	// API routes
	api := app.Group("/api")

	// Register all module routes
	registry.RegisterAll(api)

	// Start server
	port := getEnv("PORT", "8080")
	host := getEnv("HOST", "0.0.0.0")
	addr := host + ":" + port

	log.Printf("🚀 Server starting on http://%s", addr)
	log.Printf("📦 Loaded modules: %v", getModuleNames(registry))

	if err := app.Listen(addr); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

// connectDatabase establishes database connection
func connectDatabase() *gorm.DB {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		// Build DSN from components
		host := getEnv("DB_HOST", "localhost")
		port := getEnv("DB_PORT", "5432")
		user := getEnv("DB_USER", "postgres")
		password := getEnv("DB_PASSWORD", "postgres")
		dbname := getEnv("DB_NAME", "app_db")
		sslmode := getEnv("DB_SSLMODE", "disable")

		dsn = "host=" + host +
			" port=" + port +
			" user=" + user +
			" password=" + password +
			" dbname=" + dbname +
			" sslmode=" + sslmode
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("✅ Database connected")
	return db
}

// errorHandler handles Fiber errors
func errorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	message := "Internal Server Error"

	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
		message = e.Message
	}

	return c.Status(code).JSON(fiber.Map{
		"error": message,
	})
}

// getEnv gets environment variable with fallback
func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

// getModuleNames returns list of registered module names
func getModuleNames(registry *module.Registry) []string {
	modules := registry.GetModules()
	names := make([]string, len(modules))
	for i, m := range modules {
		names[i] = m.Name()
	}
	return names
}
