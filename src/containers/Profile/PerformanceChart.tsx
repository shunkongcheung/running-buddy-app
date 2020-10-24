import React, { memo } from "react";
import { Container } from "reactstrap";
import { Radar } from "react-chartjs-2";

interface PerformanceChartProps {}

const data = {
  labels: ["Sprinting", "Walking", "Resting", "Average Speed"],
  datasets: [
    {
      label: "Your Performance Chart",
      backgroundColor: "rgba(255, 225, 230, 0.3)",
      borderColor: "#ff6384",
      pointBackgroundColor: "#ff6384",
      data: Array.from({ length: 4 }).map(() => Math.random() * 100),
    },
  ],
};

const PerformanceChart: React.FC<PerformanceChartProps> = () => {
  return (
    <Container>
      <Radar data={data} />
    </Container>
  );
};

export default memo(PerformanceChart);
