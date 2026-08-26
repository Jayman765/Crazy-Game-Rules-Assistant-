/**
 * Generates a random ADMIN_SESSION_SECRET.
 *
 *   npm run generate-secret
 */
import { randomBytes } from "node:crypto";

console.log(`\nADMIN_SESSION_SECRET=${randomBytes(32).toString("base64url")}\n`);
