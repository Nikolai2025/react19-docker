import { configureStore, createSlice,nanoid } from "@reduxjs/toolkit";
/* React + Context API version of the Todo app (run via Babel in the browser) */
const { useState, useEffect, createContext, useContext } = React;

const STORAGE_KEY = "redux-todo-items";

const TodoContext = createContext(null);

function TodoProvider({ children }) {
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {}
  }, [todos]);

  const add = (text) => {
    const newTodo = { id: Date.now().toString(), text, completed: false };
    setTodos((t) => [...t, newTodo]);
  };

  const toggle = (id) => {
    setTodos((t) => t.map(x => x.id === id ? { ...x, completed: !x.completed } : x));
  };

  const remove = (id) => {
    setTodos((t) => t.filter(x => x.id !== id));
  };

  return (
    <TodoContext.Provider value={{ todos, add, toggle, remove }}>
      {children}
    </TodoContext.Provider>
  );
}

function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodos must be used within TodoProvider");
  return ctx;
}

function App() {
  return (
    <div>
      <TodoForm />
      <TodoList />
    </div>
  );
}

function TodoForm() {
  const { add } = useTodos();
  const [value, setValue] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;
    add(text);
    setValue("");
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', gap: '.5rem' }}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add todo..."
        style={{ flex: 1 }}
      />
      <button type="submit">Add</button>
    </form>
  );
}

function TodoList() {
  const { todos } = useTodos();

  if (!todos.length) return <ul style={{ padding: 0, marginTop: '1rem' }}><li>Ingen todos endnu</li></ul>;

  return (
    <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

function TodoItem({ todo }) {
  const { toggle, remove } = useTodos();

  return (
    <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.6rem .2rem', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.06)' }} onClick={() => toggle(todo.id)}>
      <span className={"todo-text" + (todo.completed ? " completed" : "")}>{todo.text}</span>
      <button type="button" onClick={(e) => { e.stopPropagation(); remove(todo.id); }}>✕</button>
    </li>
  );
}

// Mount app
const root = document.getElementById('root');
ReactDOM.createRoot(root).render(
  <TodoProvider>
    <App />
  </TodoProvider>
);

