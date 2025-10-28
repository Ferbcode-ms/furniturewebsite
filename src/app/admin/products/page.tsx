"use client";
import useSWR from "swr";
import Container from "@/components/Container";
import Skeleton from "@/components/Skeleton";
import { useState } from "react";
import { toast } from "sonner";
import { Product, Category } from "@/types";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminProductsPage() {
  const { data, mutate } = useSWR("/api/admin/products", fetcher);
  const { data: cats, mutate: mutateCats } = useSWR(
    "/api/admin/categories",
    fetcher
  );
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    description: "",
    tags: [] as string[],
    // Detailed product information
    dimensions: "",
    materials: "",
    features: "",
    weight: "",
    warranty: "",
    careInstructions: "",
    specifications: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCat, setNewCat] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
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

      setForm((f) => ({ ...f, image: data.url }));
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

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = { ...form, price: Number(form.price), tags: form.tags };
    const url = editingId
      ? `/api/admin/products/${editingId}`
      : "/api/admin/products";
    const method = editingId ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (!res.ok) {
        const msg = d.error || "Failed";
        setError(msg);
        toast.error(msg);
        return;
      }
      setForm({
        name: "",
        price: "",
        image: "",
        category: "",
        description: "",
        tags: [],
        dimensions: "",
        materials: "",
        features: "",
        weight: "",
        warranty: "",
        careInstructions: "",
        specifications: "",
      });
      setPreviewImage("");
      const wasEdit = Boolean(editingId);
      setEditingId(null);
      toast.success(wasEdit ? "Product updated" : "Product created");
      mutate();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed";
      setError(msg);
      toast.error(msg);
    }
  }

  async function remove(id: string) {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Product deleted");
      mutate();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      toast.error(msg);
    }
  }

  function edit(p: Product) {
    setEditingId(p._id);
    setForm({
      name: p.name || "",
      price: String(p.price ?? ""),
      image: p.image || "",
      category: p.category || "",
      description: p.description || "",
      tags: Array.isArray(p.tags) ? p.tags : [],
      dimensions: p.dimensions || "",
      materials: p.materials || "",
      features: p.features || "",
      weight: p.weight || "",
      warranty: p.warranty || "",
      careInstructions: p.careInstructions || "",
      specifications: p.specifications || "",
    });
    setPreviewImage(p.image || "");

    // Set the main category for editing
    if (p.category) {
      const categoryData = cats?.categories?.find(
        (c: Category) => c.name === p.category
      );
      if (categoryData?.parentId) {
        // If it's a subcategory, find and set the parent category
        const parentCategory = cats?.categories?.find(
          (c: Category) => c._id === categoryData.parentId
        );
        setSelectedMainCategory(parentCategory?.name || "");
      } else {
        // If it's a main category, set it as selected main category
        setSelectedMainCategory(p.category);
      }
    } else {
      setSelectedMainCategory("");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({
      name: "",
      price: "",
      image: "",
      category: "",
      description: "",
      tags: [],
      dimensions: "",
      materials: "",
      features: "",
      weight: "",
      warranty: "",
      careInstructions: "",
      specifications: "",
    });
    setSelectedMainCategory("");
    setPreviewImage("");
  }

  async function addCategoryInline(e: React.FormEvent) {
    e.preventDefault();
    if (!newCat.trim()) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCat.trim() }),
    });
    if (res.ok) {
      setNewCat("");
      mutateCats();
    }
  }

  // Get main categories (categories without parentId)
  const mainCategories =
    cats?.categories?.filter((c: Category) => !c.parentId) || [];

  // Get sub-categories for selected main category
  const subCategories =
    cats?.categories?.filter(
      (c: Category) =>
        c.parentId &&
        mainCategories.find(
          (main: Category) => main.name === selectedMainCategory
        )?._id === c.parentId
    ) || [];

  // Handle main category selection
  const handleMainCategoryChange = (mainCategoryName: string) => {
    setSelectedMainCategory(mainCategoryName);
    setForm((f) => ({ ...f, category: mainCategoryName })); // Set main category as selected category
  };

  // Handle sub-category selection
  const handleSubCategoryChange = (subCategoryName: string) => {
    setForm((f) => ({ ...f, category: subCategoryName }));
  };

  return (
    <Container className="sm:my-25 my-15">
      <h1 className="text-3xl font-extrabold tracking-tight sm:ml-10 ml-5">
        Products
      </h1>
      {!data && (
        <div className="mt-6 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-48 w-full" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )}
      <form
        onSubmit={createProduct}
        className="sm:m-10 m-5 grid lg:grid-cols-3 gap-4 items-start"
      >
        <div className="space-y-3 lg:col-span-2  rounded-xl border p-4 bg-[#FAFAFA]">
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Name"
              required
              className="rounded-lg border px-3 py-2"
            />
            <input
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
              placeholder="Price"
              type="number"
              step="0.01"
              required
              className="rounded-lg border px-3 py-2"
            />
            <div className="sm:col-span-2 space-y-2">
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
                value={form.image}
                onChange={(e) =>
                  setForm((f) => ({ ...f, image: e.target.value }))
                }
                placeholder="Or enter image URL"
                className="rounded-lg border px-3 py-2 w-full"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3 sm:col-span-2">
              <div className="space-y-2">
                <select
                  value={selectedMainCategory}
                  onChange={(e) => handleMainCategoryChange(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="">Select Main Category</option>
                  {mainCategories.map((c: Category) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {selectedMainCategory && (
                  <select
                    value={form.category}
                    onChange={(e) => handleSubCategoryChange(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2"
                  >
                    <option value="">Select Sub-Category</option>
                    {subCategories.map((c: Category) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  placeholder="New category"
                  className="flex-1 rounded-lg border px-3 py-2"
                />
                <button
                  onClick={addCategoryInline}
                  type="button"
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="sm:col-span-2 flex items-center gap-4">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.tags.includes("trending")}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      tags: e.target.checked
                        ? Array.from(new Set([...(f.tags || []), "trending"]))
                        : (f.tags || []).filter((t) => t !== "trending"),
                    }))
                  }
                />
                Trending
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.tags.includes("arrival")}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      tags: e.target.checked
                        ? Array.from(new Set([...(f.tags || []), "arrival"]))
                        : (f.tags || []).filter((t) => t !== "arrival"),
                    }))
                  }
                />
                Arrival
              </label>
            </div>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Description"
              className="rounded-lg border px-3 py-2 sm:col-span-2"
            />
          </div>

          {/* Detailed Product Information */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                value={form.dimensions}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dimensions: e.target.value }))
                }
                placeholder="Dimensions (e.g., 120cm x 80cm x 45cm)"
                className="rounded-lg border px-3 py-2"
              />
              <input
                value={form.materials}
                onChange={(e) =>
                  setForm((f) => ({ ...f, materials: e.target.value }))
                }
                placeholder="Materials (e.g., Solid Oak, Steel Legs)"
                className="rounded-lg border px-3 py-2"
              />
              <input
                value={form.weight}
                onChange={(e) =>
                  setForm((f) => ({ ...f, weight: e.target.value }))
                }
                placeholder="Weight (e.g., 25kg)"
                className="rounded-lg border px-3 py-2"
              />
              <input
                value={form.warranty}
                onChange={(e) =>
                  setForm((f) => ({ ...f, warranty: e.target.value }))
                }
                placeholder="Warranty (e.g., 2 years)"
                className="rounded-lg border px-3 py-2"
              />
              <textarea
                value={form.features}
                onChange={(e) =>
                  setForm((f) => ({ ...f, features: e.target.value }))
                }
                placeholder="Key Features (one per line)"
                className="rounded-lg border px-3 py-2 sm:col-span-2"
                rows={3}
              />
              <textarea
                value={form.careInstructions}
                onChange={(e) =>
                  setForm((f) => ({ ...f, careInstructions: e.target.value }))
                }
                placeholder="Care Instructions"
                className="rounded-lg border px-3 py-2 sm:col-span-2"
                rows={2}
              />
              <textarea
                value={form.specifications}
                onChange={(e) =>
                  setForm((f) => ({ ...f, specifications: e.target.value }))
                }
                placeholder="Technical Specifications"
                className="rounded-lg border px-3 py-2 sm:col-span-2"
                rows={3}
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
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
        </div>
        <div className="rounded-xl border p-4 bg-[#FAFAFA]">
          <h3 className="font-semibold mb-2">Preview</h3>
          <div className="text-xs text-neutral-600 mb-2">
            How it might look in listings
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              previewImage ||
              form.image ||
              "https://via.placeholder.com/600x400?text=Preview"
            }
            alt="Preview"
            className="h-48 w-full object-cover rounded-lg border"
          />
          <div className="mt-2">
            <div className="font-medium truncate">
              {form.name || "Product name"}
            </div>
            <div className="text-sm text-neutral-600">
              ₹{form.price || "0.00"}
            </div>
            {form.tags?.length > 0 && (
              <div className="mt-1 text-xs text-neutral-500">
                Tags: {form.tags.join(", ")}
              </div>
            )}
          </div>
        </div>
      </form>

      <div className="sm:m-10 m-5 overflow-auto">
        <table className="min-w-full text-sm w-full overflow-auto">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Materials</th>
              <th className="py-2 pr-4">Tags</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.products?.map((p: Product) => (
              <tr key={p._id} className="border-b last:border-0">
                <td className="py-2 pr-4">{p.name}</td>
                <td className="py-2 pr-4">
                  ₹{p.price?.toFixed?.(2) ?? p.price}
                </td>
                <td className="py-2 pr-4">{p.category || "-"}</td>
                <td className="py-2 pr-4 max-w-xs truncate">
                  {p.materials || "-"}
                </td>
                <td className="py-2 pr-4">
                  {Array.isArray(p.tags) ? p.tags.join(", ") : "-"}
                </td>
                <td className="py-2 pr-4">
                  <div className="inline-flex gap-2">
                    <button
                      className="rounded-lg border px-3 py-1 text-sm"
                      onClick={() => edit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg border px-3 py-1 text-sm"
                      onClick={() => remove(p._id)}
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
