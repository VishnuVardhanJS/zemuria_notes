import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { decryptData } from "../../utils/Encryption";
import "./publicNote.css";


function PublicNote() {
  const { id } = useParams();
  const [note, setNote] = useState({ title: "", content: "" });

  useEffect(() => {
    const fetchNote = async () => {
      const docRef = doc(db, "public_notes", id);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data()
        const decryptedTitle = decryptData(data.title, import.meta.env.VITE_AES_ENCRYPTION_KEY)
        const decryptedContent = decryptData(data.content, import.meta.env.VITE_AES_ENCRYPTION_KEY)
        setNote({ title: decryptedTitle, content: decryptedContent });
      } else {
        setNote({ title: "Invalid Note", content: "This Note Does Not Exist" })
      }
    };

    fetchNote();
  }, [id]);

  return (
    <div className="public-note-container">
      <h1>{note.title}</h1>
      <p>{note.content}</p>
    </div>
  );
}

export default PublicNote;
