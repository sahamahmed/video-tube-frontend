import { Skeleton } from "../../components/ui/skeleton";

export function SkeletonComment() {
  return (
        <div className="flex justify-start items-start gap-2 ">
          <Skeleton className="h-8 w-8 rounded-full  bg-slate-500" />
          <Skeleton className="h-24 w-full  bg-slate-500" />
        </div>
  );
}
