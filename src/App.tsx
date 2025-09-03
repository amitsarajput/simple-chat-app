import { useEffect, useState } from "react";

import { faker } from "@faker-js/faker";
// Import `useMutation` and `api` from Convex.
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
// For demo purposes. In a real app, you'd have real user data.
const NAME = getOrSetFakeName();

export default function App() {
  const path = window.location.pathname;
  const messages = path === "/all-xyz-deleted" ? useQuery(api.chat.getDeletedMessages) : useQuery(api.chat.getMessages);
  // TODO: Add mutation hook here.
  const deleteAllMessages = useMutation(api.chat.deleteAllMessages);

  const sendMessage = useMutation(api.chat.sendMessage);
  const [newMessageText, setNewMessageText] = useState("");

  useEffect(() => {
    // Make sure scrollTo works on button click in Chrome
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 0);
  }, [messages]);

  return (
    <main className="chat">
      <header>
        <h1>Convex Chat</h1>
        <button
          onClick={async () => {
            if (confirm("Are you sure you want to delete all messages?")) {
              await deleteAllMessages();
            }
          }}
          className="delete-button"
        > Delete All Messages </button>
        <p>
          Connected as <strong>{NAME}</strong>
        </p>
      </header>
      {messages?.map((message) => (
        <article
          key={message._id}
          className={message.user === NAME ? "message-mine" : ""}
        >
          <div>{message.user}</div>

          <p>{message.body}
          { message.deleted_at? (
            <small><br />{new Date(message.deleted_at).toLocaleString()}</small>
            ) : null}
          </p>
        </article>
      ))}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          // Replace "alert("Mutation not implemented yet");" with:
          await sendMessage({ user: NAME, body: newMessageText });
          setNewMessageText("");
        }}
      >
        <input
          value={newMessageText}
          onChange={async (e) => {
            const text = e.target.value;
            setNewMessageText(text);
          }}
          placeholder="Write a message…"
          autoFocus
        />
        <button type="submit" disabled={!newMessageText}>
          Send
        </button>
      </form>
    </main>
  );
}

function getOrSetFakeName() {
  const NAME_KEY = "tutorial_name";
  const name = sessionStorage.getItem(NAME_KEY);
  if (!name) {
    const newName = faker.person.firstName();
    sessionStorage.setItem(NAME_KEY, newName);
    return newName;
  }
  return name;
}
