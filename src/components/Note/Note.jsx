import "./Note.css";
import { useState } from "react";
import { db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

function Note({ setShowNote, uuid, title, content, userId, onSave }) {
  const [editableTitle, setEditableTitle] = useState(title || "");
  const [editableContent, setEditableContent] = useState(content || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!userId) return alert("User not authenticated");

    setSaving(true);

    const noteRef = doc(db, "users", userId, "notes", uuid);
    const noteData = {
      title: editableTitle,
      content: editableContent,
      updatedAt: new Date(),
    };

    try {
      await setDoc(noteRef, noteData, { merge: true });
      onSave?.(); // refresh note list
      setShowNote(false);
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note.");
    } finally {
      setSaving(false);
    }
  };


  const handleMakePublic = async () => {
    try {
      const publicRef = doc(db, "public_notes", uuid);
      await setDoc(publicRef, {
        title,
        content,
        timestamp: new Date(),
      });
      const publicUrl = `${window.location.origin}/public/${uuid}`;
      await navigator.clipboard.writeText(publicUrl);
      alert("link Copied to clipboard")
    } catch (err) {
      console.error("Failed to make public:", err);
      alert("Failed to make public note.");
    }
  };

  return (
    <div className="note-overlay">
      <div className="note-popup">
        <button className="note-close-button" onClick={() => setShowNote(false)}>
          ✕
        </button>

        <div className="note-title">
          <input
            value={editableTitle}
            onChange={(e) => setEditableTitle(e.target.value)}
            placeholder="Enter title"
          />
        </div>

        <div className="note-content">
          <textarea
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            placeholder="Write your note here..."
          />
        </div>
        <button className="make-public-button" onClick={handleMakePublic}>
          Make Public
        </button>
        <button className="note-save-button" onClick={handleSave} disabled={saving}>
          Save
        </button>
      </div>
    </div>
  );
}

export default Note;
