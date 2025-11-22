"use client";
import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import customAlert from '../helpers/popup'
export default function Dashboard({ sessionId }) {
  const router = useRouter();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Helper function for alerts and confirm ---
  // JavaScript version (no type annotations)
  const showDialog = async ({ message = "", type = "alert" }) => {
    return new Promise((resolve) => {
      if (type === "confirm") {
        resolve(confirm(message));
      } else {
        alert(message);
        resolve(true);
      }
    });
  };
  const goToHealthz = () => {
    router.push("/healthz"); // Navigate to /healthz
  };

  // Fetch links
  useEffect(() => {
    if (!sessionId?.id) return;

    setLoading(true);
    fetch(`/api/links/link_get_all_session_urls?session_id=${sessionId.id}`)
      .then((res) => res.json())
      .then((data) => setLinks(data || []))
      .catch((err) => console.error("Failed to fetch links:", err))
      .finally(() => setLoading(false));
  }, [sessionId?.id]);

  // Actions
  const handleUpdate = (id) => {
    if (!id) return;
    router.push(`/components/formcomponent?id=${id}`);
  };

  const handleDelete = async (id) => {
    const sid = sessionId?.id;
    if (!sid) return;

    const confirmed = await showDialog({ message: "Delete this link?", type: "confirm" });
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch("/api/links/delete_link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, session_id: sid }),
      });
      const data = await res.json();

      if (res.ok) {
        // showDialog({ message: `Deleted link: ${id}` });
        customAlert(`Deleted link!`, "success", 2000);
        setLinks((prev) => prev.filter((link) => link.id !== id));
      } else {
        // showDialog({ message: data.error || "Failed to delete" });
        customAlert("Failed to delete", "error", 2000);
      }
    } catch (err) {
      console.error(err);
      // showDialog({ message: "Error deleting link" });
      customAlert("Error deleting link", "error", 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(`${window.location.origin}/${code}`);
    customAlert("Link copied!", "success", 2000);
  };

  // Add this function inside your Dashboard component
  const handleClick = (code) => {
    if (!code) return;

    window.open(`${window.location.origin}/${code}`, "_blank"); // open in new tab
  };

  // Update table columns
  const columns = useMemo(
    () => [
      { accessorKey: "code", header: "Code" },
      { accessorKey: "original_url", header: "URL" },
      {
        accessorKey: "count",
        header: "URL Hits"
        // ,
        // cell: ({ row }) =>
        //   row.original.count === 0 ? (
        //     <span className="text-green-600 font-semibold">Active</span>
        //   ) : (
        //     <span className="text-red-600 font-semibold">Expired</span>
        //   ),
      },
      { accessorKey: "updated_at", header: "Last Hit Time" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleUpdate(row.original.id)}
              className="px-2 py-1 bg-yellow-100 rounded hover:bg-yellow-200"
            >
              Update
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="px-2 py-1 bg-red-100 rounded hover:bg-red-200"
            >
              Delete
            </button>
            <button
              onClick={() => handleCopy(row.original.code)}
              className="px-2 py-1 bg-green-100 rounded hover:bg-green-200"
            >
              Copy
            </button>
            <button
              onClick={() => handleClick(row.original.code)}
              className="px-2 py-1 bg-blue-100 rounded hover:bg-blue-200"
            >
              Click
            </button>
          </div>
        ),
      },
    ],
    [sessionId]
  );


  const table = useReactTable({
    data: links,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex-1">TinyLink Dashboard</h1>
        <Link href="/components/formcomponent">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Create TinyLink</button>
        </Link>
        <button
          onClick={goToHealthz}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mx-2"
        >
          Healthz
        </button>
      </div>

      {loading ? (
        <div className="text-center my-6">
          <div className="inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500">Loading links...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="border px-2 py-1">{flexRender(header.column.columnDef.header, header.getContext())}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {links.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center text-red-600 py-4 font-semibold"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-t">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="border px-2 py-1 truncate max-w-xs">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}
