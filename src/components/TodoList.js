"use client";

import { useEffect, useState } from "react";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  }

  async function addTodo() {
    if (!newTodo) return;
    await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title: newTodo }),
      headers: { "Content-Type": "application/json" },
    });
    setNewTodo("");
    fetchTodos();
  }

  async function toggleTodo(id, completed) {
    await fetch("/api/todos", {
      method: "PUT",
      body: JSON.stringify({ id, completed: !completed }),
      headers: { "Content-Type": "application/json" },
    });
    fetchTodos();
  }

  async function deleteTodo(id) {
    await fetch("/api/todos", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    fetchTodos();
  }

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h1>To-Do List</h1>
      <div>
        <input
          style={{ padding: "8px", marginRight: "5px" }}
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="New task..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "5px 0" }}>
          <input 
            type="checkbox" 
            checked={todo.completed} 
            onChange={() => toggleTodo(todo.id, todo.completed)} 
          />
          <span 
            style={{ 
              cursor: "pointer", 
              marginLeft: "10px", 
              textDecoration: todo.completed ? "line-through" : "none" 
            }}
          >
            {todo.title}
          </span>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </li>
        
        ))}
      </ul>
    </div>
  );
}
