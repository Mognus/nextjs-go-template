# Fullstack Template (Next.js + Go Fiber)

A production-ready fullstack template with modular architecture using Git Submodules.

---

## 📑 Table of Contents

- [Quick Start](#-quick-start)
- [Architecture Overview](#-architecture-overview)
- [Git Submodule Workflow](#-git-submodule-workflow)
  - [What are Git Submodules?](#what-are-git-submodules)
  - [Adding Modules](#adding-modules)
  - [Updating Modules](#updating-modules)
  - [Contributing Back to Modules](#contributing-back-to-modules)
- [Creating Customer Projects](#-creating-customer-projects)
  - [Fork-Based Workflow](#fork-based-workflow)
  - [Removing Unnecessary Modules](#removing-unnecessary-modules)
  - [Getting Updates](#getting-updates)
- [Module System](#-module-system)
  - [Available Modules](#available-modules)
  - [Module Structure](#module-structure)
- [Development](#-development)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
  - [Running the Project](#running-the-project)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start

```bash
# 1. Fork this repository on GitHub
# 2. Clone your fork
git clone https://github.com/yourcompany/your-fork.git
cd your-fork

# 3. Initialize submodules
git submodule update --init --recursive

# 4. Create a customer branch
git checkout -b customer/kunde-a

# 5. Install dependencies
cd backend && go mod download && cd ..
cd frontend && npm install && cd ..

# 6. Start development
make dev
```

---

## 🏗️ Architecture Overview

This template uses a **modular architecture** with **Git Submodules** to manage reusable backend and frontend modules.

```
template/
├── backend/                # Go Fiber backend
│   ├── cmd/server/        # Main application entry point
│   ├── pkg/               # Shared packages
│   └── go.mod
├── frontend/              # Next.js frontend
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   └── package.json
├── modules/               # Git Submodule modules
│   ├── auth-module/       # Authentication module (Submodule)
│   │   ├── backend/       # Go backend code
│   │   └── frontend/      # React components
│   ├── todo-module/       # Todo CRUD module (Submodule)
│   │   ├── backend/
│   │   └── frontend/
│   └── backend-core/      # Core utilities (Submodule)
│       └── backend/
└── docker-compose.dev.yml
```

### Key Concepts

- **Template Repository**: The base template (this repo) that can be forked for customer projects
- **Module Repositories**: Separate Git repositories containing reusable modules
- **Git Submodules**: Mechanism to include module repositories as subdirectories in the template
- **Customer Projects**: Forks of the template, customized for specific customers

---

## 🌳 Git Submodule Workflow

### What are Git Submodules?

Git Submodules allow you to include another repository as a subdirectory in your project. Key characteristics:

- ✅ **Pin specific versions** - Each submodule points to a specific commit
- ✅ **Independent development** - Modules can be developed separately
- ✅ **Flexible versioning** - Different projects can use different module versions
- ✅ **Direct editing** - Edit module code directly and push to module repo
- ⚠️ **Requires init** - After cloning, run `git submodule update --init --recursive`

### Adding Modules

To add a new module as a submodule:

```bash
# Syntax
git submodule add <repo-url> modules/<module-name>

# Example: Add auth module
git submodule add git@github.com:yourcompany/fiber-auth-module.git modules/auth-module

# Commit the .gitmodules file and submodule
git add .gitmodules modules/auth-module
git commit -m "Add auth-module as submodule"
git push
```

**What happens:**
- Creates `.gitmodules` file with submodule configuration
- Clones the module repository into `modules/auth-module`
- Creates a commit pointer to the current module commit

### Updating Modules

Pull latest changes from module repositories:

```bash
# Update a specific module to latest commit
cd modules/auth-module
git pull origin main
cd ../..
git add modules/auth-module
git commit -m "Update auth-module to latest version"
git push

# Update all modules to their latest commits
git submodule update --remote
git add modules/
git commit -m "Update all modules to latest versions"
git push
```

### Switching Module Versions

Pin a module to a specific version/tag/commit:

```bash
# Switch to a specific version
cd modules/auth-module
git checkout v1.5.0  # or specific commit hash
cd ../..
git add modules/auth-module
git commit -m "Pin auth-module to v1.5.0"
git push
```

### Contributing Back to Modules

You can edit module code directly in your project and push to the module repository:

```bash
# Make changes in the module
cd modules/auth-module
vim backend/pkg/auth/handlers.go

# Commit and push to module repo
git add .
git commit -m "Fix: Auth token validation"
git push origin main

# Update the pointer in template repo
cd ../..
git add modules/auth-module
git commit -m "Update auth-module with bug fix"
git push
```

**When to push back:**
- 🐛 Bug fixes that benefit all projects
- ✨ New features that are generic enough
- 📝 Documentation improvements

**When NOT to push back:**
- 🔒 Customer-specific customizations
- 🎨 Project-specific styling
- 🔧 Configuration changes

---

## 👥 Creating Customer Projects

### Fork-Based Workflow

The recommended way to create a customer project is to **fork the template repository** on GitHub.

#### Step 1: Fork on GitHub

1. Go to the template repository
2. Click the **"Fork"** button (top right)
3. Name it: `kunde-a-project` (or any name)
4. Click **"Create fork"**

#### Step 2: Clone & Setup

```bash
# Clone your fork
git clone https://github.com/yourcompany/kunde-a-project.git
cd kunde-a-project

# Initialize submodules
git submodule update --init --recursive

# Add template as upstream (optional, for template updates)
git remote add upstream https://github.com/yourcompany/template.git

# Create customer branch
git checkout -b customer/kunde-a

# Update project names in config files
sed -i 's|module github.com/yourcompany/template|module github.com/yourcompany/kunde-a|g' backend/go.mod
sed -i 's|"name": ".*"|"name": "kunde-a-frontend"|g' frontend/package.json

# Commit changes
git add .
git commit -m "Initialize project: kunde-a"
git push -u origin customer/kunde-a
```

#### Step 3: Install Dependencies

```bash
# Backend
cd backend
go mod download
cd ..

# Frontend
cd frontend
npm install
cd ..

# Start development
make dev
```

### Removing Unnecessary Modules

Customer projects may not need all modules. Remove them:

```bash
# Remove todo module (example)
rm -rf modules/todo-module

# Commit the change
git add .
git commit -m "Remove todo-module (not needed)"
git push
```

**Note:** After removing a module, you may need to:
- Remove imports in backend code
- Remove components in frontend code
- Update `go.mod` dependencies

### Getting Updates

#### From Module Repositories

Pull latest module updates:

```bash
# Update a specific module
cd modules/auth-module
git pull origin main
cd ../..
git add modules/auth-module
git commit -m "Update auth-module to latest version"
git push

# Or update all modules at once
git submodule update --remote
git add modules/
git commit -m "Update all modules"
git push
```

#### From Template Repository

If the template itself gets improvements:

```bash
# Fetch template updates
git fetch upstream

# Merge template changes (careful with conflicts!)
git merge upstream/main

# Or cherry-pick specific commits
git cherry-pick <commit-hash>
```

---

## 🧩 Module System

### Available Modules

#### 1. `backend-core`
Core utilities and shared packages for Go backend.

**Location:** `modules/backend-core/backend/`
**Provides:**
- Error handling (`pkg/errors/errors.go`)
- Common utilities
- Shared types

**Repository:** `https://github.com/yourcompany/backend-core`

#### 2. `auth-module`
Complete authentication system with JWT.

**Location:** `modules/auth-module/`
**Backend (`backend/`):**
- User model with password hashing
- JWT token generation
- Login, Register, Logout endpoints
- `/api/auth/me` endpoint

**Frontend (`frontend/`):**
- `LoginForm.tsx` component
- `RegisterForm.tsx` component
- `useAuth.ts` hook
- API client

**Repository:** `https://github.com/yourcompany/fiber-auth-module`

#### 3. `todo-module`
CRUD module for todo management.

**Location:** `modules/todo-module/`
**Backend (`backend/`):**
- Todo model
- CRUD endpoints (GET, POST, PUT, DELETE)
- `/api/todos` routes

**Frontend (`frontend/`):**
- `TodoList.tsx` component
- `TodoItem.tsx` component
- `useTodos.ts` hook
- API client

**Repository:** `https://github.com/yourcompany/fiber-todo-module`

### Module Structure

Each module follows this structure:

```
module-name/
├── backend/
│   ├── pkg/<module>/      # Go package
│   │   ├── module.go      # Module interface implementation
│   │   ├── models.go      # Database models
│   │   └── handlers.go    # HTTP handlers
│   ├── go.mod             # Go dependencies
│   └── README.md
├── frontend/
│   ├── components/        # React components
│   ├── hooks/             # React hooks
│   ├── lib/               # API clients
│   ├── types/             # TypeScript types
│   └── package.json       # Frontend dependencies
└── README.md              # Module documentation
```

### Using Modules in Your Project

#### Backend Integration

1. **Import the module:**
   ```go
   import (
       "github.com/yourcompany/template/modules/auth-module/backend/pkg/auth"
   )
   ```

2. **Register routes:**
   ```go
   // In backend/cmd/server/main.go
   authModule := auth.New(db, jwtSecret)
   authModule.RegisterRoutes(api)
   ```

3. **Run migrations:**
   ```go
   authModule.Migrate(db)
   ```

#### Frontend Integration

1. **Import components:**
   ```tsx
   import { LoginForm } from '@/modules/auth-module/frontend/components/LoginForm'
   ```

2. **Use hooks:**
   ```tsx
   import { useAuth } from '@/modules/auth-module/frontend/hooks/useAuth'

   function MyComponent() {
     const { user, login, logout } = useAuth()
     // ...
   }
   ```

3. **Configure path mappings in `tsconfig.json`:**
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/modules/*": ["../modules/*"]
       }
     }
   }
   ```

---

## 💻 Development

### Prerequisites

- **Go:** 1.23+
- **Node.js:** 18+
- **npm:** 9+
- **PostgreSQL:** 14+ (or use Docker)
- **Docker & Docker Compose** (optional)

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourcompany/template.git
   cd template
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   go mod download
   cd ..
   ```

3. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Configure environment:**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your settings

   # Frontend
   cp frontend/.env.local.example frontend/.env.local
   # Edit frontend/.env.local with your settings
   ```

5. **Start database:**
   ```bash
   docker-compose up -d postgres
   ```

### Running the Project

#### Using Make (Recommended)

```bash
# Start everything (backend + frontend + database)
make dev

# Stop everything
make stop

# View logs
make logs

# Run tests
make test
```

#### Manual

```bash
# Terminal 1: Database
docker-compose up postgres

# Terminal 2: Backend
cd backend
go run cmd/server/main.go

# Terminal 3: Frontend
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- Swagger Docs: http://localhost:8080/swagger

---

## 📋 Best Practices

### For Template Maintainers

1. **Keep modules generic** - Avoid customer-specific code in modules
2. **Version modules** - Use Git tags for module versions
3. **Document changes** - Update module READMEs with breaking changes
4. **Test before pushing** - Test module changes in template before pushing to module repos

### For Customer Projects

1. **Branch strategy:**
   - `main` or `master`: Production-ready code
   - `customer/<name>`: Customer-specific development branch
   - `feature/<name>`: Feature branches

2. **Updating modules:**
   - Test in development environment first
   - Review changes carefully (breaking changes!)
   - Document any conflicts resolved

3. **Customizing modules:**
   - If changes are customer-specific: Keep them in your fork
   - If changes are generic: Consider pushing back to module repo

4. **Staying updated:**
   - Regularly pull module updates (monthly/quarterly)
   - Pull template updates if beneficial
   - Keep dependencies up to date

### Git Workflow

```bash
# Good workflow for customer project
git checkout customer/kunde-a

# Make changes
git add .
git commit -m "feat: Add customer-specific feature"

# Pull module updates regularly
cd modules/auth-module
git pull origin main
cd ../..
git add modules/auth-module
git commit -m "Update auth-module"

# Push to your fork
git push origin customer/kunde-a
```

---

## 🔧 Troubleshooting

### Submodules not cloned after git clone

**Problem:** After cloning the repository, `modules/` directories are empty.

**Solution:**
```bash
# Initialize and clone all submodules
git submodule update --init --recursive
```

### Submodule detached HEAD

**Problem:** Submodule is in "detached HEAD" state after update.

**Solution:**
```bash
# This is normal! Submodules point to specific commits.
# To work on the module, checkout a branch:
cd modules/auth-module
git checkout main
# Make changes, commit, push
git push origin main
cd ../..
git add modules/auth-module
git commit -m "Update auth-module pointer"
```

### Module import errors in Go

**Problem:** `cannot find package "github.com/yourcompany/backend-core/pkg/errors"`

**Solution:** Check `go.mod` replace directives:
```go
// In modules/auth-module/backend/go.mod
replace github.com/yourcompany/backend-core => ../../backend-core/backend
```

### Frontend path resolution errors

**Problem:** `Cannot find module '@/modules/auth-module/frontend/components/LoginForm'`

**Solution:** Add path mapping in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/modules/*": ["../modules/*"]
    }
  }
}
```

### Merge conflicts during module update

**Problem:** Conflicts when pulling module updates.

**Solution:**
```bash
cd modules/auth-module
git pull origin main
# Resolve conflicts in files
git add .
git commit -m "Resolve merge conflicts"
git push origin main
cd ../..
git add modules/auth-module
git commit -m "Update auth-module with conflict resolution"
git push
```

### Module removed but still in dependencies

**Problem:** Removed a module but build fails with import errors.

**Solution:**
1. Search for imports: `grep -r "modules/todo-module" .`
2. Remove all references in code
3. Run `go mod tidy` in backend
4. Update `tsconfig.json` paths if needed

---

## 📚 Additional Resources

- [Git Submodules Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [Go Fiber Documentation](https://docs.gofiber.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [GitHub Fork Workflow](https://docs.github.com/en/get-started/quickstart/fork-a-repo)

---

## 📝 License

[Your License Here]

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

---

**Made with ❤️ by [Your Company]**
