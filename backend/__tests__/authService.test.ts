import { ApiError } from "../src/shared/utils/error";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockFindOne = jest.fn();
const mockCreate = jest.fn();

jest.mock("../src/modules/users/model", () => ({
  User: {
    findOne: (...args: unknown[]) => mockFindOne(...args),
    create: (...args: unknown[]) => mockCreate(...args),
  },
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mock-jwt-token"),
}));

jest.mock("../src/config/env", () => ({
  appEnv: {
    JWT_SECRET: "test-secret-key-that-is-long-enough-for-validation",
  },
}));

import { login, signup } from "../src/modules/auth/service";

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── login ────────────────────────────────────────────────────────────────────

describe("login", () => {
  it("should throw if user not found", async () => {
    mockFindOne.mockResolvedValue(null);

    await expect(login("bad@test.com", "password")).rejects.toThrow(
      "Invalid credentials",
    );
  });

  it("should throw if password does not match", async () => {
    mockFindOne.mockResolvedValue({
      _id: { toString: () => "user-id" },
      name: "Test",
      email: "test@test.com",
      roleId: 100,
      comparePassword: jest.fn().mockResolvedValue(false),
    });

    await expect(login("test@test.com", "wrong")).rejects.toThrow(
      "Invalid credentials",
    );
  });

  it("should return token and user on valid credentials", async () => {
    mockFindOne.mockResolvedValue({
      _id: { toString: () => "user-id" },
      name: "Test User",
      email: "test@test.com",
      roleId: 100,
      comparePassword: jest.fn().mockResolvedValue(true),
    });

    const result = await login("test@test.com", "correct-pass");

    expect(result.token).toBe("mock-jwt-token");
    expect(result.user.email).toBe("test@test.com");
    expect(result.user.role.level).toBe("L1");
  });

  it("should throw if user has an invalid role", async () => {
    mockFindOne.mockResolvedValue({
      _id: { toString: () => "user-id" },
      name: "Test",
      email: "test@test.com",
      roleId: 999,
      comparePassword: jest.fn().mockResolvedValue(true),
    });

    await expect(login("test@test.com", "pass")).rejects.toThrow(
      "Invalid role",
    );
  });
});

// ─── signup ───────────────────────────────────────────────────────────────────

describe("signup", () => {
  it("should throw if email already exists", async () => {
    mockFindOne.mockResolvedValue({ email: "existing@test.com" });

    await expect(
      signup("Name", "existing@test.com", "pass", "L1"),
    ).rejects.toThrow("Email already registered");
  });

  it("should throw for invalid role", async () => {
    mockFindOne.mockResolvedValue(null);

    await expect(
      signup("Name", "new@test.com", "pass", "L99"),
    ).rejects.toThrow("Invalid role");
  });

  it("should create user and return token", async () => {
    mockFindOne.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      _id: { toString: () => "new-id" },
      name: "New User",
      email: "new@test.com",
      roleId: 100,
    });

    const result = await signup("New User", "new@test.com", "pass123", "L1");

    expect(result.token).toBe("mock-jwt-token");
    expect(result.user.name).toBe("New User");
    expect(result.user.role.level).toBe("L1");
    expect(mockCreate).toHaveBeenCalled();
  });
});
