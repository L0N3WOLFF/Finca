
import React from 'react';

interface ChartData {
  name: string;
  value: number;
}

interface SimpleBarChartProps {
  data: ChartData[];
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero
  const barWidth = 60;
  const barMargin = 40;
  const chartWidth = data.length * (barWidth + barMargin);

  return (
    <div className="w-full h-full overflow-x-auto overflow-y-hidden p-4">
        <svg width={chartWidth} height="100%" viewBox={`0 0 ${chartWidth} 220`} preserveAspectRatio="xMinYMax meet">
            {/* X-Axis Line */}
            <line x1="0" y1="200" x2={chartWidth} y2="200" stroke="#475569" strokeWidth="2" />

            {data.map((item, index) => {
                const barHeight = (item.value / maxValue) * 180; // Max height of 180px
                const x = index * (barWidth + barMargin) + barMargin / 2;
                const y = 200 - barHeight;

                return (
                    <g key={item.name}>
                        <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            fill="#10b981"
                            rx="4"
                            ry="4"
                            className="transition-all duration-300"
                        />
                        {/* Value Label on top of the bar */}
                        <text
                            x={x + barWidth / 2}
                            y={y - 8}
                            textAnchor="middle"
                            fill="#f1f5f9"
                            fontSize="16"
                            fontWeight="bold"
                        >
                            {item.value}
                        </text>
                        {/* Name Label below the bar */}
                        <text
                            x={x + barWidth / 2}
                            y="218"
                            textAnchor="middle"
                            fill="#94a3b8"
                            fontSize="14"
                        >
                            {item.name}
                        </text>
                    </g>
                );
            })}
        </svg>
    </div>
  );
};
