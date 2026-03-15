import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../src/pages/auth/LoginPage";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const mockSetAuth = jest.fn();
jest.mock("../src/store/auth", () => ({
  useAuthStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ user: null, token: null, setAuth: mockSetAuth, logout: jest.fn() }),
}));

const mockLogin = jest.fn();
jest.mock("../src/services/auth", () => ({
  authService: {
    login: (...args: unknown[]) => mockLogin(...args),
  },
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("LoginPage", () => {
  it("should render email and password fields", () => {
    renderLogin();
    expect(screen.getByPlaceholderText(/l1@helpdesk/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("should render sign in button", () => {
    renderLogin();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("should show error on failed login", async () => {
    mockLogin.mockRejectedValue(new Error("fail"));
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/l1@helpdesk/i), {
      target: { value: "bad@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  it("should call setAuth and navigate on successful login", async () => {
    const mockUser = { id: "1", name: "Test", email: "test@test.com", role: { id: 100, name: "Agent", level: "L1" } };
    mockLogin.mockResolvedValue({ data: { user: mockUser, token: "jwt-token" } });
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/l1@helpdesk/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSetAuth).toHaveBeenCalledWith(mockUser, "jwt-token");
      expect(mockNavigate).toHaveBeenCalledWith("/tickets");
    });
  });

  it("should toggle password visibility", () => {
    renderLogin();
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const toggleBtn = screen.getByRole("button", { name: /show/i });

    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "text");
  });
});
