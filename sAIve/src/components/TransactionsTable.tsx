import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { useState, type Key, type ReactElement, } from "react";
import { TrendingUp, TrendingDown, ChevronRight, ChevronLeft } from "lucide-react";


interface Transaction {
  date: string;
  type: string;
  amount: number;
  recipient: string;
}

type TransactionsTableProps = {
  pageSize?: number;
};

export function TransactionsTable({ pageSize = 10, transactions, isLoading, isError, refetch }: TransactionsTableProps & {
    transactions: Transaction[];
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
}) {
  const [page, setPage] = useState(0);

  // React Query fetch


  const pageCount = Math.ceil(transactions.length / pageSize);
  const paginated = transactions.slice().reverse().slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div>
      <Table>
        <TableCaption>
          A list of your recent Transactions.
          <Button variant="link" size="sm" className="ml-2" onClick={() => refetch()}>
            Refresh
          </Button>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Recipient</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {isLoading ? (
            <TableRow>
              <TableCell colSpan={4}>Loading...</TableCell>
            </TableRow>
            ) : isError ? (
            <TableRow>
              <TableCell colSpan={4}>Error loading transactions.</TableCell>
            </TableRow>
            ) : paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>No transactions found.</TableCell>
            </TableRow>
            ) : (
            paginated.map(
              (
              transaction: Transaction,
              index: Key
              ): ReactElement => (
              <TableRow key={index}>
                <TableCell className="text-medium">
                {new Date(transaction.date).toLocaleDateString(undefined, {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
                </TableCell>
                <TableCell className="capitalize">
                {transaction.type === "income" ? (
                  <span className="text-income">
                  <TrendingUp className="h-4 w-4 inline" /> {transaction.type}
                  </span>
                ) : (
                  <span className="text-expense">
                  <TrendingDown className="h-4 w-4 inline" /> {transaction.type}
                  </span>
                )}
                </TableCell>
                <TableCell>{transaction.recipient}</TableCell>
                <TableCell className="text-right">
                ${transaction.amount.toFixed(2)}
                </TableCell>
              </TableRow>
              )
            )
            )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center gap-2 mt-2">
        <Button
          variant={"ghost"}
          size="icon"
          className="px-3 py-1 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span>
          Page {page + 1} of {pageCount}
        </span>
        <Button
          variant={"ghost"}
          size="icon"
          className="px-3 py-1 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(p + 1, pageCount - 1))}
          disabled={page >= pageCount - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
