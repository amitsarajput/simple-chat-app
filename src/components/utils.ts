import { faker } from "@faker-js/faker";

export const NAME_KEY = "tutorial_name";
export const SUBJECT_KEY = "selected_subject";

export function getStoredName(): string | null {
  return sessionStorage.getItem(NAME_KEY);
}

export function storeName(name: string) {
  sessionStorage.setItem(NAME_KEY, name.trim());
}

export function getInitialSubject(): "physics" | "chemistry" | "maths" {
  const stored = sessionStorage.getItem(SUBJECT_KEY);
  if (stored === "physics" || stored === "chemistry" || stored === "maths") {
    return stored;
  }
  sessionStorage.setItem(SUBJECT_KEY, "physics");
  return "physics";
}

export function isChatHidden(): boolean {
  return sessionStorage.getItem("chat_hidden") === "true";
}

export function generateFakeName(): string {
  const newName = faker.person.firstName();
  storeName(newName);
  return newName;
}