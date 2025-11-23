// pages/api/links/delete_link.ts
import { prisma } from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

// const prisma = PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
          if (req.method !== "POST") {
                    res.setHeader("Allow", ["POST"]);
                    return res.status(405).end(`Method ${req.method} Not Allowed`);
          }

          const { id, session_id } = req.body;

          if (!id || !session_id) {
                    return res.status(400).json({ error: "Missing id or session_id" });
          }

          try {
                    // Delete the link by id and session_id
                    const deleted = await prisma.link.deleteMany({
                              where: {
                                        id,
                              },
                    });
                    const sessionId = session_id ? Number(session_id) : undefined;
                    if (sessionId && isNaN(sessionId)) {
                              return res.status(400).json({ error: "Invalid session_id" });
                    }

                    const filter: any = {};
                    if (sessionId) filter.session_id = sessionId;

                    const links = await prisma.link.findMany({ where: filter });
                    return res.status(200).json({ deletedCount: deleted.count, links });
          } catch (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Failed to delete link" });
          }
}
