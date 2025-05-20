import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { 
  TrendingUp, 
  TrendingDown, 
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Transaction {
    date: string;
    type: string;
    amount: number;
    recipient: string;
    }





export default function TransactionsTable() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
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

    return (

            <Table>
                <TableCaption>A list of your recent Transactions.</TableCaption>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction, index) => (
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

                        

    );
}
