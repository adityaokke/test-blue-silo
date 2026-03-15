import { useAuthStore } from "../src/store/auth";

describe("useAuthStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({ user: null, token: null });
  });

  it("should start with null user and token", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it("should set auth with user and token", () => {
    const mockUser = {
      id: "1",
      name: "Test User",
      email: "test@test.com",
      role: { id: 100, name: "Helpdesk Agent", level: "L1" as const },
    };

    useAuthStore.getState().setAuth(mockUser, "test-token");

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe("test-token");
  });

  it("should clear user and token on logout", () => {
    const mockUser = {
      id: "1",
      name: "Test User",
      email: "test@test.com",
      role: { id: 100, name: "Helpdesk Agent", level: "L1" as const },
    };

    useAuthStore.getState().setAuth(mockUser, "test-token");
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});
