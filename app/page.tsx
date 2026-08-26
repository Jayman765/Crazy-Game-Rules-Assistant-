import { ChatPanel } from "@/components/chat/chat-panel";

/**
 * The QR-code landing page. It is a Server Component that renders a single
 * interactive island — the chat itself — so the client bundle stays small.
 * No conversation is loaded from anywhere: every visit starts fresh.
 */
export default function Home() {
  return (
    <main>
      <ChatPanel />
    </main>
  );
}
