// pages/api/links/link_update_get_post.ts
import { prisma } from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

// const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
          const { code } = req.query;
          if (req.method === "GET") {
                    if (!code) return res.status(400).json({ error: "code is required" });

                    const linkId = code.toString();

                    // First, fetch the link
                    const link = await prisma.link.findUnique({ where: { code: linkId } });
                    // console.log(link)
                    if (!link) return res.status(404).json({ error: "Link not found" });

                    // Increment count only if it's 0
                    let updatedLink = link;
                    if (true) {
                              const updatedLink = await prisma.link.update({
                                        where: { code: linkId },
                                        data: {
                                                  count: { increment: 1 } // Increment count by 1
                                        }
                              });
                    }

                    return res.status(200).json(link);
          }



          // if (req.method === "POST") {
          //           // Create or update link
          //           const { code, original_url, session_id } = req.body;

          //           if (id) {
          //                     // Update existing
          //                     const updatedLink = await prisma.link.update({
          //                               where: { id: Number(id) },
          //                               data: {
          //                                         original_url
          //                               },
          //                     });
          //                     return res.status(200).json(updatedLink);
          //           } else {
          //                     // Create new
          //                     const newLink = await prisma.link.create({
          //                               data: {
          //                                         code, original_url, session_id: session_id, count: 0
          //                               },
          //                     });
          //                     return res.status(201).json(newLink);
          //           }
          // }

          res.setHeader("Allow", ["GET", "POST"]);
          return res.status(405).end(`Method ${req.method} Not Allowed`);
}
