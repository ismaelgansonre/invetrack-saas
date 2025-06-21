#!/bin/bash
# This script automates the setup of the invetrack-saas monorepo.
# Some steps are interactive and require manual input as described in the comments.

# Exit immediately if a command exits with a non-zero status.
set -e

# 1. Create the Nx workspace
# This first step is interactive. Please provide the following answers to the prompts:
#
# ? Which stack do you want to use? › none
# ? Would you like to use Prettier for code formatting? › Yes
# ? Which CI provider would you like to use? › github
echo "Step 1: Creating Nx workspace (interactive)..."
pnpm create nx-workspace@latest invetrack-saas

# Navigate into the newly created directory
cd invetrack-saas
echo "--> Navigated to $(pwd)"

# 2. Add Nx plugin for Next.js
echo "Step 2: Adding @nx/next plugin..."
pnpm add -D @nx/next

# 3. Generate the Next.js frontend application
# This step is also interactive. Please provide the following answers:
#
# ? Which stylesheet format would you like to use? › tailwind
# ? Which linter would you like to use? › eslint
# ? What unit test runner should be used? › jest
# ? Which E2E test runner would you like to use? › playwright
# ? Would you like to use the App Router (recommended)? › Yes (y)
# ? Would you like to use \`src/\` directory? › Yes (y)
echo "Step 3: Generating Next.js application 'frontend' (interactive)..."
nx g @nx/next:app frontend

# 4. Set up Supabase project
echo "Step 4: Setting up Supabase..."
mkdir supabase
(cd supabase && npx supabase init) # Answer 'y' to the Deno settings prompt if it appears

# 5. Create the Refine admin panel
# This step is interactive. Please provide the following answers:
#
# ? Choose a project template › refine-nextjs
# ? What would you like to name your project?: › inventack-admin
# ? Choose your backend service to connect: › data-provider-supabase
# ? Do you want to use a UI Framework?: › tailwindcss
# ? Do you want to add example pages?: › headless-example
# ? Choose a package manager: › pnpm
# ? Mind sharing your email? › (You can skip this by pressing Enter)
echo "Step 5: Creating Refine admin panel 'inventack-admin' (interactive)..."
pnpm create refine-app@latest

# 6. Organize projects into the 'packages' directory
echo "Step 6: Organizing project structure..."
mv frontend packages/
mv frontend-e2e packages/
mv inventack-admin packages/

# 7. Create project.json for the frontend application
echo "Step 7: Creating project.json for frontend..."
cat <<'EOF' > packages/frontend/project.json
{
  "name": "frontend",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "packages/frontend",
  "projectType": "application",
  "targets": {
    "build": {
      "executor": "@nx/next:build",
      "outputs": ["{options.outputPath}"],
      "defaultConfiguration": "production",
      "options": {
        "outputPath": "dist/packages/frontend"
      },
      "configurations": {
        "development": {
          "outputPath": "."
        },
        "production": {}
      }
    },
    "serve": {
      "executor": "@nx/next:server",
      "defaultConfiguration": "development",
      "options": {
        "buildTarget": "frontend:build",
        "dev": true
      },
      "configurations": {
        "development": {
          "buildTarget": "frontend:build:development",
          "dev": true
        },
        "production": {
          "buildTarget": "frontend:build:production",
          "dev": false
        }
      }
    },
    "test": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
      "options": {
        "jestConfig": "packages/frontend/jest.config.ts"
      }
    }
  },
  "tags": []
}
EOF

# 8. Create project.json for the frontend-e2e tests
echo "Step 8: Creating project.json for frontend-e2e..."
cat <<'EOF' > packages/frontend-e2e/project.json
{
  "name": "frontend-e2e",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "packages/frontend-e2e/src",
  "projectType": "application",
  "targets": {
    "e2e": {
      "executor": "@nx/playwright:playwright",
      "outputs": ["{workspaceRoot}/dist/.playwright/packages/frontend-e2e"],
      "options": {
        "config": "packages/frontend-e2e/playwright.config.ts"
      }
    }
  },
  "tags": [],
  "implicitDependencies": ["frontend"]
}
EOF

# 9. Create project.json for the admin panel
echo "Step 9: Creating project.json for inventack-admin..."
cat <<'EOF' > packages/inventack-admin/project.json
{
  "name": "inventack-admin",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "packages/inventack-admin",
  "projectType": "application",
  "targets": {
    "build": {
      "executor": "@nx/next:build",
      "outputs": ["{options.outputPath}"],
      "defaultConfiguration": "production",
      "options": {
        "outputPath": "dist/packages/inventack-admin"
      },
      "configurations": {
        "development": {
          "outputPath": "."
        },
        "production": {}
      }
    },
    "serve": {
      "executor": "@nx/next:server",
      "defaultConfiguration": "development",
      "options": {
        "buildTarget": "inventack-admin:build",
        "dev": true
      },
      "configurations": {
        "development": {
          "buildTarget": "inventack-admin:build:development",
          "dev": true
        },
        "production": {
          "buildTarget": "inventack-admin:build:production",
          "dev": false
        }
      }
    }
  },
  "tags": []
}
EOF

# 10. Update the root tsconfig.json to reference the moved projects
echo "Step 10: Updating root tsconfig.json..."
cat <<'EOF' > tsconfig.json
{
  "extends": "./tsconfig.base.json",
  "compileOnSave": false,
  "files": [],
  "references": [
    {
      "path": "./packages/frontend-e2e"
    },
    {
      "path": "./packages/frontend"
    },
    {
      "path": "./packages/inventack-admin"
    }
  ]
}
EOF

# 11. Clean up pnpm-workspace.yaml
echo "Step 11: Cleaning up pnpm-workspace.yaml..."
cat <<'EOF' > pnpm-workspace.yaml
packages:
  - 'packages/*'
EOF

# 12. Install all dependencies
echo "Step 12: Installing dependencies..."
pnpm install

echo "✅ Monorepo setup script finished successfully!"
echo "You are in the project directory: $(pwd)"
echo "To start developing, you can use commands like 'nx serve frontend' or 'nx serve inventack-admin'."
