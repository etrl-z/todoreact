import { useRef, useEffect, useState, useCallback } from "react";
import ToDoElement from "./ToDoElement";
import "./todoStyle.css";
import "./bootstrap/css/bootstrap.min.css";
import { db } from "./firebaseConfiguration";
import { useCollection } from "react-firebase-hooks/firestore";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
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
  updateDoc,
} from "firebase/firestore";

export default function App() {
  const [todosSnapshot] = useCollection(
    query(collection(db, "todos"), orderBy("order", "asc"))
  );

  // Local list to avoid Firestore snapshot re-render glitch during drag
  const [localTodos, setLocalTodos] = useState([]);

  useEffect(() => {
    if (todosSnapshot) {
      setLocalTodos(todosSnapshot.docs);
    }
  }, [todosSnapshot]);

  // Delete single task
  function handleDelete(id) {
    deleteDoc(doc(db, "todos", id));
  }

  // Receives ID and changes prop of a checked task
  function toggleTodos(id) {
    const checkedTask = localTodos?.find((task) => task.id === id);
    const checkedTaskRef = doc(db, "todos", id);
    setDoc(
      checkedTaskRef,
      {
        completed: !checkedTask?.data()?.completed,
      },
      { merge: true }
    );
  }

  // DELETE TASK
  function handleDelete(id) {
    deleteDoc(doc(db, "todos", id));
  }

  const inputRef = useRef();

  // ADD TASK
  function handleAdd() {
    const newTask = inputRef.current.value;
    if (newTask === "") return;
    const todosColRef = collection(db, "todos");
    addDoc(todosColRef, {
      name: newTask,
      timestamp: Timestamp.fromDate(new Date()),
      completed: false,
      order: localTodos?.length || 0,
    });
    inputRef.current.value = null;
  }

  const [todosCompletedSnapshot] = useCollection(
    query(collection(db, "todos"), where("completed", "==", true))
  );

  // CLEAR COMPLETED
  function handleClear() {
    todosCompletedSnapshot?.docs?.forEach((task) => {
      deleteDoc(doc(db, "todos", task.id));
    });
  }

  // Call add function when Enter is pressed
  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        handleAdd();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  });

  // Drag n drop handler using local state (optimistic UI)
  const handleOnDragEnd = useCallback((result) => {
    if (!result.destination || !localTodos) return;
    const reordered = Array.from(localTodos);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);

    // Update local state immediately for smooth animation
    setLocalTodos(reordered);

    // Persist to DB
    reordered.forEach((docSnap, index) => {
      setDoc(doc(db, "todos", docSnap.id), { order: index }, { merge: true });
    });
  }, [localTodos]);

  const todosToRender = localTodos || [];

  return (
    <>
      <div className="container-box">
        <div className="header">
          <div className="list">
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="todos">
                {(provided) => (
                  <div
                    className="list"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {todosToRender.map((todoEl, index) => (
                      <Draggable
                        key={todoEl.id}
                        draggableId={todoEl.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            key={todoEl.id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ToDoElement
                              id={todoEl.id}
                              todo={todoEl.data()}
                              toggleTodos={toggleTodos}
                              onDelete={handleDelete}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>

        <div className="features">
          <div className="row1">
            <input
              className="input"
              ref={inputRef}
              type="text"
              placeholder="Add your next Task..."
            />
          </div>
          <div className="row2">
            <p className="button button-add" onClick={handleAdd}>
              <strong>ADD NEW</strong>
            </p>
            <p className="button button-clear" onClick={handleClear}>
              <strong>CLEAR</strong>
            </p>
          </div>
          <div className="row3">
            <div className="text-bottom">
              YOU HAVE{" "}
              <strong>
                {todosToRender.filter((todo) => !todo.data().completed)
                  .length}
              </strong>{" "}
              TASKS LEFT TO DO!
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
