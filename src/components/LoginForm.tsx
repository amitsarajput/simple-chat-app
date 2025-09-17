import { useState } from "react";
import { storeName } from "./utils";

type Props = {
  onLogin: (name: string) => void;
};

export function LoginForm({ onLogin }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      storeName(name);
      onLogin(name.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Welcome to Find Your Formula</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}