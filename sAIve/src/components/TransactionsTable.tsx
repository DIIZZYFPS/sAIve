import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import api from "@/lib/api";

interface Transaction {
  date: string;
  type: string;
  amount: number;
  recipient: string;
}


type TransactionsTableProps = {
  pageSize?: number;
};

export default function TransactionsTable({ pageSize = 10 }: TransactionsTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0);

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTransactions();
    }, 30000); // Fetch every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Pagination logic
  const pageCount = Math.ceil(transactions.length / pageSize);
  const paginated = transactions.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent Transactions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Recipient</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((transaction, index) => (
            <TableRow key={index}>
              <TableCell className="text-medium">
                {new Date(transaction.date).toLocaleDateString(undefined, {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric"
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
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center gap-2 mt-4">
        <Button
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
        >
          Prev
        </Button>
        <span>
          Page {page + 1} of {pageCount}
        </span>
        <Button
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(p + 1, pageCount - 1))}
          disabled={page >= pageCount - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
