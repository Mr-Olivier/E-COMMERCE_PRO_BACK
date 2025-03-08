#!/bin/bash

# Function to generate conventional commit message
generate_commit_message() {
    local file="$1"
    local type=""
    local message=""

    # Determine commit type based on file path
    case "$file" in
        package-lock.json|package.json)
            type="chore(deps)"
            message="setup project dependencies"
            ;;
        prisma/schema.prisma)
            type="feat(db)"
            message="add password reset fields to schema"
            ;;
        prisma/migrations/*)
            type="chore(db)"
            message="add password reset migration"
            ;;
        dist/*)
            type="build"
            message="update compiled TypeScript files"
            ;;
        dist/app.js)
            type="build"
            message="update compiled Express application"
            ;;
        dist/server.js)
            type="build"
            message="update compiled server initialization"
            ;;
        dist/controllers/auth.controller.js)
            type="build"
            message="update compiled auth controller with password reset"
            ;;
        dist/routes/auth.routes.js)
            type="build"
            message="update compiled auth routes with password reset endpoints"
            ;;
        dist/services/email.service.js)
            type="build"
            message="update compiled email service for password reset"
            ;;
        dist/validations/auth.validation.js)
            type="build"
            message="update compiled validation schemas for password reset"
            ;;
        src/controllers/auth.controller.ts)
            type="feat(api)"
            message="implement password reset in auth controller"
            ;;
        src/routes/auth.routes.ts)
            type="feat(api)"
            message="add password reset endpoints to auth routes"
            ;;
        src/middlewares/auth.middleware.ts)
            type="feat(middleware)"
            message="add authentication middleware"
            ;;
        src/middlewares/error.middleware.ts)
            type="feat(middleware)"
            message="add error handling middleware"
            ;;
        src/middlewares/validation.middleware.ts)
            type="feat(middleware)"
            message="add validation middleware"
            ;;
        src/services/email.service.ts)
            type="feat(service)"
            message="add password reset email templates"
            ;;
        src/services/prisma.service.ts)
            type="feat(service)"
            message="add database service using Prisma"
            ;;
        src/utils/jwt.ts)
            type="feat(utils)"
            message="add JWT utility functions"
            ;;
        src/utils/otp.ts)
            type="feat(utils)"
            message="add OTP generation utility"
            ;;
        src/app.ts)
            type="feat(core)"
            message="add Express application setup"
            ;;
        src/server.ts)
            type="feat(core)"
            message="add server initialization"
            ;;
        src/routes/*)
            type="feat(api)"
            message="add API routes for ${file##*/}"
            ;;
        src/types/*)
            type="feat(types)"
            message="add TypeScript type definitions"
            ;;
        src/validations/auth.validation.ts)
            type="feat(validation)"
            message="add validation schemas for password reset"
            ;;
        src/validations/*)
            type="feat(validation)"
            message="add request validation schemas"
            ;;
        .gitignore)
            type="chore"
            message="add gitignore configuration"
            ;;
        tsconfig.json)
            type="chore"
            message="add TypeScript configuration"
            ;;
        structure.txt)
            type="docs"
            message="add project structure documentation"
            ;;
        commit.sh)
            type="chore"
            message="add commit automation script"
            ;;
        *)
            type="chore"
            message="add ${file##*/}"
            ;;
    esac

    echo "${type}: ${message}"
}

# Function to check if git repository
check_git_repo() {
    if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
        echo "Error: Not a git repository. Please initialize git first."
        exit 1
    fi
}

# Function to commit and push changes
commit_and_push_changes() {
    check_git_repo

    # Modified files
    modified_files=(
        "dist/app.js"
        "dist/controllers/auth.controller.js"
        "dist/routes/auth.routes.js"
        "dist/server.js"
        "dist/services/email.service.js"
        "dist/validations/auth.validation.js"
        "prisma/schema.prisma"
        "src/controllers/auth.controller.ts"
        "src/routes/auth.routes.ts"
        "src/services/email.service.ts"
        "src/validations/auth.validation.ts"
    )

    # Untracked files
    untracked_files=(
        "commit.sh"
        "prisma/migrations/20250305192740_add_password_reset_fields/"
    )

    # Process modified files
    for file in "${modified_files[@]}"; do
        if [ -e "$file" ]; then
            commit_message=$(generate_commit_message "$file")
            git add "$file"
            git commit -m "$commit_message"
            echo "Committed modified file: $file with message - $commit_message"
        else
            echo "Warning: File $file does not exist"
        fi
    done

    # Process untracked files
    for file in "${untracked_files[@]}"; do
        if [ -e "$file" ]; then
            commit_message=$(generate_commit_message "$file")
            git add "$file"
            git commit -m "$commit_message"
            echo "Committed new file: $file with message - $commit_message"
        else
            echo "Warning: File $file does not exist"
        fi
    done

    # Push all changes
    echo "Do you want to push changes to the remote repository? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]; then
        git push origin main
        echo "All changes have been committed and pushed successfully!"
    else
        echo "Changes have been committed locally. Use 'git push' to push them when ready."
    fi
}

# Run the function
commit_and_push_changes