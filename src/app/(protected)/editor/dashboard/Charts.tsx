'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const pieData = [
  { name: 'Under Review', value: 8, color: '#FACC15' },
  { name: 'Accepted', value: 5, color: '#22C55E' },
  { name: 'Rejected', value: 3, color: '#EF4444' },
  { name: 'Revisions Required', value: 4, color: '#FB923C' },
];

const barData = [
  { month: 'Jan', submissions: 10 },
  { month: 'Feb', submissions: 15 },
  { month: 'Mar', submissions: 8 },
  { month: 'Apr', submissions: 12 },
];

const lineData = [
  { month: 'Jan', views: 1000, downloads: 200 },
  { month: 'Feb', views: 1200, downloads: 300 },
  { month: 'Mar', views: 900, downloads: 150 },
  { month: 'Apr', views: 1300, downloads: 400 },
];

export default function ChartSection() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Submission Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart width={300} height={250}>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions Per Month</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart width={300} height={250} data={barData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="submissions" fill="#3B82F6" />
          </BarChart>
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Views & Downloads Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart width={300} height={250} data={lineData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#6366F1"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="downloads"
              stroke="#EC4899"
              strokeWidth={2}
            />
          </LineChart>
        </CardContent>
      </Card>
    </div>
  );
}
