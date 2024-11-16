import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthProvider, useAuth } from "../hooks/useAuth";
import LoginForm from "../components/LoginForm";

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

test("renders the login form correctly", () => {
  render(
    <Wrapper>
      <LoginForm />
    </Wrapper>
  );

  expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /login now/i })
  ).toBeInTheDocument();
});

test("shows error for invalid email", async () => {
  render(
    <Wrapper>
      <LoginForm />
    </Wrapper>
  );

  fireEvent.change(screen.getByPlaceholderText("Username"), {
    target: { value: "invalid-email" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "Password1" },
  });

  fireEvent.click(screen.getByRole("button", { name: /login now/i }));

  expect(await screen.findByText("Invalid email address")).toBeInTheDocument();
});

test("shows error for invalid password", async () => {
  render(
    <Wrapper>
      <LoginForm />
    </Wrapper>
  );

  fireEvent.change(screen.getByPlaceholderText("Username"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "short" },
  });

  fireEvent.click(screen.getByRole("button", { name: /login now/i }));

  expect(
    await screen.findByText(
      "Password must be at least 6 characters with one letter and one digit"
    )
  ).toBeInTheDocument();
});

test("calls login on valid input", async () => {
  const mockLogin = jest.fn(() => Promise.resolve(true));

  jest.spyOn(require("../hooks/useAuth"), "useAuth").mockReturnValue({
    login: mockLogin,
    isLoggedIn: false,
    loading: false,
    email: "",
    logout: jest.fn(),
  });

  render(
    <Wrapper>
      <LoginForm />
    </Wrapper>
  );

  fireEvent.change(screen.getByPlaceholderText("Username"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "Password1" },
  });

  fireEvent.click(screen.getByRole("button", { name: /login now/i }));

  expect(mockLogin).toHaveBeenCalledWith(
    "test@example.com",
    "Password1",
    false
  );
});
