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

describe('Página Principal - Sprint 1 y 2', () => {
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

  it('permite marcar una tarea como completada', () => {
    render(<Home />);
    
    // 1. Agregamos una tarea primero
    fireEvent.change(screen.getByPlaceholderText('Prueba1'), { target: { value: 'Tarea para completar' } });
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));

    // 2. Buscamos el checkbox de la tarea (por su rol)
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    // 3. Simulamos el clic para completarla
    fireEvent.click(checkbox);

    // 4. Verificamos que ahora esté marcada
    expect(checkbox).toBeChecked();
  });

  it('permite eliminar una tarea', () => {
    render(<Home />);
    
    // 1. Agregamos una tarea
    fireEvent.change(screen.getByPlaceholderText('Prueba1'), { target: { value: 'Tarea para borrar' } });
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));

    // 2. Verificamos que exista
    expect(screen.getByText('Tarea para borrar')).toBeInTheDocument();

    // 3. Buscamos el botón de eliminar y hacemos clic
    const deleteButton = screen.getByRole('button', { name: /🗑️/i }); // Usaremos un emoji como botón por simplicidad
    fireEvent.click(deleteButton);

    // 4. Verificamos que ya no esté en la pantalla
    expect(screen.queryByText('Tarea para borrar')).not.toBeInTheDocument();
  });

  it('permite editar una tarea existente', () => {
    render(<Home />);
    
    // 1. Agregamos una tarea inicial
    fireEvent.change(screen.getByPlaceholderText('Prueba1'), { target: { value: 'Tarea original' } });
    fireEvent.change(screen.getByPlaceholderText('solo una prueba'), { target: { value: 'Descripción original' } });
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));

    // 2. Hacemos clic en el botón de editar
    const editButton = screen.getByRole('button', { name: /✏️/i });
    fireEvent.click(editButton);

    // 3. Verificamos que los inputs se hayan llenado con los datos de la tarea
    const titleInput = screen.getByDisplayValue('Tarea original');
    expect(titleInput).toBeInTheDocument();

    // 4. Modificamos el título y guardamos
    fireEvent.change(titleInput, { target: { value: 'Tarea editada' } });
    
    // El botón debe haber cambiado a "Update"
    const updateButton = screen.getByRole('button', { name: /Update/i });
    fireEvent.click(updateButton);

    // 5. Verificamos que el texto haya cambiado en la tabla
    expect(screen.getByText('Tarea editada')).toBeInTheDocument();
    expect(screen.queryByText('Tarea original')).not.toBeInTheDocument();
  });

  it('filtra las tareas por estado y por texto de búsqueda', () => {
    render(<Home />);
    
    // 1. Agregamos dos tareas (una la completaremos)
    fireEvent.change(screen.getByPlaceholderText('Prueba1'), { target: { value: 'Aprender Next.js' } });
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));

    fireEvent.change(screen.getByPlaceholderText('Prueba1'), { target: { value: 'Dominar TDD' } });
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));

    // Completamos la primera tarea ("Aprender Next.js")
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); 

    // 2. Prueba de Filtro: Completadas
    const completedRadio = screen.getByLabelText('Completed');
    fireEvent.click(completedRadio);
    expect(screen.getByText('Aprender Next.js')).toBeInTheDocument();
    expect(screen.queryByText('Dominar TDD')).not.toBeInTheDocument();

    // 3. Prueba de Filtro: Pendientes (Uncompleted)
    const uncompletedRadio = screen.getByLabelText('Uncompleted');
    fireEvent.click(uncompletedRadio);
    expect(screen.queryByText('Aprender Next.js')).not.toBeInTheDocument();
    expect(screen.getByText('Dominar TDD')).toBeInTheDocument();

    // 4. Prueba de Búsqueda (Volvemos a "All" primero)
    fireEvent.click(screen.getByLabelText('All'));
    const searchInput = screen.getByPlaceholderText('Words');
    fireEvent.change(searchInput, { target: { value: 'Next' } });

    expect(screen.getByText('Aprender Next.js')).toBeInTheDocument();
    expect(screen.queryByText('Dominar TDD')).not.toBeInTheDocument();
  });
});