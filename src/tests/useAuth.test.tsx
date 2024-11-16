import { renderHook, act } from "@testing-library/react";
import { useAuth, AuthProvider } from "../hooks/useAuth";

global.fetch = jest.fn();
const mockFetch = (response: object, status = 200) => {
  (fetch as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      ok: status === 200,
      status,
      json: () => Promise.resolve(response),
    })
  );
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("useAuth", () => {
  it("initializes with correct default state", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.email).toBe("");
    expect(result.current.loading).toBe(false);
  });

  it("logs in successfully and updates state", async () => {
    mockFetch({ success: true, email: "test@example.com" });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    expect(result.current.isLoggedIn).toBe(false);

    await act(async () => {
      const success = await result.current.login(
        "test@example.com",
        "Password1",
        false
      );
      expect(success).toBe(true);
    });

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.email).toBe("test@example.com");
    expect(localStorage.getItem("isLoggedIn")).toBe("true");
    expect(localStorage.getItem("email")).toBe("test@example.com");
  });

  it("fails to log in with invalid credentials", async () => {
    mockFetch({ error: "Invalid email or password" }, 401);

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await act(async () => {
      const success = await result.current.login(
        "wrong@example.com",
        "WrongPassword1",
        false
      );
      expect(success).toBe(false);
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.email).toBe("");
    expect(localStorage.getItem("isLoggedIn")).toBe("false");
    expect(localStorage.getItem("email")).toBeNull();
  });

  it("logs out and clears state", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.email).toBe("");
    expect(localStorage.getItem("isLoggedIn")).toBe("false");
    expect(localStorage.getItem("email")).toBeNull();
  });
});
