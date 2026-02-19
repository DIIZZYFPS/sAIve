import { Button } from '@/components/ui/button';
import {
  Bell,
  Plus,
  CalendarIcon,
  Repeat,
  TrendingUp,
  TrendingDown,
  Wallet
} from 'lucide-react';
import { toast } from 'sonner';
import { ModeToggle } from '@/components/ModeToggle';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Card,
  CardContent
} from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import { Separator } from '@/components/ui/separator';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

import api from '@/lib/api';
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useSettings } from "@/context/SettingsContext";
import { useAi } from "@/context/AiContext";



const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number().min(0, "Amount must be a positive number"),
  date: z.date(),
  category: z.enum(["Food", "Transportation", "Subscriptions", "Bills", "Housing", "Other", "Income"], {
    errorMap: () => ({ message: "Category is required" }),
  }),
  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: "Type is required" }),
  }),
});

function DashboardHeader({ pageName }: { pageName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { formatCurrency, currencySymbol, aiEnabled } = useSettings();
  const { isModelLoaded, suggestCategory } = useAi();
  const [isSuggesting, setIsSuggesting] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestingRef = useRef(false);
  const lastSuggestedRef = useRef("");

  // Profile dropdown data
  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await api.get("/users/1");
      return response.data;
    },
  });

  const { data: currentAsset } = useQuery({
    queryKey: ["asset"],
    queryFn: async () => {
      const response = await api.get("/user_asset/1");
      return response.data;
    },
  });

  const { data: allTransactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await api.get("/transactions/");
      return response.data;
    },
  });

  const userName = userProfile?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();
  const asset = currentAsset?.asset;
  const income = asset?.TIncome ?? 0;
  const expense = asset?.TExpense ?? 0;
  const savings = asset?.TSavings ?? 0;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

  const healthBadge = savingsRate >= 20
    ? { label: "On Track", color: "bg-emerald-500/20 text-emerald-400", dot: "bg-emerald-400" }
    : savingsRate >= 5
      ? { label: "Watch It", color: "bg-yellow-500/20 text-yellow-400", dot: "bg-yellow-400" }
      : { label: "Over Budget", color: "bg-red-500/20 text-red-400", dot: "bg-red-400" };

  const lastTransaction = allTransactions?.length > 0 ? allTransactions[allTransactions.length - 1] : null;

  const handleRepeatTransaction = () => {
    if (!lastTransaction) return;
    const payload = {
      user_id: lastTransaction.user_id,
      recipient: lastTransaction.recipient,
      date: new Date().toISOString().slice(0, 10),
      amount: lastTransaction.amount,
      category: lastTransaction.category,
      type: lastTransaction.type,
    };
    toast.promise(
      api.post("/transactions/", payload).then(() => {
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({ queryKey: ["asset"] });
        queryClient.invalidateQueries({ queryKey: ["assets"] });
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        queryClient.invalidateQueries({ queryKey: ["statsCategories"] });
        queryClient.invalidateQueries({ queryKey: ["statsHistory"] });
        queryClient.invalidateQueries({ queryKey: ["categoryHistory"] });
        queryClient.invalidateQueries({ queryKey: ["dailySpending"] });
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      }),
      {
        loading: "Repeating transaction...",
        success: `Repeated: ${formatCurrency(lastTransaction.amount)} → ${lastTransaction.recipient}`,
        error: "Failed to repeat transaction",
      }
    );
  };
  const handleAddTransaction = (values: any) => {
    const payload = {
      user_id: 1,
      recipient: values.title,
      date: values.date ? values.date.toISOString().slice(0, 10) : undefined,
      amount: values.amount,
      category: values.category,
      type: values.type,
    };

    // Call the API to add the transaction
    toast.promise(
      api.post("/transactions/", payload).then(() => {
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({ queryKey: ["asset"] });
        queryClient.invalidateQueries({ queryKey: ["assets"] });
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        queryClient.invalidateQueries({ queryKey: ["statsCategories"] });
        queryClient.invalidateQueries({ queryKey: ["statsHistory"] });
        queryClient.invalidateQueries({ queryKey: ["categoryHistory"] });
        queryClient.invalidateQueries({ queryKey: ["dailySpending"] });
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        setIsOpen(false);
      }),
      {
        loading: "Adding transaction...",
        success: "Transaction added successfully",
        error: (err) => {
          if (err.response) {
            return err.response.data.message;
          }
          return "Error adding transaction";
        }
      }
    );
  };

  // Form validation schema

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: 0,
      date: new Date(),
      category: "Other",
      type: "income",
    },
  });

  // Watch title field and auto-suggest category via AI
  const titleValue = form.watch("title");

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!titleValue || titleValue.length < 3 || !isModelLoaded || !aiEnabled) {
      return;
    }

    // Skip if we already suggested for this exact title
    if (lastSuggestedRef.current === titleValue) return;

    debounceRef.current = setTimeout(async () => {
      // Guard against concurrent calls
      if (suggestingRef.current) return;
      suggestingRef.current = true;
      setIsSuggesting(true);

      try {
        const result = await suggestCategory(titleValue);
        lastSuggestedRef.current = titleValue;
        if (result) {
          form.setValue("category", result as any);
          toast(`✨ AI set category to ${result}`, { duration: 2000 });
        }
      } finally {
        suggestingRef.current = false;
        setIsSuggesting(false);
      }
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [titleValue, isModelLoaded, suggestCategory, form]);



  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between py-4 px-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold capitalize">{pageName === '/' ? 'Dashboard Overview' : pageName}</h1>
        <p className="text-muted-foreground">{pageName === '/' ? `Welcome back! Here's your financial summary` : null}</p>
      </div>

      <div className="flex items-center space-x-3">
        <div className="relative hidden md:flex items-center">
          <ModeToggle />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                {userInitial}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-0">
            {/* Header */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
                  {userInitial}
                </div>
                <div>
                  <p className="font-semibold text-sm">Hey, {userName}</p>
                  <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full ${healthBadge.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${healthBadge.dot}`} />
                    {healthBadge.label}
                  </span>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />

            {/* This Month Stats */}
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-4 py-1">This Month</DropdownMenuLabel>
            <div className="px-4 py-2 space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground"><TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> Income</span>
                <span className="font-medium text-emerald-400">{formatCurrency(income)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground"><TrendingDown className="h-3.5 w-3.5 text-rose-400" /> Expenses</span>
                <span className="font-medium text-rose-400">{formatCurrency(expense)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground"><Wallet className="h-3.5 w-3.5 text-blue-400" /> Savings</span>
                <span className="font-medium text-blue-400">{formatCurrency(savings)}</span>
              </div>
            </div>
            <DropdownMenuSeparator />

            {/* Quick Repeat */}
            {lastTransaction && (
              <DropdownMenuItem
                onClick={handleRepeatTransaction}
                className="px-4 py-2.5 cursor-pointer"
              >
                <Repeat className="h-4 w-4 mr-2" />
                <div className="flex flex-col">
                  <span className="text-sm">Repeat Last Transaction</span>
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(lastTransaction.amount)} → {lastTransaction.recipient}
                  </span>
                </div>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <Drawer open={isOpen} onOpenChange={setIsOpen} shouldScaleBackground={true}>
          <DrawerTrigger asChild>
            <Button variant="ghost" className="bg-primary">
              <Plus className="mr-1 h-4 w-4" />
              Add Transaction
            </Button>
          </DrawerTrigger>
          <DrawerContent className='items-center'>
            <DrawerHeader>
              <DrawerTitle className='text-center mb-7'>Add Transaction</DrawerTitle>
              <Separator className='mb-4' />

              <Card className="glass-card border-border/50 w-full mb-5 ">
                <CardContent className="pt-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddTransaction)} className="space-y-8 w-full grid grid-cols-4 gap-4">
                      <div className='col-span-2'>
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transaction Title</FormLabel>
                              <FormControl>
                                <input
                                  {...field}
                                  type="text"
                                  placeholder="Enter transaction title"
                                  className="input"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Separator className='my-4' />
                      </div>
                      <div className='col-span-2'>
                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transaction Amount</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">{currencySymbol}</span>
                                  <input
                                    {...field}
                                    type="number"
                                    placeholder="Enter the amount for the transaction."
                                    className="input pl-6" // add left padding to make space for the dollar sign
                                    value={field.value}
                                    onChange={e => field.onChange(e.target.valueAsNumber)}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Separator className='my-4' />
                      </div>
                      <div className='col-span-2'>
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Date of Transaction</FormLabel>
                              <Popover modal={true}>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="center" side='left'>
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Separator className='my-4' />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transaction Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a transaction type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="income">Income</SelectItem>
                                  <SelectItem value="expense">Expense</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <Separator className='my-4' />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transaction Category {isSuggesting && <span className="text-[10px] text-muted-foreground ml-1 animate-pulse">✨ AI thinking...</span>}</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value} >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a Category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent side='right'>
                                  <SelectItem value="Income">Income</SelectItem>
                                  <SelectItem value="Housing">Housing</SelectItem>
                                  <SelectItem value="Food">Food</SelectItem>
                                  <SelectItem value="Transportation">Transportation</SelectItem>
                                  <SelectItem value="Subscriptions">Subscriptions</SelectItem>
                                  <SelectItem value="Bills">Bills</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Separator className='my-4' />
                      </div>
                      <Button
                        type="submit"
                        className="col-start-2 col-span-2 bg-primary hover:bg-primary/80 text-white">
                        Add Transaction
                      </Button>
                    </form>

                  </Form>
                </CardContent>
              </Card>
            </DrawerHeader>
            <DrawerFooter>

            </DrawerFooter>
          </DrawerContent>
        </Drawer>

      </div>
    </div>
  );
};

export default DashboardHeader;