import React, { useRef, useEffect } from "react";
import ToDoElement from "./ToDoElement";
import "./todoStyle.css";
import "./bootstrap/css/bootstrap.min.css";
import { db } from "./firebaseConfiguration";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
  addDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

export default function App() {
  const [todosSnapshot] = useCollection(
    query(collection(db, "todos"), orderBy("timestamp", "asc"))
  );

  //receives ID and changes prop of a checked task
  function toggleTodos(id) {
    const checkedTask = todosSnapshot?.docs.find((task) => task.id === id);
    //Update completed on DB
    const checkedTaskRef = doc(db, "todos", id);
    setDoc(
      checkedTaskRef,
      {
        completed: !checkedTask.data().completed,
      },
      { merge: true }
    );
  }

  const inputRef = useRef();

  //ADD TASK
  function handleAdd() {
    const newTask = inputRef.current.value;
    if (newTask === "") return;
    const todosColRef = collection(db, "todos");
    addDoc(todosColRef, {
      name: newTask,
      timestamp: Timestamp.fromDate(new Date()),
      completed: false,
    });
    inputRef.current.value = null; //resets input field
  }

  const [todosCompletedSnapshot] = useCollection(
    query(collection(db, "todos"), where("completed", "==", true))
  );

  //CLEAR COMPLETED
  function handleClear() {
    todosCompletedSnapshot.docs.forEach((task) => {
      deleteDoc(doc(db, "todos", task.id));
    });
  }

  //call add function when Enter is pressed
  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        handleAdd();
      }
    };
    document.addEventListener("keydown", listener); //when component is loaded
    return () => {
      document.removeEventListener("keydown", listener); //destroys the component
    };
  });

  return (
    <>
      <div class="container-box">
        <div class="header">
          <div class="list">
            {todosSnapshot?.docs.map((todoEl) => (
              <ToDoElement
                key={todoEl.id}
                id={todoEl.id}
                todo={todoEl.data()}
                toggleTodos={toggleTodos}
              />
            ))}
          </div>
        </div>
        <div class="features">
          <div class="row1">
            <input
              class="input"
              ref={inputRef}
              type="text"
              placeholder="Add your next Task..."
            />
          </div>
          <div class="row2">
            <p class="button button-add" onClick={handleAdd}>
              <strong>ADD NEW</strong>
            </p>
            <p class="button button-clear" onClick={handleClear}>
              <strong>CLEAR</strong>
            </p>
          </div>
          <div class="row3">
            <div class="text-bottom">
              YOU HAVE{" "}
              <strong>
                {
                  todosSnapshot?.docs.filter((todo) => !todo.data().completed)
                    .length
                }
              </strong>{" "}
              TASKS LEFT TO DO!
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
