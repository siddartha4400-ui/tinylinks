import { prisma } from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
// const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
          if (req.method === "GET") {
                    const links = await prisma.link.findMany(); // use 'Link'
                    return res.status(200).json(links);
          }

          if (req.method === "POST") {
                    const { code, original_url, session_id } = req.body;
                    const newLink = await prisma.link.create({  // use 'Link'
                              data: {
                                        code,
                                        original_url,
                                        session_id,
                                        count: 0,
                              },
                    });
                    return res.status(201).json(newLink);
          }

          res.setHeader("Allow", ["GET", "POST"]);
          return res.status(405).end(`Method ${req.method} Not Allowed`);
}
