import {
  getSignedCookie,
  setSignedCookie,
} from "https://deno.land/x/hono@v3.12.11/helper.ts";

const COOKIE_SECRET = "a-very-secret-cookie-signing-secret-key";

export async function getUsersSession(c) {
  const sessionId =
    (await getSignedCookie(c, COOKIE_SECRET, "sessionId")) ??
    crypto.randomUUID();

  await setSignedCookie(c, "sessionId", sessionId, COOKIE_SECRET, {
    path: "/",
  });
  return sessionId;
}
