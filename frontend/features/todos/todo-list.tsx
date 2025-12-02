"use client";

import { useState, useEffect } from "react";
import { todoApi } from "./api";
import { Todo } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load todos
    useEffect(() => {
        loadTodos();
    }, []);

    async function loadTodos() {
        try {
            setLoading(true);
            setError(null);
            const data = await todoApi.getAll();
            setTodos(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load todos");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!newTodo.trim()) return;

        try {
            const created = await todoApi.create({
                title: newTodo,
                completed: false,
            });
            setTodos([...todos, created]);
            setNewTodo("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create todo");
        }
    }

    async function handleToggle(todo: Todo) {
        try {
            const updated = await todoApi.toggle(todo);
            setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update todo");
        }
    }

    async function handleDelete(id: number) {
        try {
            await todoApi.delete(id);
            setTodos(todos.filter((t) => t.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete todo");
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-muted-foreground">Loading todos...</p>
            </div>
        );
    }

    return (
        <div className="container max-w-2xl mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle>Todo List</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Error message */}
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                            {error}
                        </div>
                    )}

                    {/* Add todo form */}
                    <form onSubmit={handleCreate} className="flex gap-2">
                        <Input
                            placeholder="Add a new todo..."
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit">Add</Button>
                    </form>

                    {/* Todo list */}
                    <div className="space-y-2">
                        {todos.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                No todos yet. Add one above!
                            </p>
                        ) : (
                            todos.map((todo) => (
                                <div
                                    key={todo.id}
                                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                >
                                    <Checkbox
                                        checked={todo.completed}
                                        onCheckedChange={() => handleToggle(todo)}
                                    />
                                    <span
                                        className={`flex-1 ${
                                            todo.completed
                                                ? "line-through text-muted-foreground"
                                                : ""
                                        }`}
                                    >
                                        {todo.title}
                                    </span>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(todo.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Stats */}
                    <div className="pt-4 border-t text-sm text-muted-foreground text-center">
                        {todos.filter((t) => !t.completed).length} active •{" "}
                        {todos.filter((t) => t.completed).length} completed • {todos.length} total
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
