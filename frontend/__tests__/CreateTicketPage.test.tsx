import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreateTicketPage from "../src/pages/tickets/CreateTicketPage";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockCreate = jest.fn();
jest.mock("../src/services/ticket", () => ({
  ticketService: {
    create: (...args: unknown[]) => mockCreate(...args),
  },
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <CreateTicketPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("CreateTicketPage", () => {
  it("should render all form fields", () => {
    renderPage();
    expect(screen.getByPlaceholderText(/brief description/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/detailed explanation/i)).toBeInTheDocument();
    expect(screen.getByText(/category/i)).toBeInTheDocument();
    expect(screen.getByText(/priority/i)).toBeInTheDocument();
    expect(screen.getByText(/expected completion/i)).toBeInTheDocument();
  });

  it("should render submit and cancel buttons", () => {
    renderPage();
    expect(screen.getByRole("button", { name: /create ticket/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("should navigate back on cancel", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/tickets");
  });

  it("should show error on failed creation", async () => {
    mockCreate.mockRejectedValue(new Error("fail"));
    renderPage();

    fireEvent.change(screen.getByPlaceholderText(/brief description/i), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByPlaceholderText(/detailed explanation/i), {
      target: { value: "Test description" },
    });

    // Set datetime
    const dateInput = document.querySelector('input[type="datetime-local"]')!;
    fireEvent.change(dateInput, { target: { value: "2026-04-01T12:00" } });

    fireEvent.click(screen.getByRole("button", { name: /create ticket/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to create ticket/i)).toBeInTheDocument();
    });
  });

  it("should call create and navigate on success", async () => {
    mockCreate.mockResolvedValue({ success: true });
    renderPage();

    fireEvent.change(screen.getByPlaceholderText(/brief description/i), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByPlaceholderText(/detailed explanation/i), {
      target: { value: "Test description" },
    });

    const dateInput = document.querySelector('input[type="datetime-local"]')!;
    fireEvent.change(dateInput, { target: { value: "2026-04-01T12:00" } });

    fireEvent.click(screen.getByRole("button", { name: /create ticket/i }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test Title",
          description: "Test description",
          category: "INC",
          priority: "Low",
        }),
      );
      expect(mockNavigate).toHaveBeenCalledWith("/tickets");
    });
  });
});
