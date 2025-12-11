# Fullstack Template (Next.js + Go Fiber)

A production-ready fullstack template with modular architecture using Git Subtrees.

---

## 📑 Table of Contents

- [Quick Start](#-quick-start)
- [Architecture Overview](#-architecture-overview)
- [Git Subtree Workflow](#-git-subtree-workflow)
  - [What are Git Subtrees?](#what-are-git-subtrees)
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

# 3. Create a customer branch
git checkout -b customer/kunde-a

# 4. Install dependencies
cd backend && go mod download && cd ..
cd frontend && npm install && cd ..

# 5. Start development
make dev
```

---

## 🏗️ Architecture Overview

This template uses a **modular architecture** with **Git Subtrees** to manage reusable backend and frontend modules.

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
├── modules/               # Git Subtree modules
│   ├── auth-module/       # Authentication module (Subtree)
│   │   ├── backend/       # Go backend code
│   │   └── frontend/      # React components
│   ├── todo-module/       # Todo CRUD module (Subtree)
│   │   ├── backend/
│   │   └── frontend/
│   └── backend-core/      # Core utilities (Subtree)
│       └── backend/
└── docker-compose.dev.yml
```

### Key Concepts

- **Template Repository**: The base template (this repo) that can be forked for customer projects
- **Module Repositories**: Separate Git repositories containing reusable modules
- **Git Subtrees**: Mechanism to include module repositories as subdirectories in the template
- **Customer Projects**: Forks of the template, customized for specific customers

---

## 🌳 Git Subtree Workflow

### What are Git Subtrees?

Git Subtrees allow you to include another repository as a subdirectory in your project. Unlike submodules:

- ✅ **No special commands needed** to clone (just `git clone`)
- ✅ **Code is physically present** in the repository
- ✅ **Bidirectional sync** - pull updates from module repo, push changes back
- ✅ **Customer projects stay independent** - modules become normal code after forking

### Adding Modules

To add a new module as a subtree:

```bash
# Syntax
git subtree add --prefix modules/<module-name> <repo-url> <branch> --squash

# Example: Add auth module
git subtree add --prefix modules/auth-module https://github.com/yourcompany/fiber-auth-module main --squash
```

**Parameters:**
- `--prefix`: Where to place the module in your repository
- `<repo-url>`: URL of the module repository
- `<branch>`: Branch to pull from (usually `main`)
- `--squash`: Squash commits for cleaner history

### Updating Modules

Pull latest changes from a module repository:

```bash
# Update auth module
git subtree pull --prefix modules/auth-module https://github.com/yourcompany/fiber-auth-module main --squash

# Update all modules
git subtree pull --prefix modules/auth-module https://github.com/yourcompany/fiber-auth-module main --squash
git subtree pull --prefix modules/todo-module https://github.com/yourcompany/fiber-todo-module main --squash
git subtree pull --prefix modules/backend-core https://github.com/yourcompany/backend-core main --squash
```

### Contributing Back to Modules

If you fix a bug or improve a module, push changes back to the module repository:

```bash
# Example: You fixed a bug in auth-module
git add modules/auth-module
git commit -m "Fix: Auth token validation"

# Push changes back to module repo
git subtree push --prefix modules/auth-module https://github.com/yourcompany/fiber-auth-module main
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
git subtree pull --prefix modules/auth-module https://github.com/yourcompany/fiber-auth-module main --squash

# Resolve conflicts if any
git add .
git commit -m "Update auth-module to latest version"
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
git subtree pull --prefix modules/auth-module https://github.com/yourcompany/fiber-auth-module main --squash

# Push to your fork
git push origin customer/kunde-a
```

---

## 🔧 Troubleshooting

### "refusing to merge unrelated histories"

**Problem:** Git can't merge subtree updates.

**Solution:**
```bash
# First time adding a module
git subtree add --prefix modules/auth-module <url> main --squash

# For updates, use pull (not add)
git subtree pull --prefix modules/auth-module <url> main --squash
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

### Merge conflicts during subtree pull

**Problem:** Conflicts when pulling module updates.

**Solution:**
1. Resolve conflicts manually
2. Mark as resolved: `git add <conflicted-files>`
3. Continue merge: `git commit`
4. Push: `git push`

### Module removed but still in dependencies

**Problem:** Removed a module but build fails with import errors.

**Solution:**
1. Search for imports: `grep -r "modules/todo-module" .`
2. Remove all references in code
3. Run `go mod tidy` in backend
4. Update `tsconfig.json` paths if needed

---

## 📚 Additional Resources

- [Git Subtree Documentation](https://git-scm.com/book/en/v2/Git-Tools-Subtrees)
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
