import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { api, type Character } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, RefreshCw, Search } from "lucide-react";

const columnHelper = createColumnHelper<Character>();

export function CharacterList() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as {
    page?: string;
    name?: string;
  };

  const page = Number(search.page) || 1;
  const name = search.name || "";

  const [searchInput, setSearchInput] = useState(name);

  useEffect(() => {
    setSearchInput(name);
  }, [name]);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["characters", page, name],
    queryFn: () => api.getCharacters(page, name),
    placeholderData: (previousData) => previousData,
    retry: 1,
  });

  const columns = [
    columnHelper.accessor("image", {
      header: "",
      cell: (info) => (
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors">
          <img
            src={info.getValue()}
            alt={info.row.original.name}
            className="w-full h-full object-cover"
          />
        </div>
      ),
      size: 80,
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => (
        <div className="font-semibold text-foreground hover:text-primary transition-colors">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        const variant =
          status === "Alive"
            ? "default"
            : status === "Dead"
              ? "destructive"
              : "secondary";
        return (
          <Badge variant={variant} className="capitalize">
            {status}
          </Badge>
        );
      },
    }),
    columnHelper.accessor("species", {
      header: "Species",
      cell: (info) => (
        <span className="text-muted-foreground">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("location.name", {
      header: "Location",
      cell: (info) => (
        <span className="text-muted-foreground truncate max-w-[200px] block">
          {info.getValue()}
        </span>
      ),
    }),
  ];

  const table = useReactTable({
    data: data?.results ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearch = () => {
    const newSearch: any = { page: 1 };
    if (searchInput) {
      newSearch.name = searchInput;
    }
    navigate({ to: "/", search: newSearch });
  };

  const handlePageChange = (newPage: number) => {
    const newSearch: any = { page: newPage };
    if (name) {
      newSearch.name = name;
    }
    navigate({ to: "/", search: newSearch });
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleRowClick = (character: Character) => {
    navigate({ to: "/character/$id", params: { id: character.id.toString() } });
  };

  const getCharacters = () => {
    if (error) {
      return (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-destructive mb-4">
            Error Loading Characters
          </h2>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error
              ? error.message
              : "An unknown error occurred"}
          </p>
          <Button onClick={handleRefresh} variant="outline">
            Try Again
          </Button>
        </div>
      );
    }
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border py-0 max-h-[88%] overflow-y-auto max-w-[600]">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-card/50 backdrop-blur-sm">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-b border-border">
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-6 py-4 text-left text-sm font-medium text-foreground"
                          style={{ width: header.getSize() }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => handleRowClick(row.original)}
                      className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Showing {data.results.length} of {data.info.count} characters
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={!data.info.prev}
                    className="hover-glow rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-muted-foreground">Page</span>
                    <span className="font-semibold text-primary">{page}</span>
                    <span className="text-sm text-muted-foreground">
                      of {data.info.pages}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!data.info.next}
                    className="hover-glow rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    );
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-portal bg-clip-text text-primary">
            cast.ly
          </h1>
          <Button
            onClick={handleRefresh}
            disabled={isFetching}
            variant="outline"
            size="sm"
            className="hover-glow"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search characters..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 bg-card border-border hover:border-primary/50 focus:border-primary"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-gradient-portal hover:opacity-90"
          >
            Search
          </Button>
        </div>
      </div>

      {getCharacters()}
    </div>
  );
}
