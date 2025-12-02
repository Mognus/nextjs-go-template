import { TodoList } from "@/features/todos/todo-list";

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            <TodoList />
        </div>
    );
}
