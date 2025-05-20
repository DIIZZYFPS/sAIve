import { Button } from '@/components/ui/button';
import { 
  Bell,
  User,
  Plus,
  CalendarIcon
} from 'lucide-react';
import { toast } from 'sonner';
import {ModeToggle} from '@/components/ModeToggle';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
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

import { useState } from 'react';
import { cn } from '@/lib/utils';


  const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    amount: z.number().min(0, "Amount must be a positive number"),
    date: z.date(),
    type: z.enum(["income", "expense"], {
      errorMap: () => ({ message: "Type is required" }),
    }),
  });

const DashboardHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddTransaction = () => {
    setIsOpen(false);
    toast("Feature coming soon", {
      description: "Add transaction functionality will be available soon."
    });
  };

  // Form validation schema

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: 0,
      type: "income",
    },
  });

  

  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between py-4 px-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold capitalize">{location.pathname === '/' ? 'Dashboard Overview' : location.pathname.slice(1)}</h1>
        <p className="text-muted-foreground">{location.pathname === '/' ? `Welcome back! Here's your financial summary` : null}</p>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="relative hidden md:flex items-center">
          <ModeToggle/>
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </Button>
        
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
        <Drawer open={isOpen} onOpenChange={setIsOpen} shouldScaleBackground={true} >
          <DrawerTrigger >
            <Button variant="ghost" className="bg-primary">
              <Plus className="mr-1 h-4 w-4" />
              Add Transaction
            </Button>
          </DrawerTrigger>
          <DrawerContent className='items-center'>
            <DrawerHeader>
              <DrawerTitle className='text-center'>Add Transaction</DrawerTitle>

              <Card className="glass-card border-border/50 w-full">
                <CardContent className="pt-4">
                <Form {... form}>
                   <form onSubmit={form.handleSubmit(handleAddTransaction)} className="space-y-8 w-full grid grid-cols-2 gap-4">
                    <div>
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
                      <Separator className='my-4'/>
                      </div>
                      <div>
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transaction Amount</FormLabel>
                            <FormControl>
                              <input
                                {...field}
                                type="number"
                                placeholder="Enter the amount for the transaction."
                                className="input"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Separator className='my-4'/>
                      </div>
                        <div>
                          <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel>Date of birth</FormLabel>
                                    <Popover>
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
                                      <PopoverContent className="w-auto p-0" align="start">
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
                              <Separator className='my-4'/>
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
                          <Separator className='my-4'/>
                        </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            </DrawerHeader>
            <DrawerFooter>
              <Button type="submit" onClick={handleAddTransaction}>Add Transaction</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

      </div>
    </div>
  );
};

export default DashboardHeader;