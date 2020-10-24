import React, { memo } from "react";
import { Container } from "reactstrap";
import { Bar } from "react-chartjs-2";

interface CalaroriesChartProps {}

const DATA_POINT_COUNTS = 15;

const data = {
  labels: Array.from({ length: DATA_POINT_COUNTS }).map((_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() - DATA_POINT_COUNTS + idx);
    return date.toLocaleDateString();
  }),
  datasets: [
    {
      label: "Calarories",
      backgroundColor: "rgba(1, 175, 223, 1)",
      borderColor: "rgba(35, 156, 190, 1)",
      data: Array.from({ length: DATA_POINT_COUNTS }).map(
        () => Math.random() * 100
      ),
    },
  ],
};

const CalaroriesChart: React.FC<CalaroriesChartProps> = () => {
  return (
    <Container>
      <h3>Carlories Summary </h3>
      <Bar data={data} />
    </Container>
  );
};

export default memo(CalaroriesChart);
