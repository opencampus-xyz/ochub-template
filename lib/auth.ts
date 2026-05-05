import { createRemoteJWKSet, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { env } from "./env";

const JWKS_URL =
  env.JWKS_URL || "https://static.opencampus.xyz/jwks/jwks-staging.json";
const jwks = createRemoteJWKSet(new URL(JWKS_URL));

export interface AuthState {
  OCId: string;
  ethAddress?: string;
}

/**
 * Wrap API route handlers with OCID authentication
 */
export function withAuth(
  handler: (request: NextRequest, auth: AuthState) => Promise<NextResponse>,
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const authHeader = request.headers.get("Authorization");

      if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json(
          { error: "Missing or invalid Authorization header" },
          { status: 401 },
        );
      }

      const token = authHeader.slice(7);

      if (!env.JWT_AUDIENCE && !env.NEXT_PUBLIC_AUTH_SANDBOX) {
        console.error(
          "JWT_AUDIENCE must be set when NEXT_PUBLIC_AUTH_SANDBOX is false",
        );
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 },
        );
      }

      const { payload } = await jwtVerify(token, jwks, {
        audience: env.JWT_AUDIENCE,
      });
      const OCId = payload.edu_username as string | undefined;

      if (!OCId) {
        return NextResponse.json(
          { error: "Invalid token: missing OCID" },
          { status: 401 },
        );
      }

      return handler(request, {
        OCId,
        ethAddress: payload.eth_address as string | undefined,
      });
    } catch (error) {
      console.error("JWT verification failed:", error);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      );
    }
  };
}
