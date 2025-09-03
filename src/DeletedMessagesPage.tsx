import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function DeletedMessagesPage() {
  const deletedMessages = useQuery(api.chat.getDeletedMessages);

  return (
        <main className="chat deleted">
        <header>
            <h1>🗃️ Deleted Messages</h1>
            <p>These messages were softly deleted but not forgotten.</p>
        </header>

        {deletedMessages?.map((message) => (
            <article key={message._id} className="message-deleted">
                <div>{message.user}</div>
                <p>{message.body}</p>
                <small>
                Deleted at: {new Date(message.deleted_at).toLocaleString()}
                </small>
            </article>
        ))}
        </main>
    );
}