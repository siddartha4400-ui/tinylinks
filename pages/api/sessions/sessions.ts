// pages/api/session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { v4 as uuidv4 } from "uuid";

// const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
          let sessionId = req.cookies["session_id"];

          let session;
          if (sessionId) {
                    session = await prisma.session.findUnique({ where: { token: sessionId } });
          }

          if (!session) {
                    sessionId = uuidv4();
                    session = await prisma.session.create({
                              data: { token: sessionId, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
                    });
                    res.setHeader("Set-Cookie", `session_id=${sessionId}; Path=/; HttpOnly; Max-Age=${7 * 24 * 60 * 60}`);
          }
          res.status(200).json({ sessionId: session });
}
