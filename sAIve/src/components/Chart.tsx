import { useLayoutEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5flow from "@amcharts/amcharts5/flow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import am5themes_Frozen from "@amcharts/amcharts5/themes/Frozen";
import { useTheme } from "@/components/ThemeProvider"



function Chart() {
  const { theme } = useTheme();

  // Creates the chart, this code only runs one time
  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv");

    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root),
      theme === "dark" ? am5themes_Dark.new(root) : am5themes_Frozen.new(root)
    ]);

    // Create a series
    let series = root.container.children.push(
      am5flow.Sankey.new(root, {
        sourceIdField: "from",
        targetIdField: "to",
        valueField: "value",
        
        nodeWidth: 5
      })
    );

    series.nodes.rectangles.template.set("templateField", "nodeSettings");
    series.links.template.set("templateField", "linkSettings");

    // Create a data set
    series.nodes.setAll({
      idField: "id",
      nameField: "name",
    })

    series.nodes.data.setAll([
  { id: "A", name: "Node A", fill: am5.color(0xFF621F) },
  { id: "B", name: "Node B", fill: am5.color(0x297373) },
  { id: "C", name: "Node C", fill: am5.color(0xFF621F) },
  { id: "D", name: "Node D", fill: am5.color(0x946B49) },
  { id: "E", name: "Node E", fill: am5.color(0x297373) },
  { id: "G", name: "Node G", fill: am5.color(0xFF621F) },
  { id: "H", name: "Node H", fill: am5.color(0x297373) },
  { id: "I", name: "Node I", fill: am5.color(0x946B49) },
  { id: "J", name: "Node J", fill: am5.color(0x297373) }
])

// Set data
// https://www.amcharts.com/docs/v5/charts/flow-charts/#Setting_data
series.data.setAll([
  { from: "A", to: "D", value: 10 },
  { from: "B", to: "D", value: 8 },
  { from: "B", to: "E", value: 4 },
  { from: "C", to: "E", value: 3 },
  { from: "D", to: "G", value: 5 },
  { from: "D", to: "I", value: 2 },
  { from: "D", to: "H", value: 3 },
  { from: "E", to: "H", value: 6},
  { from: "G", to: "J", value: 5 },
  { from: "I", to: "J", value: 1 },
  { from: "H", to: "J", value: 9 }
]);

    

    return () => {
      root.dispose();
    };
  }, []);


  return (
    <div id="chartdiv" style={{ width: "100%", height: "100%" }}></div>
  );
}
export default Chart;