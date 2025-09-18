"use client";
import useSWR from "swr";
import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";
import { useState } from "react";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminCategoriesPage() {
  const { data, mutate } = useSWR("/api/admin/categories", fetcher);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const url = editingId
      ? `/api/admin/categories/${editingId}`
      : "/api/admin/categories";
    const method = editingId ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const d = await res.json();
      if (!res.ok) {
        const msg = d.error || "Failed";
        setError(msg);
        toast.error(msg);
        return;
      }
      setName("");
      setDescription("");
      const wasEdit = Boolean(editingId);
      setEditingId(null);
      toast.success(wasEdit ? "Category updated" : "Category created");
      mutate();
    } catch (err: any) {
      const msg = err?.message || "Failed";
      setError(msg);
      toast.error(msg);
    }
  }

  async function remove(id: string) {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Category deleted");
      mutate();
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    }
  }

  function edit(c: any) {
    setEditingId(c._id);
    setName(c.name || "");
    setDescription(c.description || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setDescription("");
  }

  return (
    <Container className="pt-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Categories</h1>
      {!data && (
        <div className="mt-6 space-y-3">
          <Skeleton className="h-10 w-full max-w-xl" />
          <Skeleton className="h-6 w-40" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )}
      <form
        onSubmit={createCategory}
        className="mt-6 grid sm:grid-cols-3 gap-3 max-w-2xl"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="rounded-lg border px-3 py-2"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="rounded-lg border px-3 py-2"
        />
        <button className="rounded-full bg-black text-white px-5 py-2 text-sm hover:bg-gray-900 transition-colors cursor-pointer">
          {editingId ? "Save Changes" : "Add"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={cancelEdit}
            className="rounded-full border border-neutral-300 px-5 py-2 text-sm hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
        {error && <p className="sm:col-span-3 text-sm text-red-600">{error}</p>}
      </form>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Description</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.categories?.map((c: any) => (
              <tr key={c._id} className="border-b last:border-0">
                <td className="py-2 pr-4">{c.name}</td>
                <td className="py-2 pr-4">{c.description}</td>
                <td className="py-2 pr-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => edit(c)}
                      className="rounded-full border border-neutral-300 px-3 py-1 text-xs hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(c._id)}
                      className="rounded-full border border-red-300 text-red-700 px-3 py-1 text-xs hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
