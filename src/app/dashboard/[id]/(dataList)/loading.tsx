import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const TableSkeleton = () => (
  <div className="max-w-4xl mx-auto my-8">
    <div className="space-y-4 mx-3 xs:mx-0">
      <Skeleton className="h-8 w-full" />

      <div className="rounded-md border hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={5}>
                <Skeleton className="h-8 " />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...new Array(5)].map((_, idx) => (
              <TableRow key={idx}>
                {[...new Array(5)].map((_, idx) => (
                  <TableCell key={idx}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="grid grid-rows-5 gap-3  md:hidden">
        {[...new Array(5)].map((_, idx) => (
          <Skeleton key={idx} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-8 w-full" />
    </div>
  </div>
);

function LoadingPage() {
  return <TableSkeleton />;
}

export default LoadingPage;
