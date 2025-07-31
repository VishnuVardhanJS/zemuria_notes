import "./Note.css";
import { useState } from "react";
import { db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { encryptData } from "../../utils/Encryption";
import { getPromts, grammarCorrection, summarizeContent } from "../../utils/GeminiSDK";
import swal from 'sweetalert';


function Note({ setShowNote, uuid, title, content, userId, onSave }) {
  const [editableTitle, setEditableTitle] = useState(title || "");
  const [editableContent, setEditableContent] = useState(content || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!userId) return alert("User not authenticated");

    setSaving(true);

    const noteRef = doc(db, "users", userId, "notes", uuid);

    const encrtyptedTitle = encryptData(editableTitle, import.meta.env.VITE_AES_ENCRYPTION_KEY)
    const encrtyptedContent = encryptData(editableContent, import.meta.env.VITE_AES_ENCRYPTION_KEY)
    const noteData = {
      title: encrtyptedTitle,
      content: encrtyptedContent,
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
        title: encryptData(title, import.meta.env.VITE_AES_ENCRYPTION_KEY),
        content: encryptData(content, import.meta.env.VITE_AES_ENCRYPTION_KEY),
        timestamp: new Date(),
      });
      const publicUrl = `${window.location.origin}/public/${uuid}`;
      await navigator.clipboard.writeText(publicUrl);
      // alert("link Copied to clipboard")

      swal({
        title: "Link Copied to Clipboard",
        icon: "success",
      });
    } catch (err) {
      console.error("Failed to make public:", err);
      alert("Failed to make public note.");
    }
  };


  const summarizeText = async () => {
    const summarizedContent = await summarizeContent(editableContent)
    swal({
      title: "Summarized Content",
      text: summarizedContent,
    });
  }

  const fixGrammar = async () => {
    const fixedGrammar = await grammarCorrection(editableContent)
    setEditableContent(fixedGrammar)
  }

  const getPromt = async () => {
    const formalContent = await getPromts(editableContent)
    setEditableContent(formalContent)
  }

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
        <div className="footer-btn-container">
          <div className="footer-buttons">
            <button className="ai-button" onClick={summarizeText}>
              Summarize
            </button>
            <button className="ai-button" onClick={fixGrammar} disabled={saving}>
              Fix Grammar
            </button>
            <button className="ai-button" onClick={getPromt}>
              Fix Note
            </button>
          </div>
          <div className="footer-buttons">
            <button className="ops-button" onClick={handleMakePublic}>
              Make Public
            </button>
            <button className="ops-button" onClick={handleSave} disabled={saving}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Note;
