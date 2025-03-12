# #!/bin/bash

# # Function to generate conventional commit message
# generate_commit_message() {
#     local file="$1"
#     local type=""
#     local message=""

#     # Determine commit type based on file path
#     case "$file" in
#         package-lock.json|package.json)
#             type="chore(deps)"
#             message="update project dependencies"
#             ;;
#         prisma/schema.prisma)
#             type="feat(db)"
#             message="update database schema with product and cart models"
#             ;;
#         prisma/migrations/20250308192727_add_product_fields/)
#             type="chore(db)"
#             message="add migration for product fields"
#             ;;
#         prisma/migrations/20250309205300_add_cart_models/)
#             type="chore(db)"
#             message="add migration for cart models"
#             ;;
#         dist/app.js)
#             type="build"
#             message="update compiled Express application"
#             ;;
#         dist/controllers/auth.controller.js)
#             type="build"
#             message="update compiled auth controller"
#             ;;
#         dist/controllers/product.controller.js)
#             type="build"
#             message="add compiled product controller"
#             ;;
#         dist/controllers/cart.controller.js)
#             type="build"
#             message="add compiled cart controller"
#             ;;
#         dist/routes/product.routes.js)
#             type="build"
#             message="add compiled product routes"
#             ;;
#         dist/routes/cart.routes.js)
#             type="build"
#             message="add compiled cart routes"
#             ;;
#         dist/utils/upload.js)
#             type="build"
#             message="add compiled file upload utility"
#             ;;
#         dist/validations/product.validation.js)
#             type="build"
#             message="add compiled product validation schemas"
#             ;;
#         dist/validations/cart.validation.js)
#             type="build"
#             message="add compiled cart validation schemas"
#             ;;
#         src/app.ts)
#             type="feat(core)"
#             message="update Express application with product and cart routes"
#             ;;
#         src/controllers/auth.controller.ts)
#             type="feat(api)"
#             message="update auth controller"
#             ;;
#         src/controllers/product.controller.ts)
#             type="feat(api)"
#             message="add product controller for product management"
#             ;;
#         src/controllers/cart.controller.ts)
#             type="feat(api)"
#             message="add cart controller for shopping cart functionality"
#             ;;
#         src/routes/product.routes.ts)
#             type="feat(api)"
#             message="add product routes"
#             ;;
#         src/routes/cart.routes.ts)
#             type="feat(api)"
#             message="add cart routes"
#             ;;
#         src/utils/upload.ts)
#             type="feat(utils)"
#             message="add file upload utility for product images"
#             ;;
#         src/validations/product.validation.ts)
#             type="feat(validation)"
#             message="add product validation schemas"
#             ;;
#         src/validations/cart.validation.ts)
#             type="feat(validation)"
#             message="add cart validation schemas"
#             ;;
#         uploads/)
#             type="chore"
#             message="add uploads directory for product images"
#             ;;
#         commit.sh)
#             type="chore"
#             message="update commit automation script"
#             ;;
#         *)
#             type="chore"
#             message="update ${file##*/}"
#             ;;
#     esac

#     echo "${type}: ${message}"
# }

# # Function to check if git repository
# check_git_repo() {
#     if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
#         echo "Error: Not a git repository. Please initialize git first."
#         exit 1
#     fi
# }

# # Function to commit and push changes
# commit_and_push_changes() {
#     check_git_repo

#     # Modified files
#     modified_files=(
#         "commit.sh"
#         "dist/app.js"
#         "dist/controllers/auth.controller.js"
#         "package-lock.json"
#         "package.json"
#         "prisma/schema.prisma"
#         "src/app.ts"
#         "src/controllers/auth.controller.ts"
#     )

