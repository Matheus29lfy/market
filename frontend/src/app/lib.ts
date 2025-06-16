import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface User {
  username: number;
  role: number;
  token: string;
  authenticate:boolean;
}

const initialState = {
  user: typeof window !== "undefined" ? window.localStorage.getItem('token') : false
};
// const secretKey = "secret";
// const key = new TextEncoder().encode(secretKey);

// export async function encrypt(payload: any) {
//   return await new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("10 sec from now")
//     .sign(key);
// }

// export async function decrypt(input: string): Promise<any> {
//   const { payload } = await jwtVerify(input, key, {
//     algorithms: ["HS256"],
//   });
//   return payload;
// }

export async function setTokenSession(userLogged:User) {
  // Verify credentials && get the user

  // const user = { email: formData.get("email"), name: "John" };
  const user = userLogged
  user.authenticate = true
  // Create the session
  // const expires = new Date(Date.now() + 10 * 1000);
  // const session = await encrypt({ user, expires });

  // Save the session in a cookie
  // cookies().set("session", session, { expires, httpOnly: true });
  localStorage.setItem("token", JSON.stringify(user));
}

export async function logoutClean() {
  // Destroy the session
  localStorage.clear()
}

export function getTokenSession():any {
  return initialState
}
export const isNumeric = (value: string): boolean => {
  return !isNaN(Number(value.replace(',', '.')));
};


// export function getStorageValue(defaultValue) {
//   // getting stored value
//   const saved = localStorage.getItem("token");
//   const tokenConvert =  JSON.stringify(saved)
//   const initial = JSON.parse(tokenConvert);
//   return initial || defaultValue;
// }
// // export async function updateSession(request: NextRequest) {
//   const session = request.cookies.get("session")?.value;
//   if (!session) return;

//   // Refresh the session so it doesn't expire
//   const parsed = await decrypt(session);
//   parsed.expires = new Date(Date.now() + 10 * 1000);
//   const res = NextResponse.next();
//   res.cookies.set({
//     name: "session",
//     value: await encrypt(parsed),
//     httpOnly: true,
//     expires: parsed.expires,
//   });
//   return res;
// }