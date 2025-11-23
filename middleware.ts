import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export function middleware(req: NextRequest) {
          // let sessionId = req.cookies.get("session_id")?.value;

          // if (!sessionId) {
          //           sessionId = uuidv4();
          // }

          const res = NextResponse.next();
          // res.cookies.set({
          //           name: "session_id",
          //           value: sessionId,
          //           path: "/",
          //           httpOnly: true,
          //           maxAge: 7 * 24 * 60 * 60,
          // });

          return res;
}

export const config = {
          matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
