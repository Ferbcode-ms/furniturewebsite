"use client";
import useSWR from "swr";
import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";
import { useState } from "react";
import { toast } from "sonner";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
        className="mt-6 grid sm:grid-cols-4 gap-3 max-w-3xl"
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
        <Select
          value={parentId || ""}
          onValueChange={(v) => setParentId(v || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="📁 Main Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">📁 Main Category</SelectItem>
            {data?.categories
              ?.filter((c: Category) => !c.parentId)
              .map((c: Category) => (
                <SelectItem key={c._id} value={c._id}>
                  📁 {c.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button type="submit" className="px-5 py-2 text-sm">
            {editingId ? "Save Changes" : "Add"}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="outline"
              onClick={cancelEdit}
              className="px-5 py-2 text-sm"
            >
              Cancel
            </Button>
          )}
        </div>
        {error && <p className="sm:col-span-4 text-sm text-red-600">{error}</p>}
      </form>

      <div className="mt-6 overflow-x-auto">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow className="text-left border-b">
              <TableHead className="py-2 pr-4">Name</TableHead>
              <TableHead className="py-2 pr-4">Description</TableHead>
              <TableHead className="py-2 pr-4">Type</TableHead>
              <TableHead className="py-2 pr-4">Parent</TableHead>
              <TableHead className="py-2 pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.categories?.map((c: Category) => {
              const parentCategory = data?.categories?.find(
                (p: Category) => p._id === c.parentId
              );
              return (
                <TableRow key={c._id} className="border-b last:border-0">
                  <TableCell className="py-2 pr-4">
                    <div className="flex items-center gap-2">
                      {c.parentId && <span className="text-gray-400">└─</span>}
                      <span className={c.parentId ? "text-sm" : "font-medium"}>
                        {c.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 pr-4">{c.description}</TableCell>
                  <TableCell className="py-2 pr-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        c.parentId
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {c.parentId ? "Sub-category" : "Main Category"}
                    </span>
                  </TableCell>
                  <TableCell className="py-2 pr-4">
                    {parentCategory ? (
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">📁</span>
                        <span>{parentCategory.name}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="py-2 pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => edit(c)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => remove(c._id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
