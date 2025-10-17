"use client";
import useSWR from "swr";
import Container from "@/components/Container";
import Skeleton from "@/components/Skeleton";
import { useState } from "react";
import { toast } from "sonner";
import { Category } from "@/types";
// removed ui imports
import { MoreHorizontal } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminCategoriesPage() {
  const { data, mutate } = useSWR("/api/admin/categories", fetcher);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
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
        body: JSON.stringify({ name, description, parentId }),
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
      setParentId(null);
      const wasEdit = Boolean(editingId);
      setEditingId(null);
      toast.success(wasEdit ? "Category updated" : "Category created");
      mutate();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed";
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      toast.error(msg);
    }
  }

  function edit(c: Category) {
    setEditingId(c._id);
    setName(c.name || "");
    setDescription(c.description || "");
    setParentId(c.parentId || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setDescription("");
    setParentId(null);
  }

  return (
    <Container className="m-30">
      <h1 className="text-3xl font-extrabold tracking-tight ml-20">
        Categories
      </h1>
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
        className="mx-20 my-10 grid sm:grid-cols-4 gap-3 max-w-3xl"
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
        <select
          value={parentId || ""}
          onChange={(e) => setParentId(e.target.value || null)}
          className="rounded-lg border px-3 py-2"
        >
          <option value="">📁 Main Category</option>
          {data?.categories
            ?.filter((c: Category) => !c.parentId)
            .map((c: Category) => (
              <option key={c._id} value={c._id}>
                📁 {c.name}
              </option>
            ))}
        </select>
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-5 py-2 text-sm rounded-lg bg-black text-white"
          >
            {editingId ? "Save Changes" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-5 py-2 text-sm rounded-lg border"
            >
              Cancel
            </button>
          )}
        </div>
        {error && <p className="sm:col-span-4 text-sm text-red-600">{error}</p>}
      </form>

      <div className="mx-20 overflow-x-auto">
        <table className="min-w-full text-sm w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Description</th>
              <th className="py-2 pr-4">Type</th>
              <th className="py-2 pr-4">Parent</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.categories?.map((c: Category) => {
              const parentCategory = data?.categories?.find(
                (p: Category) => p._id === c.parentId
              );
              return (
                <tr key={c._id} className="border-b last:border-0">
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-2">
                      {c.parentId && <span className="text-gray-400">└─</span>}
                      <span className={c.parentId ? "text-sm" : "font-medium"}>
                        {c.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 pr-4">{c.description}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        c.parentId
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {c.parentId ? "Sub-category" : "Main Category"}
                    </span>
                  </td>
                  <td className="py-2 pr-4">
                    {parentCategory ? (
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">📁</span>
                        <span>{parentCategory.name}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-2 pr-4">
                    <div className="inline-flex gap-2">
                      <button
                        className="rounded-lg border px-3 py-1 text-sm"
                        onClick={() => edit(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-lg border px-3 py-1 text-sm"
                        onClick={() => remove(c._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
