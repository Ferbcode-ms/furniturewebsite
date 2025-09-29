"use client";
import useSWR from "swr";
import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Order, OrderItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminOrdersPage() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/orders",
    fetcher
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<"all" | "today">("all");

  // Filter orders based on current filter
  const filteredOrders = useMemo(() => {
    return (
      data?.orders?.filter((o: Order) => {
        if (dateFilter === "all") return true;
        const created = new Date(o.createdAt);
        const now = new Date();
        return (
          created.getFullYear() === now.getFullYear() &&
          created.getMonth() === now.getMonth() &&
          created.getDate() === now.getDate()
        );
      }) || []
    );
  }, [data?.orders, dateFilter]);

  // Clear selected order if it's not in the filtered results
  useEffect(() => {
    if (
      selectedId &&
      !filteredOrders.some((o: Order) => o._id === selectedId)
    ) {
      setSelectedId(null);
    }
  }, [selectedId, filteredOrders]);

  // Handle filter change
  const handleFilterChange = (newFilter: "all" | "today") => {
    setDateFilter(newFilter);
    // Clear selection when changing filters
    setSelectedId(null);
  };

  function toCsvValue(value: unknown) {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (/[",\n]/.test(str)) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  function buildLineItemsCsv(orders: Order[]) {
    const header = [
      "Order ID",
      "Status",
      "Created",
      "Customer Name",
      "Email",
      "Phone",
      "Item Name",
      "Item Price",
      "Quantity",
      "Line Total",
    ];
    const rows: unknown[][] = [];
    for (const o of orders) {
      const c = o.customer || {};
      for (const it of o.items || []) {
        rows.push([
          o._id,
          o.status || "pending",
          new Date(o.createdAt).toLocaleString(),
          c.fullName || "",
          c.email || o.userEmail || "",
          c.phone || "",
          it.name,
          Number(it.price).toFixed(2),
          it.quantity,
          (Number(it.price) * Number(it.quantity)).toFixed(2),
        ]);
      }
      if (!o.items || o.items.length === 0) {
        rows.push([
          o._id,
          o.status || "pending",
          new Date(o.createdAt).toLocaleString(),
          c.fullName || "",
          c.email || o.userEmail || "",
          c.phone || "",
          "",
          "",
          "0",
          "0.00",
        ]);
      }
    }
    const csv = [header, ...rows]
      .map((r: unknown[]) => r.map((v: unknown) => toCsvValue(v)).join(","))
      .join("\n");
    return csv;
  }

  function downloadItemsCsvFor(orders: Order[], filename: string) {
    const csv = buildLineItemsCsv(orders);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function printInvoice(o: Order) {
    if (!o) return;
    const customer = o.customer || {};
    const itemsRows = (o.items || [])
      .map(
        (it: OrderItem, idx: number) => `
          <tr>
            <td style="padding:8px;border-bottom:1px solid #eee">${idx + 1}</td>
            <td style="padding:8px;border-bottom:1px solid #eee">${it.name}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${
              it.quantity
            }</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${Number(
              it.price
            ).toFixed(2)}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${(
              Number(it.price) * Number(it.quantity)
            ).toFixed(2)}</td>
          </tr>`
      )
      .join("");

    const subtotal =
      o.totals?.subtotal ??
      (o.items || []).reduce(
        (s: number, it: OrderItem) =>
          s + Number(it.price) * Number(it.quantity),
        0
      );
    const shipping = o.totals?.shipping ?? 0;
    const grand = o.totals?.grandTotal ?? o.total ?? subtotal + shipping;

    const win = window.open("", "PRINT", "width=900,height=650");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Invoice ${o._id}</title>
          <style>
            body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,'Helvetica Neue',Arial,'Noto Sans',sans-serif;color:#111}
            .container{max-width:800px;margin:24px auto;padding:0 16px}
            .muted{color:#666}
            .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
            table{width:100%;border-collapse:collapse;margin-top:12px}
            h1,h2,h3{margin:0}
            .totals td{padding:6px}
            @media print{.no-print{display:none}}
          </style>
        </head>
        <body>
          <div class="container">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div>
                <h1>Invoice</h1>
                <div class="muted">Order ID: ${o._id}</div>
                <div class="muted">Status: ${o.status || "pending"}</div>
              </div>
              <div style="text-align:right">
                <div><strong>Furniture Store</strong></div>
                <div class="muted">${new Date(
                  o.createdAt
                ).toLocaleString()}</div>
              </div>
            </div>

            <div class="grid" style="margin-top:16px">
              <div>
                <h3>Bill To</h3>
                <div>${customer.fullName || "-"}</div>
                <div class="muted">${customer.email || o.userEmail || "-"}</div>
                <div class="muted">${customer.phone || ""}</div>
                <div class="muted">${[
                  customer.addressLine1,
                  customer.addressLine2,
                ]
                  .filter(Boolean)
                  .join(" ")}</div>
                <div class="muted">${[
                  customer.city,
                  customer.state,
                  customer.postalCode,
                  customer.country,
                ]
                  .filter(Boolean)
                  .join(", ")}</div>
              </div>
              <div>
                <h3>Summary</h3>
                <table>
                  <tbody class="totals">
                    <tr><td>Subtotal</td><td style="text-align:right">$${Number(
                      subtotal
                    ).toFixed(2)}</td></tr>
                    <tr><td>Shipping</td><td style="text-align:right">$${Number(
                      shipping
                    ).toFixed(2)}</td></tr>
                    <tr><td><strong>Total</strong></td><td style="text-align:right"><strong>$${Number(
                      grand
                    ).toFixed(2)}</strong></td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h3 style="margin-top:24px">Items</h3>
            <table>
              <thead>
                <tr>
                  <th style="text-align:left;padding:8px;border-bottom:1px solid #ccc">#</th>
                  <th style="text-align:left;padding:8px;border-bottom:1px solid #ccc">Product</th>
                  <th style="text-align:center;padding:8px;border-bottom:1px solid #ccc">Qty</th>
                  <th style="text-align:right;padding:8px;border-bottom:1px solid #ccc">Price</th>
                  <th style="text-align:right;padding:8px;border-bottom:1px solid #ccc">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>

            <p class="muted" style="margin-top:24px">Thank you for your purchase.</p>
          </div>
          <script>window.onload = function(){ window.print(); }<\/script>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
  }

  return (
    <Container className="pt-6 sm:pt-8 lg:pt-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
        Orders
      </h1>
      {isLoading && (
        <div className="mt-4 space-y-3">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-10 w-full" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      )}
      {error && (
        <p className="mt-4 text-sm text-red-600">Failed to load orders</p>
      )}
      {data && (
        <div className="mt-4 sm:mt-6 flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Left: Orders table */}
          <div className="flex-[2] min-w-0 h-[60vh] sm:h-[70vh] lg:h-[calc(100vh-200px)] overflow-auto">
            {/* Filters */}
            <div className="mb-3 flex items-center gap-2 flex-wrap">
              <Button
                variant={dateFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("all")}
              >
                All
              </Button>
              <Button
                variant={dateFilter === "today" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("today")}
              >
                Today
              </Button>
              <Separator orientation="vertical" className="mx-2 h-5" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const todayPending = filteredOrders.filter((o: Order) => {
                    return (o.status || "pending") === "pending";
                  });
                  downloadItemsCsvFor(
                    todayPending,
                    `orders_today_pending_items_${Date.now()}.csv`
                  );
                }}
              >
                Download Today Pending Items
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  downloadItemsCsvFor(
                    filteredOrders,
                    `orders_items_${dateFilter}_${Date.now()}.csv`
                  );
                }}
              >
                Download Items CSV (current view)
              </Button>
            </div>
            <div className="overflow-auto max-h-[50vh] sm:max-h-[60vh] lg:max-h-[calc(100vh-200px)]">
              <Table className="min-w-full text-sm">
                <TableHeader>
                  <TableRow className="text-left border-b">
                    <TableHead className="py-2 pr-2 sm:pr-4">
                      Order ID
                    </TableHead>
                    <TableHead className="py-2 pr-2 sm:pr-4 hidden sm:table-cell">
                      Customer
                    </TableHead>
                    <TableHead className="py-2 pr-2 sm:pr-4 hidden md:table-cell">
                      Email
                    </TableHead>
                    <TableHead className="py-2 pr-2 sm:pr-4">Items</TableHead>
                    <TableHead className="py-2 pr-2 sm:pr-4">Status</TableHead>
                    <TableHead className="py-2 pr-2 sm:pr-4">Total</TableHead>
                    <TableHead className="py-2 pr-2 sm:pr-4 hidden lg:table-cell">
                      Created
                    </TableHead>
                    <TableHead className="py-2 pr-2 sm:pr-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((o: Order) => (
                    <TableRow
                      key={o._id}
                      className={`border-b last:border-0 cursor-pointer hover:bg-gray-50 ${
                        selectedId === o._id ? "bg-gray-50" : ""
                      }`}
                      onClick={() =>
                        setSelectedId((prev) => (prev === o._id ? null : o._id))
                      }
                    >
                      <TableCell className="py-2 pr-2 sm:pr-4">
                        <div className="text-xs sm:text-sm font-mono">
                          {o._id.slice(-8)}
                        </div>
                        <div className="text-xs text-gray-500 sm:hidden">
                          {o.customer?.fullName || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="py-2 pr-2 sm:pr-4 hidden sm:table-cell">
                        {o.customer?.fullName || "-"}
                      </TableCell>
                      <TableCell className="py-2 pr-2 sm:pr-4 hidden md:table-cell">
                        <div className="text-xs truncate max-w-[120px]">
                          {o.userEmail || o.customer?.email || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="py-2 pr-2 sm:pr-4">
                        <div className="text-center">
                          {o.items?.length ?? 0}
                        </div>
                      </TableCell>
                      <TableCell className="py-2 pr-2 sm:pr-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs border ${
                            o.status === "forward"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }`}
                        >
                          {o.status || "pending"}
                        </span>
                      </TableCell>
                      <TableCell className="py-2 pr-2 sm:pr-4">
                        <div className="text-sm font-medium">
                          ${o.total?.toFixed?.(2) || "-"}
                        </div>
                        <div className="text-xs text-gray-500 lg:hidden">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="py-2 pr-2 sm:pr-4 hidden lg:table-cell">
                        <div className="text-xs">
                          {new Date(o.createdAt).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="py-2 pr-2 sm:pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                printInvoice(o);
                              }}
                            >
                              Print invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadItemsCsvFor(
                                  [o],
                                  `order_${o._id}_items.csv`
                                );
                              }}
                            >
                              Download items CSV
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Right: Details panel */}
          <div className="flex-[1] lg:sticky lg:top-20 self-start max-h-[50vh] sm:max-h-[60vh] lg:max-h-[calc(100vh-200px)] overflow-auto">
            {selectedId ? (
              (() => {
                const o = filteredOrders.find(
                  (x: Order) => x._id === selectedId
                );
                if (!o) return null;
                const customer = o.customer || {};
                return (
                  <div className="flex flex-row sm:flex-col gap-4 sm:gap-6">
                    <div className="rounded-xl border p-3 sm:p-4 bg-[#FAFAFA]">
                      <h2 className="font-semibold mb-3 text-sm sm:text-base">
                        Customer
                      </h2>
                      <div className="text-xs sm:text-sm space-y-1">
                        <div>
                          <span className="text-neutral-500">Name:</span>{" "}
                          <span className="font-medium">
                            {customer.fullName || "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500">Email:</span>{" "}
                          <span className="break-all">
                            {customer.email || o.userEmail || "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500">Phone:</span>{" "}
                          {customer.phone || "-"}
                        </div>
                        <div className="mt-2">
                          <span className="text-neutral-500">Address:</span>
                          <div className="mt-1">
                            {[customer.addressLine1, customer.addressLine2]
                              .filter(Boolean)
                              .join(" ") || "-"}
                          </div>
                          <div>
                            {[
                              customer.city,
                              customer.state,
                              customer.postalCode,
                              customer.country,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </div>
                        </div>
                        {false && customer.companyName && (
                          <div className="mt-2">
                            <span className="text-neutral-500">Company:</span>{" "}
                            {customer.companyName}
                          </div>
                        )}
                        {false && customer.gstVat && (
                          <div>
                            <span className="text-neutral-500">GST/VAT:</span>{" "}
                            {customer.gstVat}
                          </div>
                        )}
                        {customer.notes && (
                          <div className="mt-2">
                            <span className="text-neutral-500">Notes:</span>{" "}
                            {customer.notes}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="rounded-xl border p-3 sm:p-4 bg-[#FAFAFA]">
                      <h2 className="font-semibold mb-3 text-sm sm:text-base">
                        Items
                      </h2>
                      <div className="rounded-xl border p-3 sm:p-4 bg-[#F7F4EA] mb-4">
                        <h2 className="font-semibold mb-3 text-sm">
                          Status & Actions
                        </h2>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <Select
                            value={o.status || "pending"}
                            onValueChange={async (status) => {
                              try {
                                const res = await fetch("/api/admin/orders", {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({ id: o._id, status }),
                                });
                                if (!res.ok) throw new Error("Update failed");
                                toast.success("Order status updated");
                                await mutate();
                              } catch (err: unknown) {
                                const msg =
                                  err instanceof Error
                                    ? err.message
                                    : "Update failed";
                                toast.error(msg);
                              }
                            }}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">pending</SelectItem>
                              <SelectItem value="forward">forward</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            onClick={() => printInvoice(o)}
                          >
                            Print Invoice
                          </Button>
                        </div>
                      </div>
                      <div className="divide-y">
                        {o.items?.map((it: OrderItem) => (
                          <div
                            key={it.id}
                            className="py-3 flex items-start sm:items-center gap-3"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={it.image}
                              alt={it.name}
                              className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover border flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs sm:text-sm font-medium truncate">
                                {it.name}
                              </div>
                              <div className="text-xs text-neutral-600 mt-1">
                                ${it.price.toFixed(2)} × {it.quantity}
                              </div>
                            </div>
                            <div className="text-xs sm:text-sm font-medium text-right flex-shrink-0">
                              ${(it.price * it.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>
                            ${o.totals?.subtotal?.toFixed?.(2) || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>
                            ${o.totals?.shipping?.toFixed?.(2) || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold text-sm sm:text-base border-t pt-2 mt-2">
                          <span>Total</span>
                          <span>
                            $
                            {o.totals?.grandTotal?.toFixed?.(2) ||
                              o.total?.toFixed?.(2) ||
                              "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="rounded-xl border p-6 bg-[#FAFAFA] text-sm text-neutral-600">
                Select an order to view details.
              </div>
            )}
          </div>
        </div>
      )}
    </Container>
  );
}
