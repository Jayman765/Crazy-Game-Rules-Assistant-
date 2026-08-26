/**
 * Generates the value for the ADMIN_PASSWORD_HASH environment variable.
 *
 *   npm run hash-password -- "your-admin-password"
 *
 * The plaintext password is never written to a file — copy the printed hash
 * into your Vercel environment variables (and your local .env.local).
 */
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

import { hashPassword } from "../lib/auth/password";

async function main() {
  let password = process.argv[2];

  if (!password) {
    const rl = createInterface({ input: stdin, output: stdout });
    password = (await rl.question("New admin password: ")).trim();
    rl.close();
  }

  if (!password) {
    console.error("A password is required.");
    process.exit(1);
  }

  if (password.length < 10) {
    console.error(
      "Please choose a password of at least 10 characters — this is the only lock on the logs page.",
    );
    process.exit(1);
  }

  const hash = await hashPassword(password);

  console.log("\nAdd this to your environment variables:\n");
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
