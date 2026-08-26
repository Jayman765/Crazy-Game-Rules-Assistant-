import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
    The rules references are read from the filesystem at runtime so the client
    can replace the Markdown without touching application code. Vercel's build
    tracer can't see through a dynamically-joined path, so the content folder is
    included in the chat route's serverless bundle explicitly.
  */
  outputFileTracingIncludes: {
    "/api/chat": ["./content/**/*.md"],
  },

  serverExternalPackages: ["mongodb"],

  // Don't scatter generated AI-assistant rule files through the repo.
  agentRules: false,
};

export default nextConfig;
