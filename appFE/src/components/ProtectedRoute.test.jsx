import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';


vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn()
}));


import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';

describe('Test Set for <ProtectedRoute />', () => {

  test('Test 1 => (user: null, authLoading: false) => When user is not authenticated must redirect to login', () => {

    useAuth.mockReturnValue({
      user: null,
      authLoading: false
    });


    render(
      <MemoryRouter initialEntries={['/home']}>
        <Routes>

          <Route path="/" element={<h1>Login page</h1>} />


          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<h1>Home page</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );



    expect(screen.getByText(/Login page/i)).toBeInTheDocument();
    expect(screen.queryByText(/Home page/i)).not.toBeInTheDocument();
  });

   test('Test 2 => (user: { email: "carmen@example.com", password: "123456" }, authLoading: false) => When user is authenticated must allow access', () => {

    useAuth.mockReturnValue({
      user: { name: 'Carmen', email: 'carmen@example.com', password: '123456' },
      authLoading: false
    });





    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<ProtectedRoute />}>

            <Route path="/" element={<h1>Home Page</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );


    expect(screen.getByText(/Home /i)).toBeInTheDocument();
  });

  test('Test 3 => (user: null, authLoading: true) => When auth is loading must show loading message', () => {

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
