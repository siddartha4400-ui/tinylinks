// pages/healthz.tsx
import { GetServerSideProps } from "next";
import { useEffect } from "react";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(JSON.stringify({ ok: true, version: "1.0" }));
          return { props: {} }; // won't be used
};

export default function Healthz() {
          useEffect(() => {
                    // Redirect to the same page to trigger a full server request
                    window.location.reload();
          }, []);

          return null; // Nothing renders
}