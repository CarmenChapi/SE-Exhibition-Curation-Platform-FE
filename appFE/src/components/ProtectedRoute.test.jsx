import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';

// 1. Le decimos a Vitest que intercepte el hook real usado por ProtectedRoute
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn()
}));

// Importamos el hook simulado para poder controlar qué devuelve en cada test
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';

describe('Test Set for <ProtectedRoute />', () => {

  test('Test 1 => (user: null, authLoading: false) => When user is not authenticated must redirect to login', () => {
    // 2. Simulamos el escenario: No hay usuario (user: null, authLoading: false)
    useAuth.mockReturnValue({
      user: null,
      authLoading: false
    });

    // 3. Renderizamos el guardián dentro de un entorno de rutas de prueba
    render(
      <MemoryRouter initialEntries={['/home']}>
        <Routes>
          {/* El Login al que debería ser redirigido */}
          <Route path="/" element={<h1>Login page</h1>} />
          
          {/* La zona protegida */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<h1>Home page</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Como no está logueado, al intentar entrar al flujo debería botarlo al "/"
    // Forzamos la navegación inicial simulada o simplemente verificamos que el Login esté en pantalla
    expect(screen.getByText(/Login page/i)).toBeInTheDocument();
    expect(screen.queryByText(/Home page/i)).not.toBeInTheDocument();
  });

   test('Test 2 => (user: { email: "carmen@example.com", password: "123456" }, authLoading: false) => When user is authenticated must allow access', () => {
    // 4. Simulamos el escenario alternativo: El usuario sí existe
    useAuth.mockReturnValue({
      user: { name: 'Carmen', email: 'carmen@example.com', password: '123456' },
      authLoading: false
    });

    // Para esta prueba, necesitamos forzar que la ruta activa sea la privada. 
    // En lugar de BrowserRouter, podemos usar un truco manual o simplemente renderizar
    // el componente con su salida directa usando un Router que empiece en /home.
    // Para simplificar, cambiamos la estructura para renderizar directamente el Outlet:
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            {/* Como la ruta por defecto en un test suele ser "/", ponemos el hijo ahí para comprobar si se pinta */}
            <Route path="/" element={<h1>Home Page</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Como 'user' tiene datos, el guardián debe pintar el componente hijo (<Outlet />)
    expect(screen.getByText(/Home /i)).toBeInTheDocument();
  });

  test('Test 3 => (user: null, authLoading: true) => When auth is loading must show loading message', () => {
    // 5. Simulamos el escenario donde la app está leyendo el localStorage o Firebase
    useAuth.mockReturnValue({
      user: null,
      authLoading: true
    });

    render(
      <MemoryRouter initialEntries={['/home']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<h1>Home page</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Checking your session.../i)).toBeInTheDocument();
  });

});
