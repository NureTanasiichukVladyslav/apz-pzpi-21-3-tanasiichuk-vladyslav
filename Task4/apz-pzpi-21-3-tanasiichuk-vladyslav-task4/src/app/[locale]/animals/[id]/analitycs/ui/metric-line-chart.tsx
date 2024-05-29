"use client";
import { formatMetricDate } from "@/utils/format-metric-date";
import { Stack, Typography, Box } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Dot,
  ReferenceLine,
} from "recharts";

interface MetricData {
  time: number;
  timestamp: string;
  value: number;
}

interface Props {
  label: string;
  data: MetricData[];
  criticalMin: number;
  criticalMax: number;
}

const CustomDot = (props: any) => {
  const { cx, cy, value, criticalMin, criticalMax } = props;
  if (value < criticalMin || value > criticalMax) {
    return <Dot cx={cx} cy={cy} r={5} fill="red" stroke="none" />;
  }
  return <Dot {...props} />;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box bgcolor="white" border="1px solid #ccc" p={1}>
        <Typography variant="body2">{`Time: ${formatMetricDate(
          payload[0].payload.timestamp
        )}`}</Typography>
        <Typography variant="body2">{`Value: ${payload[0].value}`}</Typography>
      </Box>
    );
  }
  return null;
};

export const MetricLineChart = ({
  label,
  data,
  criticalMin,
  criticalMax,
}: Props) => {
  return (
    <Stack gap={2}>
      <Typography variant="h5">{label}</Typography>
      <Box width="100%" height={300}>
        <LineChart width={400} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            dot={
              <CustomDot criticalMin={criticalMin} criticalMax={criticalMax} />
            }
          />
          <ReferenceLine
            y={criticalMax}
            label="Max"
            stroke="red"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            y={criticalMin}
            label="Min"
            stroke="red"
            strokeDasharray="3 3"
          />
        </LineChart>
      </Box>
    </Stack>
  );
};
