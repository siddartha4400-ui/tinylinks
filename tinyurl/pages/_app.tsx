import '../styles/globals.css';
import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { usePathname } from "next/navigation";
import Slug from './components/slug/slug';

export default function MyApp({ Component, pageProps }: AppProps) {
          const [sessionId, setSessionId] = useState<string | null>(null);
          const pathname = usePathname();

          useEffect(() => {
                    fetch("/api/sessions/sessions")
                              .then(res => res.json())
                              .then(data => setSessionId(data.sessionId))
                              .catch(() => setSessionId(null));
          }, []);

          const allowedRegex = [
                    /^\/$/,
                    /^\/components\/.*/,
                    /^\/dashboard\/.*/,
                    /^\/healthz\/?$/,
          ];

          const isAllowed = allowedRegex.some(rx => rx.test(pathname));

          return (
                    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center">

                              {/* Header */}
                              <header className="w-full py-6 bg-gradient-to-r from-blue-600 to-blue-400 shadow-md flex justify-center relative">
                                        <h1 className="text-4xl font-extrabold text-white text-center select-none">
                                                  TinyLink App
                                        </h1>
                              </header>

                              {/* Main content */}
                              <main className="w-full flex justify-center mt-6 px-4 mb-24">
                                        {/* mb-24 leaves space for sticky footer */}
                                        <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6">
                                                  {isAllowed ? (
                                                            <Component {...pageProps} sessionId={sessionId} />
                                                  ) : (
                                                            <Slug {...pageProps} sessionId={sessionId} pathname={pathname.slice(1)} />
                                                  )}
                                        </div>
                              </main>

                              {/* Sticky Footer */}
                              <footer className="fixed bottom-0 left-0 w-full py-4 bg-gray-100 text-gray-600 text-center  shadow-md">
                                        &copy; {new Date().getFullYear()} TinyLink App
                              </footer>
                    </div>
          );
}
