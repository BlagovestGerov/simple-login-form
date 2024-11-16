import React, {act} from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Profile from "../components/Profile";

test("renders profile correctly", () => {
  const mockLogout = jest.fn();
  render(<Profile email="hello@edited.com" logout={mockLogout} />);

  expect(screen.getByText("Hi, hello@edited.com")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
});

test("calls logout on button click", () => {
  const mockLogout = jest.fn();
  render(<Profile email="hello@edited.com" logout={mockLogout} />);

  fireEvent.click(screen.getByRole("button", { name: /logout/i }));

  expect(mockLogout).toHaveBeenCalled();
});
