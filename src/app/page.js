"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoaded, setIsLoaded] = useState(false); // Para evitar problemas de hidratación en Next.js
  const [editingId, setEditingId] = useState(null); // Guardará el ID de la tarea que estamos editando


  // HISTORIA 3: Cargar tareas de localStorage al montar el componente
  useEffect(() => {
    const savedTasks = localStorage.getItem("todo_tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    setIsLoaded(true);
  }, []);

  // HISTORIA 3: Guardar en localStorage cada vez que el arreglo 'tasks' cambie
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("todo_tasks", JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  // HISTORIA 2 y 6: Manejar el formulario (Agregar o Actualizar)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      // Si estamos editando, actualizamos la tarea existente
      const updatedTasks = tasks.map(task => 
        task.id === editingId ? { ...task, title, description } : task
      );
      setTasks(updatedTasks);
      setEditingId(null); // Salimos del modo edición
    } else {
      // Si no estamos editando, creamos una nueva (como antes)
      const newTask = {
        id: crypto.randomUUID(),
        title,
        description,
        completed: false,
      };
      setTasks([...tasks, newTask]);
    }

    // Limpiamos los inputs en ambos casos
    setTitle("");
    setDescription("");
  };

  // HISTORIA 4: Marcar como completada
  const handleToggleComplete = (id) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // HISTORIA 5: Eliminar tarea
  const handleDelete = (id) => {
    const filteredTasks = tasks.filter(task => task.id !== id);
    setTasks(filteredTasks);
  };

  // HISTORIA 6: Cargar datos en el formulario para editar
  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setEditingId(task.id);
  };

  // Prevenir renderizado hasta que el cliente cargue el localStorage
  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-zinc-800 text-gray-200 font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto p-6">
        {/* Formulario de Agregar */}
        <form onSubmit={handleSubmit} className="flex gap-4 mb-8 bg-zinc-900 p-4 rounded-lg items-center">
          <div className="flex items-center gap-2">
            <label className="font-semibold">Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white text-black px-2 py-1 rounded w-48"
              placeholder="Prueba1"
            />
          </div>
          <div className="flex items-center gap-2 flex-grow">
            <label className="font-semibold">Description</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white text-black px-2 py-1 rounded w-full"
              placeholder="solo una prueba"
            />
          </div>
          <button 
            type="submit"
            className={`${editingId ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-6 py-1.5 rounded transition-colors`}
          >
            {editingId ? 'Update' : 'Add'}
          </button>
        </form>

        {/* Tabla de Tareas */}
        <div className="bg-zinc-900 rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="p-4 w-1/4">Todo</th>
                <th className="p-4 w-2/4">Description</th>
                <th className="p-4 w-1/4">Completed</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-zinc-500">No hay tareas pendientes.</td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                    {/* Aplicamos un estilo tachado si está completada para mejor UX */}
                    <td className={`p-4 ${task.completed ? 'line-through text-zinc-500' : ''}`}>
                      {task.title}
                    </td>
                    <td className={`p-4 ${task.completed ? 'line-through text-zinc-500' : ''}`}>
                      {task.description}
                    </td>
                    <td className="p-4 flex items-center gap-4">
                      {/* Checkbox ahora es interactivo */}
                      <input 
                        type="checkbox" 
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task.id)}
                        className="w-5 h-5 cursor-pointer accent-blue-500"
                      />
                      
                      {/* Botones de acción (Editar lo haremos en el siguiente paso) */}
                      <div className="flex gap-2 ml-auto">
                        <button 
                          onClick={() => handleEdit(task)} // Agrega el evento onClick
                          className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-sm transition-colors"
                          aria-label="✏️"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(task.id)}
                          className="bg-red-600 hover:bg-red-700 p-2 rounded text-sm"
                          aria-label="🗑️"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}