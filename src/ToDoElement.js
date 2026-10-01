import React from "react";
import "./todoStyle.css";

export default function ToDoElement({ todo, id, toggleTodos }) {
  function handleToDoClick() {
    toggleTodos(id);
  }

  function handleCopy() {
    navigator.clipboard.writeText(todo.name);
  }

  const displayName = todo.name.length > 30 ? todo.name.substring(0, 30) + "..." : todo.name;

  return (
    <div class="list-item" onClick={handleToDoClick}>
      {!todo.completed ? (
        <>
          <div class="circle circle-grey"></div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label title={todo.name} style={{ cursor: "pointer", marginRight: "8px" }}>
              {displayName}
            </label>
            <button
              onClick={handleCopy}
              className="copy-btn"
              title="Copy task name"
              aria-label="Copy task name"
            >
              📋
            </button>
          </div>
        </>
      ) : (
        <>
          <div class="circle circle-green"></div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label title={todo.name} style={{ textDecoration: "line-through", cursor: "pointer", marginRight: "8px" }}>
              {displayName}
            </label>
            <button
              onClick={handleCopy}
              className="copy-btn"
              title="Copy task name"
              aria-label="Copy task name"
            >
              📋
            </button>
          </div>
        </>
      )}
    </div>
  );
}