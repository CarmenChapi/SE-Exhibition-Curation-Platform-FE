import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import UserLogin from "./UserLogin"; 
import { useAuth } from "../hooks/useAuth";

vi.mock("../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: { from: { pathname: "/home" } } }),
  };
});

vi.mock("./GoogleLogin.jsx", () => ({
  default: () => <button data-testid="google-login">Google Login</button>,
}));

describe("Test set for UserLogin", () => {
  let mockLoginWithEmail;
  let mockRegisterWithEmail;

  beforeEach(() => {
    vi.clearAllMocks();
    mockLoginWithEmail = vi.fn();
    mockRegisterWithEmail = vi.fn();

    useAuth.mockReturnValue({
      user: null,
      loginWithEmail: mockLoginWithEmail,
      registerWithEmail: mockRegisterWithEmail,
    });
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <UserLogin />
      </BrowserRouter>
    );


  it("Test 1 => Must render the form of login by default", () => {
    renderComponent();

    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in with email/i })).toBeInTheDocument();
  });

  it("Test 2 => Must change to Register mode when press the button dont have an account...", async () => {
    renderComponent();

    const toggleButton = screen.getByRole("button", { name: /don't have an account\? sign up here/i });
    fireEvent.click(toggleButton);

    expect(screen.getByRole("heading", { name: /create new account/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });


  it("Test 3 => Must call to loginWithEmail with the correct values when call the form", async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/your email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/your password/i), { target: { value: "password123" } });
    
    fireEvent.click(screen.getByRole("button", { name: /sign in with email/i }));

    expect(mockLoginWithEmail).toHaveBeenCalledWith("test@example.com", "password123");
  });

  it("Test 4 => Must call the function registerWithEmail to register new user", async () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /don't have an account\? sign up here/i }));

    fireEvent.change(screen.getByPlaceholderText(/your email/i), { target: { value: "new@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/your password/i), { target: { value: "securePwd" } });
    
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(mockRegisterWithEmail).toHaveBeenCalledWith("new@example.com", "securePwd");
  });


  it("Test 4 => Must show an error message if the values are not valids", async () => {
    mockLoginWithEmail.mockRejectedValueOnce({ code: "auth/invalid-credential" });
    
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/your email/i), { target: { value: "wrong@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/your password/i), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in with email/i }));

    const errorText = await screen.findByText(/incorrect email or password\./i);
    expect(errorText).toBeInTheDocument();
  });

  it("Test 5 => Must show error msg if the email is already register", async () => {
    mockRegisterWithEmail.mockRejectedValueOnce({ code: "auth/email-already-in-use" });

    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /don't have an account\? sign up here/i }));

    fireEvent.change(screen.getByPlaceholderText(/your email/i), {
      target: { value: "registered@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/your password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    const errorText = await screen.findByText(/This email is already registered\./i);
    expect(errorText).toBeInTheDocument();
  });


  it("Test 6 => Must unable the button and show test of loading while is been sent", async () => {
    mockLoginWithEmail.mockReturnValueOnce(new Promise((resolve) => setTimeout(resolve, 100)));

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/your password/i), {
      target: { value: "password123" },
    });
    const submitButton = screen.getByRole("button", { name: /sign in with email/i });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/signing in\.\.\./i);
  });

  it("Test 7 => Must renavigate if the user if already auth", () => {
   
    useAuth.mockReturnValue({
      user: { uid: "123", email: "user@example.com" },
      loginWithEmail: mockLoginWithEmail,
      registerWithEmail: mockRegisterWithEmail,
    });

    renderComponent();

   
    expect(mockNavigate).toHaveBeenCalledWith("/home", { replace: true });
  });
});
