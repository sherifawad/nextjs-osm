import { authOptions } from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/table/table-data";
import { Suspense } from "react";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { columns } from "./table/columns";
import { User } from "@/types";
import { getUsersResult } from "./_actions";
import { UserSearchParams, UserSearchParamsSchema } from "@/app/schema";
import { splitStringToArray } from "@/lib/utils/array";

export const dynamic = "force-dynamic";

type UserPageProps = {
  searchParams: { [key: string]: string[] | string | undefined };
  params: {
    id: string;
  };
};

async function UserPage({ searchParams, params: pageParams }: UserPageProps) {
  const session = await getServerSession(authOptions);
  const header = headers();
  const host = header.get("host");
  if (!session?.user) {
    redirect(`http://${host}/api/auth/signin?callbackUrl=http://${host}`);
  }

  let data: User[] = [];
  let count = 0;
  let paramsData: UserSearchParams = {
    column: ["name", "email"],
    page: 1,
    search: "",
    size: 5,
    sort: "desc",
    filter: undefined,
  };

  const parsedSearchParams = UserSearchParamsSchema.safeParse(searchParams);

  if (parsedSearchParams.success) {
    const page = parsedSearchParams.data.page;
    const size = parsedSearchParams.data.size;
    const sortedColumn = parsedSearchParams.data.column;
    const sortingType = parsedSearchParams.data.sort;
    const search = parsedSearchParams.data.search;
    const filter = parsedSearchParams.data.filter;
    paramsData = {
      ...paramsData,
      page,
      size,
      column: sortedColumn || paramsData.column,
      search,
      sort: sortingType || paramsData.sort,
      filter,
    };

    const result = await getUsersResult({
      userId: session?.user.id,
      // role: session.user.role,
      ...paramsData,
    });
    count = result.count;
    data = result.data;
  } else {
    const params = new URLSearchParams();
    Object.entries(paramsData).forEach((data) => {
      params.set(`${data[0]}`, `${data[1]}`);
    });
    redirect(`http://${host}/dashboard/${session.user.id}/users?${params}`);
  }

  return (
    <section className="max-w-4xl mx-auto mb-8">
      <Suspense
        key={count + paramsData.page + paramsData.size}
        fallback={<>Loading .... </>}
      >
        <div className="space-y-4 py-8">
          <DataTable data={data} columns={columns} />
          <DataTablePagination count={count} {...paramsData} />
        </div>
      </Suspense>
    </section>
  );
}

export default UserPage;
