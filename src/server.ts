// src/server.ts
import app from "./app";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const port = process.env.PORT || 4000;
const environment = process.env.NODE_ENV || "development";

// ANSI color codes for terminal
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

// Server start time
const startTime = new Date();

// ASCII art banner
const banner = `
${colors.cyan}${colors.bright}
   ______                                                      
  / ____/________  ____ ___  ____ ___  ___  _____________     
 / __/ / ___/ __ \\/ __ \`__ \\/ __ \`__ \\/ _ \\/ ___/ ___/ _ \\    
/ /___/ /__/ /_/ / / / / / / / / / / /  __/ /  / /__/  __/    
\\____/\\___/\\____/_/ /_/ /_/_/ /_/ /_/\\___/_/   \\___/\\___/     
                                                              
${colors.yellow}${
  colors.bright
}╔═══════════════════════════════════════════════════╗
║ ${colors.green}Backend API ${colors.yellow}| ${
  colors.white
}${environment.toUpperCase()}${colors.yellow} | ${colors.white}v1.0.0${
  colors.yellow
}                  ║
╚═══════════════════════════════════════════════════╝${colors.reset}
`;

app.listen(port, () => {
  // Clear console
  console.clear();

  // Print banner
  console.log(banner);

  // Print server information
  console.log(
    `${colors.bright}${colors.green}✅ Server Status:${colors.reset} Running`
  );
  console.log(
    `${colors.bright}${colors.blue}🌐 API URL:${colors.reset} http://localhost:${port}`
  );
  console.log(
    `${colors.bright}${colors.magenta}⏱️  Started at:${
      colors.reset
    } ${startTime.toLocaleString()}`
  );
  console.log(
    `${colors.bright}${colors.yellow}🔧 Environment:${colors.reset} ${environment}`
  );

  // Print available endpoints
  console.log(
    `\n${colors.bright}${colors.cyan}🚀 Available Endpoints:${colors.reset}`
  );

  // Auth endpoints
  console.log(`\n${colors.bright}${colors.cyan}Authentication:${colors.reset}`);
  console.log(
    `${colors.yellow}POST ${colors.reset}/api/auth/register           User registration`
  );
  console.log(
    `${colors.yellow}POST ${colors.reset}/api/auth/verify-otp         Email verification`
  );
  console.log(
    `${colors.yellow}POST ${colors.reset}/api/auth/login              User login`
  );
  console.log(
    `${colors.yellow}POST ${colors.reset}/api/auth/logout             User logout`
  );
  console.log(
    `${colors.yellow}POST ${colors.reset}/api/auth/resend-otp         Resend verification code`
  );
  console.log(
    `${colors.yellow}POST ${colors.reset}/api/auth/forgot-password    Request password reset`
  );
  console.log(
    `${colors.yellow}POST ${colors.reset}/api/auth/verify-reset-otp   Verify reset code`
  );
  console.log(
    `${colors.yellow}POST ${colors.reset}/api/auth/reset-password     Set new password`
  );

  // User endpoints
  console.log(
    `\n${colors.bright}${colors.cyan}User Management:${colors.reset}`
  );
  console.log(
    `${colors.green}GET  ${colors.reset}/api/users/profile           Get user profile`
  );
  console.log(
    `${colors.blue}PATCH${colors.reset}/api/users/profile           Update user profile`
  );
  console.log(
    `${colors.yellow}POST ${colors.reset}/api/users/change-password   Change password`
  );

  // Product endpoints
  console.log(
    `\n${colors.bright}${colors.cyan}Product Management:${colors.reset}`
  );
  console.log(
    `${colors.green}GET  ${colors.reset}/api/products                Get all products`
  );
  console.log(
    `${colors.green}GET  ${colors.reset}/api/products/:id            Get product details`
  );
  console.log(
    `${colors.yellow}POST ${colors.reset}/api/products                Create product (Admin)`
  );
  console.log(
    `${colors.blue}PUT  ${colors.reset}/api/products/:id            Update product (Admin)`
  );
  console.log(
    `${colors.red}DEL  ${colors.reset}/api/products/:id            Delete product (Admin)`
  );

  // Cart endpoints
  console.log(
    `\n${colors.bright}${colors.cyan}Cart Management:${colors.reset}`
  );
  console.log(
    `${colors.green}GET  ${colors.reset}/api/cart                    Get user's cart`
  );
  console.log(
    `${colors.yellow}POST ${colors.reset}/api/cart/items              Add item to cart`
  );
  console.log(
    `${colors.blue}PUT  ${colors.reset}/api/cart/items/:itemId      Update cart item`
  );
  console.log(
    `${colors.red}DEL  ${colors.reset}/api/cart/items/:itemId      Remove from cart`
  );
  console.log(
    `${colors.red}DEL  ${colors.reset}/api/cart                    Clear cart`
  );

  // Order endpoints
  console.log(
    `\n${colors.bright}${colors.cyan}Order Management:${colors.reset}`
  );
  console.log(
    `${colors.green}GET  ${colors.reset}/api/orders                  Get user's orders`
  );
  console.log(
    `${colors.green}GET  ${colors.reset}/api/orders/:id              Get order details`
  );
  console.log(
    `${colors.yellow}POST ${colors.reset}/api/orders                  Create order from cart`
  );
  console.log(
    `${colors.blue}PATCH${colors.reset}/api/orders/:id/cancel       Cancel order`
  );
  console.log(
    `${colors.green}GET  ${colors.reset}/api/orders/admin/all        Get all orders (Admin)`
  );
  console.log(
    `${colors.blue}PATCH${colors.reset}/api/orders/:id/status       Update order status (Admin)`
  );

  // Payment endpoints
  console.log(
    `\n${colors.bright}${colors.cyan}Payment Processing:${colors.reset}`
  );
  console.log(
    `${colors.yellow}POST ${colors.reset}/api/checkout/create-checkout-session  Create payment session`
  );
  console.log(
    `${colors.yellow}POST ${colors.reset}/api/checkout/confirm-payment            Confirm payment`
  );
  console.log(
    `${colors.yellow}POST ${colors.reset}/api/checkout/create-paypal-checkout        Create-PayPal-Checkout`
  );
  console.log(
    `${colors.yellow}POST ${colors.reset}/api/checkout/confirm-paypal-payment        Confirm-PayPal-Payment`
  );
  // Health check
  console.log(`\n${colors.bright}${colors.cyan}System:${colors.reset}`);
  console.log(
    `${colors.green}GET  ${colors.reset}/                           Health check`
  );

  // Print a divider
  console.log(
    `\n${colors.bright}${colors.white}${"=".repeat(60)}${colors.reset}`
  );
  console.log(
    `${colors.bright}${colors.green}🔥 Server is ready to handle requests!${colors.reset}`
  );
  console.log(
    `${colors.bright}${colors.white}${"=".repeat(60)}${colors.reset}\n`
  );
});

// Handle shutdown gracefully
process.on("SIGINT", () => {
  console.log(
    `\n${colors.red}${colors.bright}⚠️  Shutting down server...${colors.reset}`
  );
  process.exit(0);
});
