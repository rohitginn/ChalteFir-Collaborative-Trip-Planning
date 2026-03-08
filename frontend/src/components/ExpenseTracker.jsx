import React, { useState, useEffect } from 'react';
import API from '../api/api.js';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ExpenseTracker = ({ tripId }) => {
    const [expenses, setExpenses] = useState([]);
    const [total, setTotal] = useState(0);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        const fetchAllActivities = async () => {
            try {
                const { data } = await API.get(`/activities/trip/${tripId}`);

                let aggregated = { travelling: 0, food: 0, stay: 0, activities: 0, other: 0 };
                let sum = 0;

                data.forEach(activity => {
                    if (activity.budget && activity.budget.amount > 0) {
                        aggregated[activity.budget.category] += activity.budget.amount;
                        sum += activity.budget.amount;
                    }
                });

                const formattedData = Object.keys(aggregated)
                    .filter(key => aggregated[key] > 0)
                    .map(key => ({
                        name: key.charAt(0).toUpperCase() + key.slice(1),
                        value: aggregated[key]
                    }));

                setExpenses(formattedData);
                setTotal(sum);
            } catch (err) {
                console.error(err);
            }
        };

        fetchAllActivities();
    }, [tripId]);

    // Curated slate/indigo palette for a premium minimal feel
    const COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8'];

    return (
        <div className="p-8 bg-neutral-50/30">
            <h3 className="text-2xl font-bold tracking-tight mb-8 text-neutral-900 text-center">Trip Expense Breakdown</h3>

            {total === 0 ? (
                <div className="text-center py-16 flex flex-col items-center">
                    <p className="text-sm font-semibold text-neutral-400">No expenses tracked yet.</p>
                    <p className="text-xs font-medium text-neutral-400 mt-1">Add budgets to your itinerary activities to see the breakdown.</p>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-5xl mx-auto">

                    <div className="w-full max-w-sm h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenses}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    fill="#8884d8"
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {expenses.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => `$${value}`}
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #f5f5f5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', fontWeight: 500, color: '#171717' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-neutral-200/60 shadow-sm">
                        <h4 className="text-lg font-bold tracking-tight border-b border-neutral-100 pb-3 mb-5 text-neutral-900">Expense Summary</h4>
                        <div className="space-y-4">
                            {expenses.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center">
                                        <span className="w-2.5 h-2.5 rounded-full mr-3 shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                        <span className="font-semibold text-neutral-600 capitalize">{item.name}</span>
                                    </div>
                                    <span className="font-bold tabular-nums text-neutral-900">${item.value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-5 border-t border-neutral-100 flex justify-between items-center">
                            <span className="font-bold text-neutral-400 tracking-wider uppercase text-xs">Total Spent</span>
                            <span className="text-2xl font-black tracking-tight text-neutral-900 tabular-nums">${total.toLocaleString()}</span>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default ExpenseTracker;
