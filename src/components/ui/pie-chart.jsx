import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import { Check } from "lucide-react";

const size = {
  width: 400,
  height: 200,
};

const StyledText = styled("text")(({ theme }) => ({
  fill: "gray",
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 15,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

const PieChartWithCenterLabel = ({ data, innerRadius, centreLabel }) => {
  return (
    <PieChart series={[{ data, innerRadius }]} {...size}>
      <PieCenterLabel>{centreLabel} </PieCenterLabel>
    </PieChart>
  );
};

export default PieChartWithCenterLabel;
