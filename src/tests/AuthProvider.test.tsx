import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../hooks/useAuth";

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ email: "hello@edited.com" }),
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("auth provider manages login state", async () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  const { result } = renderHook(() => useAuth(), { wrapper });

  expect(result.current.isLoggedIn).toBe(false);

  await act(async () => {
    const loginResult = await result.current.login(
      "hello@edited.com",
      "hello123",
      false
    );
    expect(loginResult).toBe(true);
  });

  expect(result.current.isLoggedIn).toBe(true);
  expect(result.current.email).toBe("hello@edited.com");

  act(() => {
    result.current.logout();
  });

  expect(result.current.isLoggedIn).toBe(false);
  expect(result.current.email).toBe("");
});
