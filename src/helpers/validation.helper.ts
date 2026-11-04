export type RegistrationInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export function parseRegistration(
  body: unknown,
): { data: RegistrationInput } | { error: string } {
  const { email, password, firstName, lastName } =
    (body as Record<string, unknown> | undefined) ?? {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    firstName.trim() === "" ||
    lastName.trim() === ""
  ) {
    return { error: "email, password, firstName and lastName are required" };
  }

  if (password.length < 8) {
    return { error: "password must be at least 8 characters" };
  }

  return {
    data: {
      email: email.toLowerCase(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    },
  };
}