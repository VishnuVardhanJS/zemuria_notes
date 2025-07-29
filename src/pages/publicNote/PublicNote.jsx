import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./PublicNote.css";

function PublicNote() {
  const { id } = useParams();
  console.log(id)
  const [note, setNote] = useState({ title: "Not Found", content: "This note doesn't exist." });

  useEffect(() => {
    const fetchNote = async () => {
      const docRef = doc(db, "public_notes", id);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setNote(docSnap.data());
      } 
    };

    fetchNote();
  }, [id]);

  return (
    <div className="public-note-container">
      <h1>{note.title}</h1>
      <pre>{note.content}</pre>
    </div>
  );
}

export default PublicNote;
