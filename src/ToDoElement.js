import React from "react";
import "./todoStyle.css";

export default function ToDoElement({ todo, id, toggleTodos }) {
  function handleToDoClick() {
    toggleTodos(id);
  }

  return (
    <div class="list-item" onClick={handleToDoClick}>
      {!todo.completed ? (
        <>
          <div class="circle circle-grey"></div>
          <label>{todo.name}</label>
        </>
      ) : (
        <>
          <div class="circle circle-green"></div>
          <label>
            <s>{todo.name}</s>
          </label>
        </>
      )}
    </div>
  );
}
