import { api } from "@/lib/api";
import { Todo, CreateTodoDto, UpdateTodoDto } from "./types";

/**
 * Todo API client
 * Maps to backend routes: /api/todos
 */
export const todoApi = {
    /**
     * Get all todos
     * GET /api/todos
     */
    async getAll(): Promise<Todo[]> {
        const response = await api.get<Todo[]>("/todos");
        return response.data;
    },

    /**
     * Get a single todo by ID
     * GET /api/todos/:id
     */
    async getById(id: number): Promise<Todo> {
        const response = await api.get<Todo>(`/todos/${id}`);
        return response.data;
    },

    /**
     * Create a new todo
     * POST /api/todos
     */
    async create(data: CreateTodoDto): Promise<Todo> {
        const response = await api.post<Todo>("/todos", data);
        return response.data;
    },

    /**
     * Update a todo
     * PUT /api/todos/:id
     */
    async update(id: number, data: UpdateTodoDto): Promise<Todo> {
        const response = await api.put<Todo>(`/todos/${id}`, data);
        return response.data;
    },

    /**
     * Toggle todo completion status
     * PUT /api/todos/:id
     */
    async toggle(todo: Todo): Promise<Todo> {
        return this.update(todo.id, {
            title: todo.title,
            completed: !todo.completed,
        });
    },

    /**
     * Delete a todo
     * DELETE /api/todos/:id
     */
    async delete(id: number): Promise<void> {
        await api.delete(`/todos/${id}`);
    },
};
