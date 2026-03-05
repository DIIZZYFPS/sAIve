import { X, BarChart3, TrendingUp, Table2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAi } from '@/context/AiContext';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { useSettings } from '@/context/SettingsContext';

const CHART_COLORS = [
    'hsl(var(--primary))',
    '#34d399',
    '#f59e0b',
    '#f87171',
    '#60a5fa',
    '#a78bfa',
    '#fb923c',
];

function ChartRenderer({ payload }: { payload: any }) {
    const { formatCurrency } = useSettings();

    const tooltipFormatter = (value: number) => [formatCurrency(value), ''];

    if (payload.chartType === 'pie') {
        return (
            <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                    <Pie
                        data={payload.data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                    >
                        {payload.data.map((_: any, i: number) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={tooltipFormatter} />
                </PieChart>
            </ResponsiveContainer>
        );
    }

    if (payload.chartType === 'line') {
        return (
            <ResponsiveContainer width="100%" height={260}>
                <LineChart data={payload.data}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                    <XAxis dataKey="name" className="text-xs fill-muted-foreground" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => formatCurrency(v)} className="text-xs fill-muted-foreground" tick={{ fontSize: 11 }} />
                    <Tooltip formatter={tooltipFormatter} />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
            </ResponsiveContainer>
        );
    }

    // Default: bar chart
    return (
        <ResponsiveContainer width="100%" height={260}>
            <BarChart data={payload.data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis dataKey="name" className="text-xs fill-muted-foreground" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => formatCurrency(v)} className="text-xs fill-muted-foreground" tick={{ fontSize: 11 }} />
                <Tooltip formatter={tooltipFormatter} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {payload.data.map((_: any, i: number) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

function TableRenderer({ payload }: { payload: any }) {
    const { formatCurrency } = useSettings();
    if (!payload.data || payload.data.length === 0) return <p className="text-muted-foreground text-sm p-4">No data</p>;

    const headers = Object.keys(payload.data[0]);

    return (
        <div className="overflow-auto max-h-[260px]">
            <table className="w-full text-xs">
                <thead>
                    <tr className="border-b border-border/40">
                        {headers.map((h) => (
                            <th key={h} className="text-left py-2 px-3 text-muted-foreground font-medium capitalize">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {payload.data.map((row: any, i: number) => (
                        <tr key={i} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                            {headers.map((h) => (
                                <td key={h} className="py-2 px-3">
                                    {typeof row[h] === 'number' ? formatCurrency(row[h]) : String(row[h])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const TYPE_ICONS: Record<string, React.ComponentType<any>> = {
    chart: BarChart3,
    line: TrendingUp,
    table: Table2,
    breakdown: BarChart3,
};

export function SimulationPanel() {
    const { activeSimulation, setActiveSimulation } = useAi();

    return (
        <div
            className={`
                overflow-hidden border-t border-border/40
                transition-all duration-500 ease-in-out
                ${activeSimulation ? 'h-[340px] opacity-100' : 'h-0 opacity-0'}
            `}
        >
            {activeSimulation && (
                <div className="h-full flex flex-col bg-background/60 backdrop-blur-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 bg-muted/20">
                        <div className="flex items-center gap-2">
                            {(() => {
                                const Icon = TYPE_ICONS[activeSimulation.chartType ?? activeSimulation.type] ?? BarChart3;
                                return <Icon className="h-4 w-4 text-primary" />;
                            })()}
                            <span className="text-sm font-semibold">{activeSimulation.title}</span>
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium uppercase tracking-wide">
                                Simulation
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={() => setActiveSimulation(null)}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden px-4 py-3">
                        {activeSimulation.type === 'table' ? (
                            <TableRenderer payload={activeSimulation} />
                        ) : (
                            <ChartRenderer payload={activeSimulation} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
