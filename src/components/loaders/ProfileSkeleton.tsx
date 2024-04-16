import { Skeleton } from "../../components/ui/skeleton";

export function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-48 w-48 rounded-full bg-slate-500" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-[300px] bg-slate-500" />
        <Skeleton className="h-8 w-[250px] bg-slate-500" />
      </div>
    </div>
  );
}
