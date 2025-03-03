import TodoList from "@/components/TodoList";

export default function Home() {
  return (
    <main style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <TodoList />
    </main>
  );
}
