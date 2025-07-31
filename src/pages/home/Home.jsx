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
  query,
  orderBy
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { decryptData } from "../../utils/Encryption";

function Home() {
  const [userId, setUserId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [showNote, setShowNote] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [sortBy, setSortBy] = useState("none")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchNotes(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (sortBy !== "none") {
      fetchSortedNotes(userId, sortBy)
    }
  }, [sortBy])

  const fetchSortedNotes = async (uid, sort) => {
    const notesRef = collection(db, "users", uid, "notes");
    const q = query(notesRef, orderBy(sort, "desc"));
    const snapshot = await getDocs(q);

    const notesList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const sortedNotes = notesList.sort((a, b) => {
      const first = decryptData(a.title, import.meta.env.VITE_AES_ENCRYPTION_KEY)
      const second = decryptData(b.title, import.meta.env.VITE_AES_ENCRYPTION_KEY)
      if (first < second) return -1;
      if (first > second) return 1;
      return 0;
    });

    setNotes(sortedNotes);
  }

  const fetchSearchNotes = async (e) => {
    e.preventDefault();
    const querySnapshot = await getDocs(collection(db, "users", userId, "notes"));

    const results = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((note) =>
        decryptData(note.title, import.meta.env.VITE_AES_ENCRYPTION_KEY).includes(searchTerm)
      );
    setNotes(results)

  }


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

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
  };

  return (
    <div className="home-container">
      <Header />
      <div className="notes-container">
        <div className="note-option-cont">
          <button className="add-note-button" onClick={addNote}>Add Note</button>
          <div className="search-cont">
            <form onSubmit={fetchSearchNotes} className="search-form">
              <input
                type="text"
                placeholder="Search item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </form>
          </div>
          <div className="sort-cont">
            <select className="sort-select" id="sort-select" value={sortBy} onChange={handleSortChange}>
              <option value="none">None</option>
              <option value="updatedAt">Date</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
        <div className="notes">
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              title={decryptData(note.title, import.meta.env.VITE_AES_ENCRYPTION_KEY)}
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
          title={decryptData(currentNote.title, import.meta.env.VITE_AES_ENCRYPTION_KEY)}
          content={decryptData(currentNote.content, import.meta.env.VITE_AES_ENCRYPTION_KEY)}
          userId={userId}
          onSave={() => fetchNotes(userId)}
        />
      )}
    </div>
  );
}

export default Home;

