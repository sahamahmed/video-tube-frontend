import { Skeleton } from "../../components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[20rem] w-[300px] rounded-xl bg-slate-500" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]  bg-slate-500" />
        <div className="flex justify-start items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full  bg-slate-500" />
          <Skeleton className="h-4 w-[200px]   bg-slate-500" />
        </div>
      </div>
    </div>
  );
}
