import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Campaign, Prospect } from '../types';

export const CampaignAnalytics = ({ campaigns, prospects }: { campaigns: Campaign[], prospects: Prospect[] }) => {
  const metrics = useMemo(() => {
    let sent = 0;
    let pending = 0;
    
    campaigns.forEach(c => {
      c.steps.forEach(s => {
        if (s.status === 'sent') sent++;
        else pending++;
      });
    });

    const replies = prospects.reduce((acc, p) => acc + (p.replies?.length || 0), 0);
    
    return { sent, pending, replies };
  }, [campaigns, prospects]);

  const data = [
    { name: 'Sent', value: metrics.sent },
    { name: 'Pending', value: metrics.pending },
    { name: 'Replies', value: metrics.replies },
  ];

  return (
    <div className="p-6 bg-[#0D0D0F] border border-white/5 rounded-2xl shadow-xl space-y-6">
      <h2 className="text-2xl font-bold text-white">Live Campaign Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 p-4 rounded-lg">
             <h3 className="text-sm font-medium text-slate-400">Total Sent</h3>
             <p className="text-3xl font-bold text-white">{metrics.sent}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
             <h3 className="text-sm font-medium text-slate-400">Total Pending</h3>
             <p className="text-3xl font-bold text-white">{metrics.pending}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
             <h3 className="text-sm font-medium text-slate-400">Total Replies</h3>
             <p className="text-3xl font-bold text-white">{metrics.replies}</p>
          </div>
      </div>

      <div className="h-64 bg-white/5 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-slate-400 mb-4">Performance Overview</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
            <Bar dataKey="value" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
