import { ApiError } from "../src/shared/utils/error";

// ─── Shared mocks ────────────────────────────────────────────────────────────

const mockSession = {
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  endSession: jest.fn(),
};

jest.mock("mongoose", () => ({
  ...jest.requireActual("mongoose"),
  Types: {
    ObjectId: Object.assign(
      function ObjectId(id: string) {
        return id;
      },
      { isValid: (id: string) => /^[a-f0-9]{24}$/.test(id) },
    ),
  },
  startSession: jest.fn().mockResolvedValue(mockSession),
}));

jest.mock("../src/shared/utils/mongose", () => ({
  withTransaction: jest.fn(async (fn: (s: typeof mockSession) => Promise<unknown>) =>
    fn(mockSession),
  ),
}));

// ─── Mock models ─────────────────────────────────────────────────────────────

const mockTicketCreate = jest.fn();
const mockTicketFind = jest.fn();
const mockTicketFindById = jest.fn();

jest.mock("../src/modules/tickets/model", () => ({
  Ticket: {
    create: (...args: unknown[]) => mockTicketCreate(...args),
    find: (...args: unknown[]) => mockTicketFind(...args),
    findById: (...args: unknown[]) => mockTicketFindById(...args),
  },
}));

const mockLogCreate = jest.fn();

jest.mock("../src/modules/ticketLogs/model", () => ({
  TicketLog: {
    create: (...args: unknown[]) => mockLogCreate(...args),
  },
}));

const mockUserFindById = jest.fn();

jest.mock("../src/modules/users/model", () => ({
  User: {
    findById: (...args: unknown[]) => mockUserFindById(...args),
  },
}));

jest.mock("../src/modules/userRoles/repository", () => ({
  findByRoleId: jest.fn((id: number) => {
    if (id === 100) return { id: 100, name: "Helpdesk Agent", level: "L1" };
    if (id === 200) return { id: 200, name: "Technical Support", level: "L2" };
    if (id === 300) return { id: 300, name: "Advanced Support", level: "L3" };
    return undefined;
  }),
}));

// ─── Import services after mocks ─────────────────────────────────────────────

import { assignCriticalValue } from "../src/modules/tickets/services/assignCrititalValue";
import { createTicket } from "../src/modules/tickets/services/createTicket";
import { escalateTicket } from "../src/modules/tickets/services/escalateTicket";
import { getTickets } from "../src/modules/tickets/services/getTickets";
import { updateStatus } from "../src/modules/tickets/services/updateStatus";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const VALID_ID = "507f1f77bcf86cd799439011";
const INVALID_ID = "not-an-id";

const mockUser = {
  id: "507f1f77bcf86cd799439012",
  name: "Test User",
  email: "test@test.com",
  role: { id: 100, name: "Helpdesk Agent", level: "L1" as const },
};

const mockL2User = {
  id: "507f1f77bcf86cd799439013",
  name: "L2 User",
  email: "l2@test.com",
  role: { id: 200, name: "Technical Support", level: "L2" as const },
};

function makeTicketDoc(overrides: Record<string, unknown> = {}) {
  return {
    _id: VALID_ID,
    title: "Test Ticket",
    status: "New",
    currentLevel: "L1",
    criticalValue: null,
    save: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── createTicket ─────────────────────────────────────────────────────────────

describe("createTicket", () => {
  it("should create a ticket and log entry", async () => {
    const ticketDoc = makeTicketDoc();
    mockTicketCreate.mockResolvedValue([ticketDoc]);
    mockLogCreate.mockResolvedValue([{}]);

    const result = await createTicket(mockUser.id, {
      title: "Test Ticket",
      description: "Desc",
      category: "INC",
      priority: "Low",
      expectedCompletionAt: new Date(),
    });

    expect(result).toBe(ticketDoc);
    expect(mockTicketCreate).toHaveBeenCalledTimes(1);
    expect(mockLogCreate).toHaveBeenCalledTimes(1);
  });

  it("should throw if ticket creation returns empty", async () => {
    mockTicketCreate.mockResolvedValue([undefined]);
    mockLogCreate.mockResolvedValue([{}]);

    await expect(
      createTicket(mockUser.id, {
        title: "X",
        description: "Y",
        category: "INC",
        priority: "Low",
        expectedCompletionAt: new Date(),
      }),
    ).rejects.toThrow(ApiError);
  });
});

// ─── getTickets ───────────────────────────────────────────────────────────────

describe("getTickets", () => {
  it("should return all tickets when no filters", async () => {
    const mockChain = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([]),
    };
    mockTicketFind.mockReturnValue(mockChain);

    const result = await getTickets({});
    expect(result).toEqual([]);
    expect(mockTicketFind).toHaveBeenCalledWith({});
  });

  it("should apply status filter", async () => {
    const mockChain = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([]),
    };
    mockTicketFind.mockReturnValue(mockChain);

    await getTickets({ status: "New" });
    expect(mockTicketFind).toHaveBeenCalledWith({ status: "New" });
  });

  it("should apply multiple filters", async () => {
    const mockChain = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([]),
    };
    mockTicketFind.mockReturnValue(mockChain);

    await getTickets({ status: "Attending", priority: "High", currentLevel: "L2" });
    expect(mockTicketFind).toHaveBeenCalledWith({
      status: "Attending",
      priority: "High",
      currentLevel: "L2",
    });
  });

  it("should ignore 'All' values", async () => {
    const mockChain = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([]),
    };
    mockTicketFind.mockReturnValue(mockChain);

    await getTickets({ status: "All", priority: "All" });
    expect(mockTicketFind).toHaveBeenCalledWith({});
  });
});

