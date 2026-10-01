import { memo, useState } from "react";
import "./todoStyle.css";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfiguration";

function ToDoElement({ todo, id, toggleTodos, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.name);

  function handleToDoClick() {
    if (!isEditing) toggleTodos(id);
  }

  function handleCopy(e) {
    e.stopPropagation();
    navigator.clipboard.writeText(todo.name);
  }

  function handleDeleteTask(e) {
    e.stopPropagation();
    onDelete(id);
  }

  function handleEdit(e) {
    e.stopPropagation();
    setIsEditing(true);
  }

  function handleSave(e) {
    e.stopPropagation();
    if (e.key === "Enter" || e.type === "blur") {
      updateDoc(doc(db, "todos", id), { name: newText });
      setIsEditing(false);
    }
  }

  const displayName = todo.name.length > 100 ? todo.name.substring(0, 100) + "..." : todo.name;

  return (
    <div className="list-item" onClick={handleToDoClick}>
      {isEditing ? (
        <input
          className="input"
          style={{ margin: 0, padding: "0.4rem" }}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={handleSave}
          onBlur={handleSave}
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <>
          <div className={`circle ${todo.completed ? "circle-green" : "circle-grey"}`}></div>
          <label className={`task-label ${todo.completed ? "completed-label" : ""}`} title={todo.name}>
            {displayName}
          </label>
          <button onClick={handleCopy} className="copy-btn" title="Copy task name" aria-label="Copy task name">📋</button>
          <button onClick={handleEdit} className="copy-btn" title="Edit task" aria-label="Edit task" style={{ color: "#3498db" }}>✏️</button>
          <button onClick={handleDeleteTask} className="copy-btn" title="Delete task" aria-label="Delete task" style={{ color: "#e74c3c" }}>🗑️</button>
        </>
      )}
    </div>
  );
}

export default memo(ToDoElement);
