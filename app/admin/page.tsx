import type { Metadata } from "next";

import { AdminLogin } from "@/components/admin/admin-login";
import { AdminLogs } from "@/components/admin/admin-logs";
import { isAdminAuthenticated } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Playtest Logs — The Crazy Game",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Single shared-password admin view. The session check happens here on the
 * server, and every admin API route repeats it independently — hiding the UI
 * is never the protection.
 */
export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  return authenticated ? <AdminLogs /> : <AdminLogin />;
}
