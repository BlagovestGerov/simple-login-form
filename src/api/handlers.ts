import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/login", async ({ request }) => {
    const data = (await request.json()) as { email: string; password: string };

    const email = data?.email;
    const password = data?.password;

    if (email === "hello@edited.com" && password === "hello123") {
      return HttpResponse.json({ success: true, email }, { status: 200 });
    }

    return HttpResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }),
];
