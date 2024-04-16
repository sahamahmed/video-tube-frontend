import { Skeleton } from "../../components/ui/skeleton";

export function SkeletonHistory() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-64 w-96  bg-slate-500" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-[300px] bg-slate-500" />
        <Skeleton className="h-8 w-[250px] bg-slate-500" />
      </div>
    </div>
  );
}
