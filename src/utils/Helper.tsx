import Cookies from "universal-cookie";
import { AppDispatch } from "./redux/store";

const cookies = new Cookies();

/**
 * Get the auth token from cookies
 */
export const getTokenFromCookie = (): string | undefined => {
  const token = cookies.get("token");
  console.log("Cookie token:", token);
  return token;
};

/**
 * Set the auth token in cookies
 */
export const setTokenInCookie = (token: string) => {
  cookies.set("token", token, {
    path: "/",        // accessible throughout the site
    sameSite: "lax",  // ✅ lowercase for TypeScript
    // secure: true,   // enable in HTTPS
    maxAge: 7 * 24 * 60 * 60, // optional - 7 days
  });
};

/**
 * Remove the token cookie
 */
export const removeTokenCookie = () => {
  cookies.remove("token", { path: "/" });
};

/**
 * Clear all stored user data (Redux + LocalStorage + Cookie)
 */
export const ClearData = () => {
  try {
    removeTokenCookie();

    console.log("All user data cleared.");
  } catch (err) {
    console.error("Error clearing data:", err);
  }
};
