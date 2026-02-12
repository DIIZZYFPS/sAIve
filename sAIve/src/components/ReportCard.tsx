import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";

interface ReportCardProps {
    title: string;
    description: string;
    children: (expanded: boolean) => React.ReactNode;
}

export function ReportCard({ title, description, children }: ReportCardProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Card
                className="glass-card border-border/50 cursor-pointer transition-all hover:shadow-lg hover:border-primary/30 hover:scale-[1.01]"
                onClick={() => setOpen(true)}
            >
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">{title}</CardTitle>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                    <div className="pointer-events-none">
                        {children(false)}
                    </div>
                </CardContent>
            </Card>

            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent className="max-h-[85vh]">
                    <DrawerHeader>
                        <DrawerTitle>{title}</DrawerTitle>
                        <DrawerDescription>{description}</DrawerDescription>
                    </DrawerHeader>
                    <div className="px-6 pb-8 overflow-auto">
                        {children(true)}
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}
