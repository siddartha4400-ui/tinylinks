import { prisma } from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

// const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
          if (req.method === "GET") {
                    const { session_id } = req.query;

                    try {
                              const sessionId = session_id ? Number(session_id) : undefined;
                              if (sessionId && isNaN(sessionId)) {
                                        return res.status(400).json({ error: "Invalid session_id" });
                              }

                              const filter: any = {};
                              if (sessionId) filter.session_id = sessionId;

                              const links = await prisma.link.findMany({ where: filter });
                              return res.status(200).json(links);
                    } catch (err) {
                              console.error("Prisma error:", err);
                              return res.status(500).json({ error: "Failed to fetch links" });
                    }
          }

          res.setHeader("Allow", ["GET"]);
          return res.status(405).end(`Method ${req.method} Not Allowed`);
}
