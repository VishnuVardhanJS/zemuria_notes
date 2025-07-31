import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./components/Header/Header";
import Note from "./components/Note/Note";
import NoteItem from "./components/NoteItem/NoteItem";
import { decryptData, encryptData } from "./utils/Encryption";
import { expect } from "vitest";


beforeEach(() => {
  const mockUser = { "displayName": "Vishnu Vardhan" }
  localStorage.setItem("user", JSON.stringify(mockUser));
});

test("Header Render", () => {
  render(<MemoryRouter>
    <Header />
  </MemoryRouter>);
  const textElement = screen.getByText(/Notes/i);
  expect(textElement).toBeInTheDocument();
});

test("Note Render", () => {
  render(
    <MemoryRouter>
      <Note
        setShowNote={() => { }}
        uuid={5616161651}
        title={"TestTitle"}
        content={"TestContent"}
        userId={165161}
      />
    </MemoryRouter>
  );

  const contentEl = screen.getByText(/TestContent/i);

  expect(contentEl).toBeInTheDocument();
});


test("NoteItem Render", () => {
  render(
    <MemoryRouter>
      <NoteItem
        title={"TestTitle"}
      />
    </MemoryRouter>
  );

  const contentEl = screen.getByText(/TestTitle/i);

  expect(contentEl).toBeInTheDocument();
});


test("Encryption Working", () => {
  const key = import.meta.env.VITE_AES_ENCRYPTION_KEY

  const content = "Hello World"

  const encryptedData = encryptData(content, key)

  const decryptedData = decryptData(encryptedData, key)

  expect(decryptedData).toBe(content)

  
});