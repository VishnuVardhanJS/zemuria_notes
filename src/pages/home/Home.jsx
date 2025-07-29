import NoteItem from "../../components/NoteItem/NoteItem";
import Header from "../../components/Header/Header";
import "./home.css";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Note from "../../components/Note/Note";
import { db, auth } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function Home() {
  const [userId, setUserId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [showNote, setShowNote] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchNotes(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);


  const fetchNotes = async (uid) => {
    const querySnapshot = await getDocs(collection(db, "users", uid, "notes"));
    const notesList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setNotes(notesList);
  };


  const addNote = () => {
    const id = uuidv4();
    setCurrentNote({
      id: id,
      title: "",
      content: "",
    });
    setShowNote(true);
  };


  const handleDelete = async (noteId) => {
    if (!userId || !noteId) return;

    try {
      await deleteDoc(doc(db, "users", userId, "notes", noteId));
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const openNote = async (noteId) => {
    if (!userId || !noteId) return;
    const docRef = doc(db, "users", userId, "notes", noteId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setCurrentNote({
        id: noteId,
        ...docSnap.data(),
      });
      setShowNote(true);
    } else {
      alert("Note not found!");
    }
  };

  return (
    <div className="home-container">
      <div className="notes-container">
        <Header />
        <button className="add-note-button" onClick={addNote}>Add Note</button>

        <div className="notes">
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              title={note.title}
              onDelete={() => handleDelete(note.id)}
              onClick={() => openNote(note.id)}
            />
          ))}
        </div>
      </div>

      {showNote && currentNote && (
        <Note
          setShowNote={setShowNote}
          uuid={currentNote.id}
          title={currentNote.title}
          content={currentNote.content}
          userId={userId}
          onSave={() => fetchNotes(userId)}
        />
      )}
    </div>
  );
}

export default Home;

