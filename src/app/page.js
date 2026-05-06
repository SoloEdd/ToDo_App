"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useTasks } from "@/hooks/useTasks"; // Importamos nuestro Custom Hook

export default function Home() {
  // 1. Extraemos la lógica de negocio y los datos desde el Hook
  const { tasks, isLoaded, addTask, updateTask, toggleComplete, deleteTask } = useTasks();

  // 2. Estados exclusivos de la Interfaz de Usuario (UI)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null); 
  const [filter, setFilter] = useState("All"); 
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(""); 

  // HISTORIA 2 y 6: Manejar el formulario delegando al Hook
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Limpiamos cualquier error anterior al intentar de nuevo

    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    // Validaciones de UI (Longitudes y vacíos)
    if (!trimmedTitle) {
      setError("El título es obligatorio.");
      return;
    }
    if (trimmedTitle.length > 50) {
      setError("El título no puede exceder los 50 caracteres.");
      return;
    }
    if (trimmedDesc.length > 200) {
      setError("La descripción no puede exceder los 200 caracteres.");
      return;
    }

    try {
      // Intentamos guardar o actualizar usando el Hook
      if (editingId) {
        updateTask(editingId, trimmedTitle, trimmedDesc);
        setEditingId(null);
      } else {
        addTask(trimmedTitle, trimmedDesc);
      }
      
      // Si el Hook no lanza errores, limpiamos los inputs
      setTitle("");
      setDescription("");
    } catch (err) {
      // Atrapamos errores de lógica (como títulos duplicados) que lanza el Hook
      setError(err.message);
    }
  };

  // HISTORIA 6: Cargar datos en el formulario para editar
  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setEditingId(task.id);
    setError(""); // Limpiamos la alerta de error si el usuario decide editar otra cosa
  };

  // Estado derivado para filtrar tareas
  const filteredTasks = tasks.filter(task => {
    // 1. Filtrar por estado (Radio buttons)
    if (filter === "Completed" && !task.completed) return false;
    if (filter === "Uncompleted" && task.completed) return false;

    // 2. Filtrar por texto (Buscador)
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch = task.title.toLowerCase().includes(lowerQuery) || 
                          task.description.toLowerCase().includes(lowerQuery);
    
    return matchesSearch;
  });

  // Prevenir renderizado hasta que el cliente cargue el localStorage
  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-zinc-800 text-gray-200 font-sans">
      <Navbar 
        filter={filter} 
        setFilter={setFilter} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      <main className="max-w-5xl mx-auto p-6">
        {/* Alerta de Error UI */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
            <button 
              onClick={() => setError("")} 
              className="text-red-400 hover:text-red-300 font-bold px-2"
              aria-label="Cerrar alerta"
            >
              ✕
            </button>
          </div>
        )}
        
        {/* Formulario de Agregar */}
        <form onSubmit={handleSubmit} className="flex gap-4 mb-8 bg-zinc-900 p-4 rounded-lg items-center">
          <div className="flex items-center gap-2">
            <label className="font-semibold">Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(""); // Limpia error al escribir
              }}
              className="bg-white text-black px-2 py-1 rounded w-48"
              placeholder="Prueba1"
            />
          </div>
          <div className="flex items-center gap-2 flex-grow">
            <label className="font-semibold">Description</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError(""); // Limpia error al escribir
              }}
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
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-zinc-500">No se encontraron tareas.</td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                    <td className={`p-4 ${task.completed ? 'line-through text-zinc-500' : ''}`}>
                      {task.title}
                    </td>
                    <td className={`p-4 ${task.completed ? 'line-through text-zinc-500' : ''}`}>
                      {task.description}
                    </td>
                    <td className="p-4 flex items-center gap-4">
                      
                      {/* Checkbox llamando a toggleComplete del Hook */}
                      <input 
                        type="checkbox" 
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id)}
                        className="w-5 h-5 cursor-pointer accent-blue-500"
                      />
                      
                      <div className="flex gap-2 ml-auto">
                        <button 
                          onClick={() => handleEdit(task)} 
                          className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-sm transition-colors"
                          aria-label="✏️"
                        >
                          ✏️
                        </button>
                        
                        {/* Botón de borrar llamando a deleteTask del Hook */}
                        <button 
                          onClick={() => deleteTask(task.id)}
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