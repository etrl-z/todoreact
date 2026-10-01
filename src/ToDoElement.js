import React from "react";
import "./todoStyle.css";

export default function ToDoElement({ todo, id, toggleTodos }) {
  function handleToDoClick() {
    toggleTodos(id);
  }

  function handleCopy(e) {
    e.stopPropagation();
    navigator.clipboard.writeText(todo.name);
  }

  const displayName = todo.name.length > 30 ? todo.name.substring(0, 30) + "..." : todo.name;

  return (
    <div className="list-item" onClick={handleToDoClick}>
      {!todo.completed ? (
        <>
          <div className="circle circle-grey"></div>
          <label className="task-label" title={todo.name}>
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
        </>
      ) : (
        <>
          <div className="circle circle-green"></div>
          <label className="task-label completed-label" title={todo.name}>
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
        </>
      )}
    </div>
  );
}
