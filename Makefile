.PHONY: dev dev-detach stop restart logs logs-frontend logs-backend logs-db shell-frontend shell-backend shell-db clean ps help

# Default target
help:
	@echo "Available commands:"
	@echo "  make dev              - Start all services (frontend, backend, postgres)"
	@echo "  make dev-detach       - Start all services in background"
	@echo "  make stop             - Stop all services"
	@echo "  make restart          - Restart all services"
	@echo "  make logs             - View logs from all services"
	@echo "  make logs-frontend    - View frontend logs"
	@echo "  make logs-backend     - View backend logs"
	@echo "  make logs-db          - View database logs"
	@echo "  make shell-frontend   - Shell access to frontend container"
	@echo "  make shell-backend    - Shell access to backend container"
	@echo "  make shell-db         - PostgreSQL shell (psql)"
	@echo "  make clean            - Stop and remove all containers, volumes, images"
	@echo "  make ps               - Show running containers"

# Start all services
dev:
	docker compose -f docker-compose.dev.yml up

# Start all services in background
dev-detach:
	docker compose -f docker-compose.dev.yml up -d

# Stop all services
stop:
	docker compose -f docker-compose.dev.yml down

# Restart all services
restart:
	docker compose -f docker-compose.dev.yml restart

# View logs from all services
logs:
	docker compose -f docker-compose.dev.yml logs -f

# View frontend logs
logs-frontend:
	docker compose -f docker-compose.dev.yml logs -f frontend

# View backend logs
logs-backend:
	docker compose -f docker-compose.dev.yml logs -f backend

# View database logs
logs-db:
	docker compose -f docker-compose.dev.yml logs -f postgres

# Shell access to frontend container
shell-frontend:
	docker compose -f docker-compose.dev.yml exec frontend sh

# Shell access to backend container
shell-backend:
	docker compose -f docker-compose.dev.yml exec backend sh

# PostgreSQL shell
shell-db:
	docker compose -f docker-compose.dev.yml exec postgres psql -U postgres -d PROJECT_NAME_db

# Clean up everything
clean:
	docker compose -f docker-compose.dev.yml down -v --rmi all

# Show running containers
ps:
	docker compose -f docker-compose.dev.yml ps
