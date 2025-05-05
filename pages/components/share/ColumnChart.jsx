import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const ColumnChart = ({ roomData }) => {
  const transformedData = roomData.map((room) => ({
    type: room.RoomTypeName,
    sales: room.TotalPriceSum
  }));

  const colors = ['#FF5733', '#3357FF', '#F1C40F', '#8E44AD'];

  return (
    <div className="w-full h-96">
      <h3 className="text-center">Room Sales by Type</h3> 
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={transformedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="type"
            label={{
              position: 'bottom'
            }}
          />
          <YAxis
            label={{
              angle: -90,
              position: 'insideLeft'
            }}
          />
          <Tooltip />
          <Bar
            dataKey="sales"
            label={{
              position: 'top',
              fontSize: 12,
              fontWeight: 400
            }}
          >
            {transformedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ColumnChart;
