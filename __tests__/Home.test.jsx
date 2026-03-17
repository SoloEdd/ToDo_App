import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../src/app/page';
import '@testing-library/jest-dom';

// 1. Preparamos un "Mock" (simulador) de localStorage para no depender del navegador
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Página Principal - Sprint 1', () => {
  beforeEach(() => {
    window.localStorage.clear(); // Limpiamos antes de cada prueba
  });

  it('permite agregar una tarea y la guarda en localStorage', () => {
    render(<Home />);

    // 2. Buscamos los elementos en la pantalla
    // (Nota: Asegúrate de que tus inputs en page.js tengan un id y su label tenga htmlFor, 
    // o busca por placeholder para que esto funcione)
    const titleInput = screen.getByPlaceholderText('Prueba1');
    const descInput = screen.getByPlaceholderText('solo una prueba');
    const addButton = screen.getByRole('button', { name: /Add/i });

    // 3. Simulamos que el usuario escribe y hace clic
    fireEvent.change(titleInput, { target: { value: 'Aprender TDD' } });
    fireEvent.change(descInput, { target: { value: 'Escribir mi primera prueba' } });
    fireEvent.click(addButton);

    // 4. Fase Verde: Verificamos que la tarea apareció en la tabla
    expect(screen.getByText('Aprender TDD')).toBeInTheDocument();
    expect(screen.getByText('Escribir mi primera prueba')).toBeInTheDocument();

    // 5. Verificamos que se guardó en el localStorage
    const savedTasks = JSON.parse(window.localStorage.getItem('todo_tasks'));
    expect(savedTasks.length).toBe(1);
    expect(savedTasks[0].title).toBe('Aprender TDD');
  });
});