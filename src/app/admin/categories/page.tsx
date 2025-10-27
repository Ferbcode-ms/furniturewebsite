"use client";
import useSWR from "swr";
import Container from "@/components/Container";
import Skeleton from "@/components/Skeleton";
import { useState, Fragment } from "react";
import { toast } from "sonner";
import { Category } from "@/types";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminCategoriesPage() {
  const { data, mutate } = useSWR("/api/admin/categories", fetcher);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setImage(data.url);
      setPreviewImage(data.url);
      toast.success("Image uploaded successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  }

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
        body: JSON.stringify({ name, description, image, parentId }),
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
      setImage("");
      setParentId(null);
      setPreviewImage("");
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
    setImage(c.image || "");
    setPreviewImage(c.image || "");
    setParentId(c.parentId || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setDescription("");
    setImage("");
    setParentId(null);
    setPreviewImage("");
  }

  return (
    <Container className="sm:m-30 m-15">
      <h1 className="text-3xl font-extrabold tracking-tight sm:ml-20 ml-5">
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
        className="sm:mx-20 mx-5 my-10 space-y-4 max-w-3xl"
      >
        <div className="grid sm:grid-cols-3 gap-3">
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
        </div>

        {/* Image Upload Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category Image</label>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                disabled={uploading}
                className="rounded-lg border px-3 py-2 w-full"
              />
              {uploading && (
                <p className="text-sm text-neutral-500">Uploading...</p>
              )}
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Or enter image URL"
                className="rounded-lg border px-3 py-2 w-full"
              />
            </div>
            {previewImage || image ? (
              <div className="rounded-lg border p-2 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewImage || image}
                  alt="Preview"
                  className="max-h-32 max-w-full object-contain rounded"
                />
              </div>
            ) : null}
          </div>
        </div>

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
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      <div className="sm:mx-20 mx-5 overflow-x-auto">
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
            {data?.categories
              ?.filter((c: Category) => !c.parentId) // Show main categories first
              .sort((a: Category, b: Category) => a.name.localeCompare(b.name))
              .map((mainCategory: Category) => {
                const subCategories =
                  data?.categories
                    ?.filter((c: Category) => c.parentId === mainCategory._id)
                    .sort((a: Category, b: Category) =>
                      a.name.localeCompare(b.name)
                    ) || [];

                return (
                  <Fragment key={mainCategory._id}>
                    {/* Main Category Row */}
                    <tr className="border-b bg-gray-50">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">📁</span>
                          <span className="font-medium">
                            {mainCategory.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">{mainCategory.description}</td>
                      <td className="py-3 pr-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                          Main Category
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-gray-400">-</span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="inline-flex gap-2">
                          <button
                            className="rounded-lg border px-3 py-1 text-sm"
                            onClick={() => edit(mainCategory)}
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-lg border px-3 py-1 text-sm"
                            onClick={() => remove(mainCategory._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Sub-categories Rows */}
                    {subCategories.map((subCategory: Category) => (
                      <tr key={subCategory._id} className="border-b">
                        <td className="py-2 pr-4 pl-8">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">└─</span>
                            <span className="text-sm">{subCategory.name}</span>
                          </div>
                        </td>
                        <td className="py-2 pr-4">{subCategory.description}</td>
                        <td className="py-2 pr-4">
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                            Sub-category
                          </span>
                        </td>
                        <td className="py-2 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">📁</span>
                            <span className="text-sm">{mainCategory.name}</span>
                          </div>
                        </td>
                        <td className="py-2 pr-4">
                          <div className="inline-flex gap-2">
                            <button
                              className="rounded-lg border px-3 py-1 text-sm"
                              onClick={() => edit(subCategory)}
                            >
                              Edit
                            </button>
                            <button
                              className="rounded-lg border px-3 py-1 text-sm"
                              onClick={() => remove(subCategory._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                );
              })}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