// ─── updateStatus ─────────────────────────────────────────────────────────────

describe("updateStatus", () => {
  it("should throw on invalid ticket ID", async () => {
    await expect(
      updateStatus(INVALID_ID, mockUser, { status: "Attending", note: "" }),
    ).rejects.toThrow("Invalid ticket ID");
  });

  it("should throw if ticket not found", async () => {
    mockTicketFindById.mockReturnValue({ session: jest.fn().mockResolvedValue(null) });

    await expect(
      updateStatus(VALID_ID, mockUser, { status: "Attending", note: "" }),
    ).rejects.toThrow("Ticket not found");
  });

  it("should throw on invalid status transition", async () => {
    const ticket = makeTicketDoc({ status: "Completed" });
    mockTicketFindById.mockReturnValue({ session: jest.fn().mockResolvedValue(ticket) });

    await expect(updateStatus(VALID_ID, mockUser, { status: "New", note: "" })).rejects.toThrow(
      /Cannot transition/,
    );
  });

  it("should update status from New to Attending", async () => {
    const ticket = makeTicketDoc({ status: "New" });
    mockTicketFindById.mockReturnValue({ session: jest.fn().mockResolvedValue(ticket) });
    mockLogCreate.mockResolvedValue([{}]);

    const result = await updateStatus(VALID_ID, mockUser, {
      status: "Attending",
      note: "Working on it",
    });

    expect(ticket.save).toHaveBeenCalled();
    expect(result.status).toBe("Attending"); // ticket status updated
    expect(mockLogCreate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          note: "Working on it", // note goes to log, not ticket
          toStatus: "Attending",
          fromStatus: "New",
        }),
      ]),
      expect.objectContaining({ session: expect.anything() }),
    );
  });

  it("should throw when updating New directly to Completed", async () => {
    const ticket = makeTicketDoc({ status: "New" });
    mockTicketFindById.mockReturnValue({ session: jest.fn().mockResolvedValue(ticket) });

    await expect(
      updateStatus(VALID_ID, mockUser, { status: "Completed", note: "Done" }),
    ).rejects.toThrow("New tickets can only be updated to Attending");
  });

  it("should update status from Attending to Completed", async () => {
    const ticket = makeTicketDoc({ status: "Attending" });
    mockTicketFindById.mockReturnValue({ session: jest.fn().mockResolvedValue(ticket) });
    mockLogCreate.mockResolvedValue([{}]);

    const result = await updateStatus(VALID_ID, mockUser, {
      status: "Completed",
      note: "Done",
    });

    expect(ticket.save).toHaveBeenCalled();
    expect(result.status).toBe("Completed");
    expect(mockLogCreate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          note: "Done",
          toStatus: "Completed",
          fromStatus: "Attending",
        }),
      ]),
      expect.objectContaining({ session: expect.anything() }),
    );
  });

  it("should throw when updating a Completed ticket", async () => {
    const ticket = makeTicketDoc({ status: "Completed" });
    mockTicketFindById.mockReturnValue({ session: jest.fn().mockResolvedValue(ticket) });

    await expect(
      updateStatus(VALID_ID, mockUser, { status: "Attending", note: "" }),
    ).rejects.toThrow(/Cannot transition/);
  });
});

// ─── escalateTicket ───────────────────────────────────────────────────────────

