import { useState, useEffect } from "react";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar tareas al inicio
  useEffect(() => {
    const savedTasks = localStorage.getItem("todo_tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    setIsLoaded(true);
  }, []);

  // Guardar tareas cuando cambian
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("todo_tasks", JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  // Lógica para agregar
  const addTask = (title, description) => {
    // Validamos duplicados aquí, en la capa de datos
    const isDuplicate = tasks.some(
      (task) => task.title.toLowerCase() === title.toLowerCase()
    );
    if (isDuplicate) throw new Error("Ya existe una tarea con este título.");

    const newTask = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  // Lógica para actualizar
  const updateTask = (id, title, description) => {
    const isDuplicate = tasks.some(
      (task) => task.title.toLowerCase() === title.toLowerCase() && task.id !== id
    );
    if (isDuplicate) throw new Error("Ya existe una tarea con este título.");

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title, description } : task
      )
    );
  };

  // Lógica para completar
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Lógica para eliminar
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Exponemos solo lo necesario para la interfaz
  return {
    tasks,
    isLoaded,
    addTask,
    updateTask,
    toggleComplete,
    deleteTask,
  };
}