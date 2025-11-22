"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import customAlert from '../../helpers/popup';

export default function FormComponent(props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // id of record to update

  const [form, setForm] = useState({
    targetUrl: "",
    shortUrl: "",
    code: "",
    error: "",
  });
  const [loading, setLoading] = useState(false); // separate loading state

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Fetch existing record if id exists
  useEffect(() => {
    if (!id) return;

    setLoading(true); // show loader
    fetch(`/api/links/link_update_get_post?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setForm({
            targetUrl: data.original_url,
            shortUrl: `${APP_URL}/${data.code}`,
            code: data.code,
            error: "",
          });
        }
        setLoading(false); // hide loader
      })
      .catch((err) => {
        console.error(err);
        setForm((prev) => ({ ...prev, error: "Failed to fetch record" }));
        setLoading(false); // hide loader
      });
  }, [id]);

  // URL validation
  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setForm((prev) => ({ ...prev, error: "" }));

    if (!form.targetUrl) {
      setForm((prev) => ({ ...prev, error: "Please enter a URL" }));
      return;
    }
    if (!isValidUrl(form.targetUrl)) {
      setForm((prev) => ({ ...prev, error: "Invalid URL format" }));
      return;
    }

    setLoading(true); // show loader during submit

    const payload = id
      ? { original_url: form.targetUrl } // update
      : {
        code: form.code || Math.random().toString(36).substring(2, 8),
        original_url: form.targetUrl,
        session_id: props.sessionId?.id || 1,
      }; // create

    const endpoint = id
      ? `/api/links/link_update_get_post?id=${id}`
      : "/api/links/link_update_get_post";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        customAlert(id ? "Link updated!" : "Link created!", "success", 2000);
        router.push("/"); // redirect after success
      } else {
        const body = await res.json();
        setForm((prev) => ({
          ...prev,
          error: body?.error || "Error saving link",
        }));
      }
    } catch (err) {
      console.error(err);
      setForm((prev) => ({ ...prev, error: "Network error" }));
    } finally {
      setLoading(false); // hide loader
    }
  };

  // Show loader while fetching data
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {id ? "Update Link" : "Create Link"}
      </h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block mb-1 font-medium">Paste your URL here</label>
          <input
            value={form.targetUrl}
            onChange={(e) => setForm({ ...form, targetUrl: e.target.value })}
            placeholder="https://example.com/very/long/path"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Shortened URL</label>
          <input
            type="text"
            value={form.shortUrl}
            disabled
            placeholder="Short URL will appear here"
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {loading ? (id ? "Updating..." : "Creating...") : id ? "Update" : "Create"}
          </button>
        </div>

        {form.error && <div className="text-red-600">{form.error}</div>}
      </form>
    </div>
  );
}
