import { render, screen } from '@testing-library/react';
import Navbar from '../src/components/Navbar';
import '@testing-library/jest-dom';

describe('Componente Navbar', () => {
  it('renderiza el título de la aplicación y el botón Home', () => {
    render(<Navbar />); // Simulamos que el componente se dibuja
    
    // Buscamos que los textos existan en la pantalla
    expect(screen.getByText('JS Todo List')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});