import Skeleton from "@/components/ui/Skeleton";

interface ProductGridSkeletonProps {
  count?: number;
  viewMode?: "grid" | "list";
}

export default function ProductGridSkeleton({
  count = 6,
  viewMode = "grid",
}: ProductGridSkeletonProps) {
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
          >
            <Skeleton className="w-20 h-20 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <div className="text-right space-y-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-64 w-full rounded-xl" />
      ))}
    </div>
  );
}
