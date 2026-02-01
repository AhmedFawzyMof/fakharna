import * as jose from "jose";

export async function verifyToken(token: string, secret: string) {
  const secretKey = new TextEncoder().encode(secret);
  const { payload } = await jose.jwtVerify(token, secretKey);
  return payload;
}
