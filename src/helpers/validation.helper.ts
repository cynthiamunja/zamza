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

export type BusinessInput = {
  name: string;
  slug: string;
  timezone: string;
  phone: string;
  address: string;
  description: string;
};

function isValidTimezone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "auth",
  "login",
  "logout",
  "register",
  "settings",
  "dashboard",
  "support",
  "help",
  "zamza",
]);

export function parseBusiness(
  body: unknown,
): { data: BusinessInput } | { error: string } {
  const input = (body as Record<string, unknown> | undefined) ?? {};
  const { name, slug, timezone, phone, address, description } = input;

  if (
    typeof name !== "string" ||
    typeof slug !== "string" ||
    typeof timezone !== "string" ||
    typeof phone !== "string" ||
    typeof address !== "string" ||
    typeof description !== "string"
  ) {
    return {
      error: "name, slug, timezone, phone, address and description are required",
    };
  }

  const clean = {
    name: name.trim(),
    slug: slug.trim().toLowerCase(),
    timezone: timezone.trim(),
    phone: phone.trim(),
    address: address.trim(),
    description: description.trim(),
  };

  if (Object.values(clean).some((value) => value === "")) {
    return {
      error: "name, slug, timezone, phone, address and description are required",
    };
  }

  if (clean.name.length > 100) {
    return { error: "name must be at most 100 characters" };
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(clean.slug) || clean.slug.length > 50) {
    return {
      error: "slug must be lowercase letters, numbers and single hyphens (max 50)",
    };
  }
    if (RESERVED_SLUGS.has(clean.slug)) {
    return { error: "that slug is reserved, please choose another" };
  }
  if (!isValidTimezone(clean.timezone)) {
    return { error: "timezone must be a valid IANA name, e.g. Africa/Nairobi" };
  }
  if (clean.phone.length < 7 || clean.phone.length > 20) {
    return { error: "phone must be 7 to 20 characters" };
  }
  if (clean.address.length > 200) {
    return { error: "address must be at most 200 characters" };
  }
  if (clean.description.length > 500) {
    return { error: "description must be at most 500 characters" };
  }

  return { data: clean };
}