describe("escalateTicket", () => {
  const l2UserId = "507f1f77bcf86cd799439020";

  it("should throw on invalid ticket ID", async () => {
    await expect(
      escalateTicket(INVALID_ID, mockUser, { note: "escalating", assignedTo: l2UserId }),
    ).rejects.toThrow("Invalid ticket ID");
  });

  it("should throw if ticket not found", async () => {
    mockTicketFindById.mockReturnValue({ session: jest.fn().mockResolvedValue(null) });

    await expect(
      escalateTicket(VALID_ID, mockUser, { note: "escalating", assignedTo: l2UserId }),
    ).rejects.toThrow("Ticket not found");
  });

  it("should throw if ticket is not Attending", async () => {
    const ticket = makeTicketDoc({ status: "Completed" });
    mockTicketFindById.mockReturnValue({ session: jest.fn().mockResolvedValue(ticket) });

    await expect(
      escalateTicket(VALID_ID, mockUser, { note: "escalating", assignedTo: l2UserId }),
    ).rejects.toThrow("Ticket must be set to Attending before performing this action");
  });

  it("should throw if ticket is already at L3", async () => {
    const ticket = makeTicketDoc({ currentLevel: "L3", status: "Attending" });
    mockTicketFindById.mockReturnValue({ session: jest.fn().mockResolvedValue(ticket) });

    await expect(
      escalateTicket(VALID_ID, mockUser, { note: "escalating", assignedTo: l2UserId }),
    ).rejects.toThrow("already at L3");
  });

  it("should throw if L2 ticket has no C1/C2 critical value", async () => {
    const ticket = makeTicketDoc({ currentLevel: "L2", criticalValue: "C3", status: "Attending" });
    mockTicketFindById.mockReturnValue({ session: jest.fn().mockResolvedValue(ticket) });

    await expect(
      escalateTicket(VALID_ID, mockL2User, { note: "escalating", assignedTo: l2UserId }),
    ).rejects.toThrow("Critical value must be C1 or C2");
  });

  it("should throw if assignedTo is invalid", async () => {
    const ticket = makeTicketDoc({ currentLevel: "L1", status: "Attending" });
    mockTicketFindById.mockReturnValue({ session: jest.fn().mockResolvedValue(ticket) });

    await expect(
      escalateTicket(VALID_ID, mockUser, { note: "escalating", assignedTo: "bad-id" }),
    ).rejects.toThrow("Valid assignedTo user ID");
  });

  it("should escalate L1 to L2 successfully", async () => {
    const ticket = makeTicketDoc({ currentLevel: "L1", status: "Attending" });
    mockTicketFindById.mockReturnValue({ session: jest.fn().mockResolvedValue(ticket) });
    mockUserFindById.mockReturnValue({
      session: jest.fn().mockResolvedValue({ _id: l2UserId, roleId: 200 }),
    });
    mockLogCreate.mockResolvedValue([{}]);

    await escalateTicket(VALID_ID, mockUser, {
      note: "Need L2 help",
      assignedTo: l2UserId,
    });

    expect(ticket.currentLevel).toBe("L2");
    expect(ticket.status).toBe("New");
    expect(ticket.save).toHaveBeenCalled();
    expect(mockLogCreate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          note: "Need L2 help",
        }),
      ]),
      expect.objectContaining({ session: expect.anything() }),
    );
  });
});

// ─── assignCriticalValue ──────────────────────────────────────────────────────

describe("assignCriticalValue", () => {
  it("should throw on invalid ticket ID", async () => {
    await expect(
      assignCriticalValue(INVALID_ID, mockL2User, { criticalValue: "C1", note: "" }),
    ).rejects.toThrow("Invalid ticket ID");
  });

  it("should throw if ticket not found", async () => {
    mockTicketFindById.mockReturnValue({ session: jest.fn().mockResolvedValue(null) });

    await expect(
      assignCriticalValue(VALID_ID, mockL2User, { criticalValue: "C1", note: "" }),
    ).rejects.toThrow("Ticket not found");
  });

  it("should throw if ticket is not Attending", async () => {
    const ticket = makeTicketDoc({ status: "Completed" });
    mockTicketFindById.mockReturnValue({ session: jest.fn().mockResolvedValue(ticket) });

    await expect(
      assignCriticalValue(VALID_ID, mockL2User, { criticalValue: "C1", note: "" }),
    ).rejects.toThrow("Ticket must be set to Attending before performing this action");
  });

  it("should assign critical value successfully", async () => {
    const ticket = makeTicketDoc({ status: "Attending" });
    mockTicketFindById.mockReturnValue({ session: jest.fn().mockResolvedValue(ticket) });
    mockLogCreate.mockResolvedValue([{}]);

    await assignCriticalValue(VALID_ID, mockL2User, {
      criticalValue: "C1",
      note: "System down",
    });

    expect(ticket.criticalValue).toBe("C1");
    expect(ticket.save).toHaveBeenCalled();
    expect(mockLogCreate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          note: "System down",
        }),
      ]),
      expect.objectContaining({ session: expect.anything() }),
    );
  });
});
