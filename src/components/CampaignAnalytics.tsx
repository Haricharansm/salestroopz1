import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const data = [
  { name: 'Jan', engagement: 40, intent: 24 },
  { name: 'Feb', engagement: 30, intent: 13 },
  { name: 'Mar', engagement: 20, intent: 98 },
  { name: 'Apr', engagement: 27, intent: 39 },
  { name: 'May', engagement: 18, intent: 48 },
];

export const CampaignAnalytics = () => {
  return (
    <div className="p-6 bg-[#0D0D0F] border border-white/5 rounded-2xl shadow-xl space-y-6">
      <h2 className="text-2xl font-bold text-white">Campaign Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-white/5 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-slate-400 mb-4">Engagement Trends</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
              <Bar dataKey="engagement" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="h-64 bg-white/5 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-slate-400 mb-4">Intent Score</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
              <Line type="monotone" dataKey="intent" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