#     # Untracked files
#     untracked_files=(
#         "dist/controllers/cart.controller.js"
#         "dist/controllers/product.controller.js"
#         "dist/routes/cart.routes.js"
#         "dist/routes/product.routes.js"
#         "dist/utils/upload.js"
#         "dist/validations/cart.validation.js"
#         "dist/validations/product.validation.js"
#         "prisma/migrations/20250308192727_add_product_fields/"
#         "prisma/migrations/20250309205300_add_cart_models/"
#         "src/controllers/cart.controller.ts"
#         "src/controllers/product.controller.ts"
#         "src/routes/cart.routes.ts"
#         "src/routes/product.routes.ts"
#         "src/utils/upload.ts"
#         "src/validations/cart.validation.ts"
#         "src/validations/product.validation.ts"
#         "uploads/"
#     )

#     # Process modified files
#     for file in "${modified_files[@]}"; do
#         if [ -e "$file" ]; then
#             commit_message=$(generate_commit_message "$file")
#             git add "$file"
#             git commit -m "$commit_message"
#             echo "Committed modified file: $file with message - $commit_message"
#         else
#             echo "Warning: File $file does not exist"
#         fi
#     done

#     # Process untracked files
#     for file in "${untracked_files[@]}"; do
#         if [ -e "$file" ]; then
#             commit_message=$(generate_commit_message "$file")
#             git add "$file"
#             git commit -m "$commit_message"
#             echo "Committed new file: $file with message - $commit_message"
#         else
#             echo "Warning: File $file does not exist"
#         fi
#     done

#     # Push all changes
#     echo "Do you want to push changes to the remote repository? (y/n)"
#     read -r response
#     if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]; then
#         git push origin main
#         echo "All changes have been committed and pushed successfully!"
#     else
#         echo "Changes have been committed locally. Use 'git push' to push them when ready."
#     fi
# }

# # Run the function
# commit_and_push_changes





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
            message="update project dependencies"
            ;;
        prisma/schema.prisma)
            type="feat(db)"
            message="update database schema with product and cart models"
            ;;
        prisma/migrations/*)
            type="chore(db)"
            message="add database migration: ${file##*/}"
            ;;
        dist/app.js)
            type="build"
            message="update compiled Express application with payment routes"
            ;;
        dist/controllers/auth.controller.js)
            type="build"
            message="update compiled auth controller"
            ;;
        dist/controllers/checkout.controller.js)
            type="build"
            message="add compiled checkout controller"
            ;;
        dist/routes/payment.routes.js)
            type="build"
            message="add compiled payment routes"
            ;;
        dist/services/payment.service.js)
            type="build"
            message="add compiled payment service"
            ;;
        dist/validations/payment.validation.js)
            type="build"
            message="add compiled payment validation schemas"
            ;;
        src/app.ts)
            type="feat(core)"
            message="update Express application with order routes"
            ;;
        src/server.ts)
            type="feat(core)"
            message="update server configuration"
            ;;
        src/controllers/checkout.controller.ts)
            type="feat(api)"
            message="add checkout controller for order processing"
            ;;
        src/controllers/order.controller.ts)
            type="feat(api)"
            message="add order controller for order management"
            ;;
        src/routes/payment.routes.ts)
            type="feat(api)"
            message="add payment routes for order checkout"
            ;;
        src/routes/order.routes.ts)
            type="feat(api)"
            message="add order routes for order management"
            ;;
        src/services/payment.service.ts)
            type="feat(service)"
            message="add payment service for payment processing"
            ;;
        src/validations/payment.validation.ts)
            type="feat(validation)"
            message="add payment validation schemas"
            ;;
        src/validations/order.validation.ts)
            type="feat(validation)"
            message="add order validation schemas"
            ;;
        commit.sh)
            type="chore"
            message="update commit automation script"
            ;;
        *)
            type="chore"
            message="update ${file##*/}"
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
        "commit.sh"
        "src/app.ts"
        "src/server.ts"
    )

    # Untracked files
    untracked_files=(
        "src/controllers/order.controller.ts"
        "src/routes/order.routes.ts"
        "src/validations/order.validation.ts"
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