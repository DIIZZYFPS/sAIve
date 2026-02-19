import { useLayoutEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5flow from "@amcharts/amcharts5/flow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import am5themes_Frozen from "@amcharts/amcharts5/themes/Frozen";
import { useTheme } from "@/components/ThemeProvider"
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface SankeyNode {
  id: string;
  name: string;
  fill: string; // hex string from backend
}

interface SankeyLink {
  from: string;
  to: string;
  value: number;
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

interface ChartProps {
  month: number;
  year: number;
}

function Chart({ month, year }: ChartProps) {
  const { mode } = useTheme();
  const isDark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const { data: sankeyData, isLoading } = useQuery<SankeyData>({
    queryKey: ['sankeyData', month, year],
    queryFn: async () => {
      const response = await api.get(`/stats/sankey/1?month=${month}&year=${year}`);
      return response.data;
    }
  });

  useLayoutEffect(() => {
    if (isLoading || !sankeyData || sankeyData.nodes.length === 0) return;

    let root = am5.Root.new("chartdiv");

    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root),
      isDark ? am5themes_Dark.new(root) : am5themes_Frozen.new(root)
    ]);

    // Add padding so labels aren't clipped at edges
    root.container.setAll({
      paddingLeft: 20,
      paddingRight: 150,
      paddingTop: 10,
      paddingBottom: 10,
    });

    // Create a Sankey series
    let series = root.container.children.push(
      am5flow.Sankey.new(root, {
        sourceIdField: "from",
        targetIdField: "to",
        valueField: "value",
        nodeWidth: 10,
        nodePadding: 20,
      })
    );

    // --- Node Configuration ---
    series.nodes.setAll({
      idField: "id",
      nameField: "name",
    });

    // Convert hex strings to am5.color objects and set as node data
    const coloredNodes = sankeyData.nodes.map(node => ({
      id: node.id,
      name: node.name,
      nodeSettings: {
        fill: am5.color(node.fill),
      }
    }));

    // Apply fill from nodeSettings template field
    series.nodes.rectangles.template.set("templateField", "nodeSettings");

    // Configure node labels
    series.nodes.labels.template.setAll({
      fill: isDark ? am5.color(0xffffff) : am5.color(0x000000),
      fontSize: 14,
      fontWeight: "500",
      paddingLeft: 10,
      text: "{name}",
    });

    // --- Link Configuration ---
    // Color links based on source node color
    series.links.template.setAll({
      fillOpacity: 0.4,
      strokeOpacity: 0,
      tooltipText: "{sourceId} → {targetId}: ${value}",
    });

    // Make links inherit source node color
    series.links.template.adapters.add("fill", function (_fill, target) {
      const source = target.dataItem?.get("source" as any);
      if (source) {
        return source.get("fill" as any);
      }
      return _fill;
    });

    // --- Set Data ---
    series.nodes.data.setAll(coloredNodes);
    series.data.setAll(sankeyData.links);

    return () => {
      root.dispose();
    };
  }, [sankeyData, isLoading, mode]);


  if (isLoading) {
    return <div className="flex items-center justify-center h-[75vh]">Loading Chart...</div>
  }

  if (!sankeyData || sankeyData.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-[75vh] text-muted-foreground">
        No financial data for this month yet. Add some transactions to see your flow!
      </div>
    );
  }

  return (
    <div id="chartdiv" style={{ width: "100%", height: "75vh" }}></div>
  );
}
export default Chart;
