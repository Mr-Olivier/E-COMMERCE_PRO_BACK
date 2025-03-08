"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
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
                                                              
${colors.yellow}${colors.bright}╔═══════════════════════════════════════════════════╗
║ ${colors.green}Backend API ${colors.yellow}| ${colors.white}${environment.toUpperCase()}${colors.yellow} | ${colors.white}v1.0.0${colors.yellow}                  ║
╚═══════════════════════════════════════════════════╝${colors.reset}
`;
app_1.default.listen(port, () => {
    // Clear console
    console.clear();
    // Print banner
    console.log(banner);
    // Print server information
    console.log(`${colors.bright}${colors.green}✅ Server Status:${colors.reset} Running`);
    console.log(`${colors.bright}${colors.blue}🌐 API URL:${colors.reset} http://localhost:${port}`);
    console.log(`${colors.bright}${colors.magenta}⏱️  Started at:${colors.reset} ${startTime.toLocaleString()}`);
    console.log(`${colors.bright}${colors.yellow}🔧 Environment:${colors.reset} ${environment}`);
    // Print available endpoints
    console.log(`\n${colors.bright}${colors.cyan}🚀 Available Endpoints:${colors.reset}`);
    console.log(`${colors.green}GET  ${colors.reset}/                           Health check`);
    console.log(`${colors.yellow}POST ${colors.reset}/api/auth/register           User registration`);
    console.log(`${colors.yellow}POST ${colors.reset}/api/auth/verify-otp         Email verification`);
    console.log(`${colors.yellow}POST ${colors.reset}/api/auth/login              User login`);
    console.log(`${colors.yellow}POST ${colors.reset}/api/auth/resend-otp         Resend verification code`);
    // Print a divider
    console.log(`\n${colors.bright}${colors.white}${"=".repeat(60)}${colors.reset}`);
    console.log(`${colors.bright}${colors.green}🔥 Server is ready to handle requests!${colors.reset}`);
    console.log(`${colors.bright}${colors.white}${"=".repeat(60)}${colors.reset}\n`);
});
// Handle shutdown gracefully
process.on("SIGINT", () => {
    console.log(`\n${colors.red}${colors.bright}⚠️  Shutting down server...${colors.reset}`);
    process.exit(0);
});
