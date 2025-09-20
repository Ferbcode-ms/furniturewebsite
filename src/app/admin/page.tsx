import Container from "@/components/ui/Container";
import Link from "next/link";

export default function AdminHome() {
  return (
    <Container className="pt-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Quick actions and overview
          </p>
        </div>
        <a
          href="/api/admin/logout"
          className="rounded-full border px-4 py-2 text-sm hover:bg-neutral-50"
        >
          Logout
        </a>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/orders"
          className="group rounded-2xl border bg-[#FAFAFA] p-5 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-500">Orders</div>
              <div className="text-xl font-semibold">Manage Orders</div>
            </div>
            <div className="h-10 w-10 rounded-full border grid place-items-center group-hover:bg-black group-hover:text-white transition">
              ↗
            </div>
          </div>
          <p className="mt-2 text-sm text-neutral-600">
            View, filter, export, and print invoices.
          </p>
        </Link>

        <Link
          href="/admin/categories"
          className="group rounded-2xl border bg-[#FAFAFA] p-5 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-500">Categories</div>
              <div className="text-xl font-semibold">Manage Categories</div>
            </div>
            <div className="h-10 w-10 rounded-full border grid place-items-center group-hover:bg-black group-hover:text-white transition">
              ↗
            </div>
          </div>
          <p className="mt-2 text-sm text-neutral-600">
            Create, edit, and delete product categories.
          </p>
        </Link>

        <Link
          href="/admin/products"
          className="group rounded-2xl border bg-[#FAFAFA] p-5 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-500">Products</div>
              <div className="text-xl font-semibold">Manage Products</div>
            </div>
            <div className="h-10 w-10 rounded-full border grid place-items-center group-hover:bg-black group-hover:text-white transition">
              ↗
            </div>
          </div>
          <p className="mt-2 text-sm text-neutral-600">
            Add, edit, and delete products with details.
          </p>
        </Link>
      </div>
    </Container>
  );
}
