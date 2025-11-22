// pages/api/links/link_update_get_post.ts
import { prisma } from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

// const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
          const { id } = req.query;

          if (req.method === "GET") {
                    // Get a single link by id
                    if (!id) return res.status(400).json({ error: "id is required" });
                    const linkId = Number(id);
                    const link = await prisma.link.findUnique({ where: { id: linkId } });
                    return res.status(200).json(link);
          }

          if (req.method === "POST") {
                    // Create or update link
                    const { code, original_url, session_id } = req.body;

                    if (id) {
                              // Update existing
                              const updatedLink = await prisma.link.update({
                                        where: { id: Number(id) },
                                        data: {
                                                  original_url
                                        },
                              });
                              return res.status(200).json(updatedLink);
                    } else {
                              // Create new
                              const newLink = await prisma.link.create({
                                        data: {
                                                  code, original_url, session_id: session_id, count: 0
                                        },
                              });
                              return res.status(201).json(newLink);
                    }
          }

          res.setHeader("Allow", ["GET", "POST"]);
          return res.status(405).end(`Method ${req.method} Not Allowed`);
}
