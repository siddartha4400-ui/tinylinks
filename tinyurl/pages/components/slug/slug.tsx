"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SlugProps {
          sessionId?: string | number;
          pathname: string;
}

const Slug: React.FC<SlugProps> = ({ sessionId, pathname }) => {
          const router = useRouter();
          const [status, setStatus] = useState<"loading" | "notfound" | "expired" | "redirect" | "ok">("loading");
          const [linkData, setLinkData] = useState<any>(null);

          useEffect(() => {
                    if (!pathname) return;

                    setStatus("loading");
                    fetch(`/api/links/slug_links?code=${pathname}`)
                              .then((res) => res.json())
                              .then((data) => {
                                        if (!data) {
                                                  setStatus("notfound");
                                        } else {
                                                  setLinkData(data);

                                                  if (data.count >= 1) {
                                                            // console.log(typeof (data.count))
                                                            setStatus("expired");
                                                  } else if (data.count == 0) {
                                                            setStatus("redirect");
                                                            // Delay a little to show loader/message
                                                            setTimeout(() => {
                                                                      router.push(data.original_url);
                                                            }, 1000);
                                                  } else {
                                                            setStatus("notfound"); // count = 1
                                                  }
                                        }
                              })
                              .catch((err) => {
                                        console.error("Failed to fetch link:", err);
                                        setStatus("notfound");
                              });
          }, [pathname, router]);

          // Render content based on status
          const renderContent = () => {
                    switch (status) {
                              case "loading":
                                        return <p className="text-center p-6 text-blue-600">Loading...</p>;
                              case "notfound":
                                        return <p className="text-center p-6 text-red-600">❌ 404 Link does not exist.</p>;
                              case "expired":
                                        return <p className="text-center p-6 text-orange-600">⚠️ 302 This link has expired.</p>;
                              case "redirect":
                                        return <p className="text-center p-6 text-green-600">✅ 200 Redirecting to the original URL...</p>;
                              case "ok":
                                        return <p className="text-center p-6 text-green-600">✅ Link is valid. Redirecting soon...</p>;
                              default:
                                        return null;
                    }
          };

          return <div className="min-h-screen flex items-center justify-center">{renderContent()}</div>;
};

export default Slug;
