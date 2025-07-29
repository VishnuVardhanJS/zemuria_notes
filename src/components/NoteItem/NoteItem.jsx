import './NoteItem.css';

function NoteItem({ title, onDelete, onClick }) {
  return (
    <div className="note-item-container" onClick={onClick}>
      <h1>{title}</h1>
      <button
        className="delete-button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        Delete
      </button>
    </div>
  );
}

export default NoteItem;
