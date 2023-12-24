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
  <div className="max-w-4xl mx-auto mb-8">
    <div className="space-y-4">
      <div className="rounded-md border">
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
      <Skeleton className="h-8 w-full" />
    </div>
  </div>
);

function LoadingPage() {
  return <TableSkeleton />;
}

export default LoadingPage;
