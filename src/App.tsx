import { useEffect, useState } from "react";

import { faker } from "@faker-js/faker";
// Import `useMutation` and `api` from Convex.
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
// For demo purposes. In a real app, you'd have real user data.
const NAME = getOrSetFakeName();
const SUBJECT_KEY = "selected_subject";

export default function App() {
  const path = window.location.pathname;

  const [activeTab, setActiveTab] = useState<"physics" | "chemistry" | "maths">(getInitialSubject());

  
  
  // Clear chat_hidden only if user visits /show-chat
  useEffect(() => {
    if (sessionStorage.getItem("chat_hidden")===null) {
      sessionStorage.setItem("chat_hidden", "true");
      setHidden(sessionStorage.getItem("chat_hidden") === "true");
    }
    if (path === "/all-subjects") {
      sessionStorage.setItem("chat_hidden", "false");
      // Redirect back to home after unlocking
      window.location.replace("/");
    }else if (path === "/all-xyz-deleted") {
      sessionStorage.setItem("chat_hidden", "false");
    }else if (path === "/ses"){
      sessionStorage.clear();
      console.log(sessionStorage.getItem("chat_hidden")===null);
    }
  }, [path]);
  

  
  const [hidden, setHidden] = useState(isChatHidden());
  //console.log("chat_hidden:", sessionStorage.getItem("chat_hidden"));
  //console.log("hidden state:", hidden);


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
      
      {!hidden ? (
        <>
        <header>
        <h1>Convex Chat</h1>
        <div className="header-actions">
          <button
            onClick={async () => {
              if (confirm("Are you sure you want to delete all messages?")) {
                await deleteAllMessages();
              }
            }}
            className="delete-button"
          > Delete All Messages </button>
          <button
            onClick={() => {
              sessionStorage.setItem("chat_hidden", "true");
              window.location.reload(); // Refresh to apply hidden state
            }}
            className="hide-button"
          >
            🙈 Hide Chat
          </button>
        </div>
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
      </>
      ) : (
        <p>Chat is hidden</p>
      )
      }

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

function isChatHidden() {
  return sessionStorage.getItem("chat_hidden") === "true";
}

function getInitialSubject(): "physics" | "chemistry" | "maths" {
  const stored = sessionStorage.getItem(SUBJECT_KEY);
  if (stored === "physics" || stored === "chemistry" || stored === "maths") {
    return stored;
  }
  sessionStorage.setItem(SUBJECT_KEY, "physics"); // default
  return "physics";
}


