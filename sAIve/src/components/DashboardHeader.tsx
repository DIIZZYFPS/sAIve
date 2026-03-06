import { Button } from '@/components/ui/button';
import {
  Bell,
  Plus,
  CalendarIcon,
  Repeat,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
} from 'lucide-react';
import { toast } from 'sonner';
import { ModeToggle } from '@/components/ModeToggle';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
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
import { Switch } from "@/components/ui/switch"


import { Separator } from '@/components/ui/separator';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

import api from '@/lib/api';
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
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
  isRecurring: z.boolean(),
  interval: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
});

function DashboardHeader({ pageName }: { pageName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [chargedToDebtId, setChargedToDebtId] = useState<number | null>(null);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [addCardForm, setAddCardForm] = useState({ name: "", interest_rate: "", monthly_payment: "" });
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

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await api.get("/notifications/1");
      return response.data;
    },
  });

  // Fetch credit cards for the "Charged to" selector — distinct key so it
  // doesn't overwrite the Debts page's full ["debts"] cache.
  const { data: creditCardDebts = [] } = useQuery({
    queryKey: ["debts", "credit_card"],
    queryFn: async () => (await api.get("/debts/1?type=credit_card")).data,
    enabled: isOpen,
  });

  const createCardMutation = useMutation({
    mutationFn: (body: object) => api.post("/debts/1", body),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["debts", "credit_card"] });
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      // Auto-select the newly created card
      if (res.data?.id) setChargedToDebtId(res.data.id);
      setAddCardOpen(false);
      setAddCardForm({ name: "", interest_rate: "", monthly_payment: "" });
      toast.success("Credit card added");
    },
    onError: () => toast.error("Failed to add credit card"),
  });

  const markNotificationRead = useMutation({
    mutationFn: (id: number) => api.put(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  const markAllNotificationsRead = useMutation({
    mutationFn: (userId: number) => api.put(`/notifications/user/${userId}/read_all`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    }
  });

  const userName = userProfile?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();
  const asset = currentAsset?.asset;
  const income = asset?.TIncome ?? 0;
  const expense = asset?.TExpense ?? 0;
  const savings = asset?.TSavings ?? 0;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

  const unreadNotifications = notifications.filter((n: any) => !n.is_read);

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
    // Determine target endpoint and payload based on recurring toggle
    const endpoint = values.isRecurring ? "/recurring_transactions/" : "/transactions/";
    const payload: any = {
      user_id: 1,
      recipient: values.title,
      category: values.category,
      type: values.type,
      amount: values.amount,
    };

    if (values.isRecurring) {
      payload.interval = values.interval || "monthly";
      payload.start_date = values.date ? format(values.date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
    } else {
      payload.date = values.date ? format(values.date, 'yyyy-MM-dd') : undefined;
      // Attach credit card debt_id if this is a charge against a card
      if (chargedToDebtId !== null && values.type === "expense") {
        payload.debt_id = chargedToDebtId;
      }
    }

    console.log("PAYLOAD START DATE:", payload.start_date);

    // Call the API
    toast.promise(
      api.post(endpoint, payload).then(() => {
        queryClient.invalidateQueries(); // invalidate all to be safe, especially if recurring adds a new type
        setIsOpen(false);
        setChargedToDebtId(null);
        form.reset();
      }),
      {
        loading: values.isRecurring ? "Creating recurring template..." : "Adding transaction...",
        success: values.isRecurring ? "Subscription activated" : "Transaction added successfully",
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
      isRecurring: false,
      interval: "monthly",
    },
  });

  const isRecurring = form.watch("isRecurring");

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 rounded-xl overflow-hidden glass-card border-border/50">
            <div className="bg-muted/30 px-4 py-3 border-b border-border/30 flex justify-between items-center">
              <span className="font-semibold text-sm">Notifications</span>
              <div className="flex items-center gap-2">
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead.mutate(1)}
                    disabled={markAllNotificationsRead.isPending}
                    className="text-[10px] text-primary hover:underline font-medium transition-colors disabled:opacity-50"
                  >
                    Mark all as read
                  </button>
                )}
                {unreadNotifications.length > 0 && (
                  <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                    {unreadNotifications.length} New
                  </span>
                )}
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm flex flex-col items-center">
                  <Bell className="h-8 w-8 mb-2 opacity-20" />
                  No new notifications
                </div>
              ) : (
                notifications.map((notif: any) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 border-b border-border/20 last:border-b-0 cursor-default transition-colors ${notif.is_read ? 'opacity-60' : 'bg-primary/5 hover:bg-primary/10'}`}
                    onClick={() => {
                      if (!notif.is_read) {
                        markNotificationRead.mutate(notif.id);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className={`text-sm font-semibold ${notif.is_read ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                        {format(new Date(notif.date), "MMM d, h:mm a")}
                      </span>
                    </div>
                    <p className={`text-xs ${notif.is_read ? 'text-muted-foreground' : 'text-muted-foreground/90'}`}>
                      {notif.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

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

              <Card
                className="glass-card border-border/50 w-full mb-5 transition-all duration-500"
                style={{
                  boxShadow: form.watch("type") === "income"
                    ? "0 0 0 1px color-mix(in oklch, var(--income) 50%, transparent), 0 0 28px 6px color-mix(in oklch, var(--income) 20%, transparent)"
                    : "0 0 0 1px color-mix(in oklch, var(--expense) 50%, transparent), 0 0 28px 6px color-mix(in oklch, var(--expense) 20%, transparent)",
                }}
              >
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
                              <FormControl>
                                {/* Sliding pill toggle */}
                                <div
                                  role="group"
                                  aria-label="Transaction type"
                                  className="relative flex h-10 w-48 rounded-full bg-muted p-1 cursor-pointer select-none"
                                  onClick={() =>
                                    field.onChange(field.value === "income" ? "expense" : "income")
                                  }
                                >
                                  {/* Sliding indicator */}
                                  <span
                                    className="absolute top-1 h-8 rounded-full transition-all duration-300 ease-in-out"
                                    style={{
                                      width: "calc(50% - 4px)",
                                      left: field.value === "income" ? "4px" : "calc(50%)",
                                      backgroundColor: field.value === "income"
                                        ? "var(--income)"
                                        : "var(--expense)",
                                    }}
                                  />
                                  {/* Labels */}
                                  <span
                                    className={cn(
                                      "relative z-10 flex-1 flex items-center justify-center text-xs font-semibold transition-colors duration-300",
                                      field.value === "income" ? "text-white" : "text-muted-foreground"
                                    )}
                                  >
                                    ↑ Income
                                  </span>
                                  <span
                                    className={cn(
                                      "relative z-10 flex-1 flex items-center justify-center text-xs font-semibold transition-colors duration-300",
                                      field.value === "expense" ? "text-white" : "text-muted-foreground"
                                    )}
                                  >
                                    ↓ Expense
                                  </span>
                                </div>
                              </FormControl>
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

                      {/* CHARGED TO — always shown for non-recurring expenses */}
                      {form.watch("type") === "expense" && !form.watch("isRecurring") && (
                        <div className="col-span-2">
                          <div className="flex flex-col space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium leading-none">Charged to (optional)</label>
                              {/* Nested Drawer — always visible */}
                              <Drawer nested open={addCardOpen} onOpenChange={setAddCardOpen}>
                                <DrawerTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs text-pink-400 hover:text-pink-300 px-2 gap-1"
                                  >
                                    <CreditCard className="h-3 w-3" />
                                    + Add Card
                                  </Button>
                                </DrawerTrigger>
                                <DrawerContent className="items-center">
                                  <DrawerHeader className="text-center">
                                    <DrawerTitle>Add Credit Card</DrawerTitle>
                                    <DrawerDescription>Quick-add a card to track its balance.</DrawerDescription>
                                  </DrawerHeader>
                                  <div className="w-full max-w-md px-6 pb-4 space-y-4">
                                    <div className="space-y-1.5">
                                      <label className="text-sm font-medium">Card Name</label>
                                      <input
                                        className="input w-full"
                                        placeholder='e.g. "Chase Sapphire"'
                                        value={addCardForm.name}
                                        onChange={e => setAddCardForm(f => ({ ...f, name: e.target.value }))}
                                        autoFocus
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="space-y-1.5">
                                        <label className="text-sm font-medium">APR (%) <span className="text-muted-foreground text-xs">optional</span></label>
                                        <input
                                          className="input w-full"
                                          type="number" min="0" step="0.01"
                                          placeholder="23.99"
                                          value={addCardForm.interest_rate}
                                          onChange={e => setAddCardForm(f => ({ ...f, interest_rate: e.target.value }))}
                                        />
                                      </div>
                                      <div className="space-y-1.5">
                                        <label className="text-sm font-medium">Monthly Min ($) <span className="text-muted-foreground text-xs">optional</span></label>
                                        <input
                                          className="input w-full"
                                          type="number" min="0" step="0.01"
                                          placeholder="100"
                                          value={addCardForm.monthly_payment}
                                          onChange={e => setAddCardForm(f => ({ ...f, monthly_payment: e.target.value }))}
                                        />
                                      </div>
                                    </div>
                                    <DrawerFooter className="px-0 pt-2 flex-row justify-end gap-2">
                                      <Button type="button" variant="outline" onClick={() => setAddCardOpen(false)}>Cancel</Button>
                                      <Button
                                        type="button"
                                        disabled={!addCardForm.name.trim() || createCardMutation.isPending}
                                        onClick={() => createCardMutation.mutate({
                                          user_id: 1,
                                          name: addCardForm.name.trim(),
                                          type: "credit_card",
                                          balance: 0,
                                          total_amount: 0,
                                          interest_rate: parseFloat(addCardForm.interest_rate) || 0,
                                          monthly_payment: parseFloat(addCardForm.monthly_payment) || 0,
                                        })}
                                      >
                                        {createCardMutation.isPending ? "Saving…" : "Add Card"}
                                      </Button>
                                    </DrawerFooter>
                                  </div>
                                </DrawerContent>
                              </Drawer>
                            </div>

                            {creditCardDebts.length > 0 ? (
                              <Select
                                value={chargedToDebtId !== null ? String(chargedToDebtId) : "none"}
                                onValueChange={v => setChargedToDebtId(v === "none" ? null : Number(v))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Paying with cash/debit" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">
                                    <span className="text-muted-foreground">Cash / Debit</span>
                                  </SelectItem>
                                  {creditCardDebts.map((d: any) => (
                                    <SelectItem key={d.id} value={String(d.id)}>
                                      <span className="flex items-center gap-2">
                                        <CreditCard className="h-3.5 w-3.5 text-pink-400" />
                                        {d.name}
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <p className="text-xs text-muted-foreground py-1">No cards yet — use "+ Add Card" above.</p>
                            )}
                            {chargedToDebtId !== null && (
                              <p className="text-xs text-muted-foreground">This charge will increase your credit card balance.</p>
                            )}
                          </div>
                          <Separator className="my-4" />
                        </div>
                      )}

                      {/* RECURRING TOGGLE */}
                      <div className="col-span-2 flex flex-col space-y-4">
                        <FormField
                          control={form.control}
                          name="isRecurring"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background/50">
                              <div className="space-y-0.5">
                                <FormLabel>Make target recurring</FormLabel>
                                <p className="text-[10px] text-muted-foreground mr-4">
                                  Auto-add this transaction on the selected interval.
                                </p>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {isRecurring && (
                          <div className="animate-in fade-in slide-in-from-top-2">
                            <FormField
                              control={form.control}
                              name="interval"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Interval</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select interval" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="daily">Daily</SelectItem>
                                      <SelectItem value="weekly">Weekly</SelectItem>
                                      <SelectItem value="monthly">Monthly</SelectItem>
                                      <SelectItem value="yearly">Yearly</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
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