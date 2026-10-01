import { memo, useState } from "react";
import "./todoStyle.css";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfiguration";

function SectionAddButton({ onAdd }) {
  return (
    <div className="section-row" onClick={onAdd}>
      <button className="section-btn" aria-label="Add section" title="Insert section">+</button>
    </div>
  );
}

function SectionItem({ todo, id, onDelete, toggleTodos }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(
    (todo?.name || "").replace("__SECTION__:", "")
  );

  function handleCopy(e) {
    e.stopPropagation();
    navigator.clipboard.writeText((todo?.name || "").replace("__SECTION__:", ""));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  }

  function handleEdit(e) {
    e.stopPropagation();
    setIsEditing(true);
  }

  function handleSave(e) {
    e.stopPropagation();
    if (e.key === "Enter" || e.type === "blur") {
      const savedName = newText.trim();
      const finalName = savedName ? `__SECTION__:${savedName}` : "__SECTION__";
      updateDoc(doc(db, "todos", id), { name: finalName });
      setIsEditing(false);
    }
  }

  return (
    <div className="section-item">
      {isEditing ? (
        <input
          className="input"
          style={{ margin: 0, padding: "0.4rem", flex: 1 }}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={handleSave}
          onBlur={handleSave}
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <>
          <span className="section-label">{(todo?.name === "__SECTION__") ? "— new section —" : (todo?.name || "").replace("__SECTION__:", "")}</span>
          <div className="actions">
            <button onClick={handleCopy} className={`action-btn ${isCopied ? "copy-btn copied" : ""}`} title="Copy section name" aria-label="Copy section name">📋</button>
            <button onClick={handleEdit} className="action-btn edit-btn" title="Edit section" aria-label="Edit section">✏️</button>
            <button className="action-btn delete-btn" onClick={(e) => { e.stopPropagation(); onDelete(id); }} title="Delete section" aria-label="Delete section">🗑️</button>
          </div>
        </>
      )}
    </div>
  );
}

function ToDoElement({ todo, id, toggleTodos, onDelete, onAddSection }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo?.name || "");

  function handleToDoClick() {
    if (!isEditing) toggleTodos(id);
  }

  function handleCopy(e) {
    e.stopPropagation();
    navigator.clipboard.writeText(todo.name);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
    e.currentTarget.blur();
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

  const displayName = todo && todo.name ? (todo.name.length > 100 ? todo.name.substring(0, 100) + "..." : todo.name) : "";

  // If it's a section
  if (todo && todo.name && todo.name.startsWith("__SECTION__")) {
    return <SectionItem id={id} todo={todo} onDelete={onDelete} toggleTodos={toggleTodos} />;
  }

  return (
    <div className="list-item" onClick={handleToDoClick}>
      <button
        className="add-section-btn"
        onClick={(e) => { e.stopPropagation(); onAddSection(); }}
        title="Insert section below"
        aria-label="Insert section below"
      >+</button>
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
          <div className="actions">
            <button onClick={handleCopy} className={`action-btn ${isCopied ? "copy-btn copied" : ""}`} title="Copy task name" aria-label="Copy task name">📋</button>
            <button onClick={handleEdit} className="action-btn edit-btn" title="Edit task" aria-label="Edit task">✏️</button>
            <button onClick={handleDeleteTask} className="action-btn delete-btn" title="Delete task" aria-label="Delete task">🗑️</button>
          </div>
        </>
      )}
    </div>
  );
}

export { SectionAddButton };
export default memo(ToDoElement);
