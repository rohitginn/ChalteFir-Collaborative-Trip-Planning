import React, { useState, useEffect } from 'react';
import API from '../api/api.js';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import CreateTripModal from '../components/CreateTripModal';

const Dashboard = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const fetchTrips = async () => {
        try {
            const { data } = await API.get('/trips');
            setTrips(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                    Your Trips
                </h2>
                {trips.length > 0 && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 shadow-sm"
                    >
                        <Plus className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                        New Trip
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-pulse flex space-x-1 items-center">
                        <div className="w-2 h-2 bg-neutral-300 rounded-full"></div>
                        <div className="w-2 h-2 bg-neutral-300 rounded-full animation-delay-200"></div>
                        <div className="w-2 h-2 bg-neutral-300 rounded-full animation-delay-400"></div>
                    </div>
                </div>
            ) : trips.length === 0 ? (
                <div className="text-center rounded-2xl border border-dashed border-neutral-300 p-16 mt-4 flex flex-col items-center justify-center bg-white">
                    <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                        <Plus className="h-6 w-6 text-neutral-400" />
                    </div>
                    <h3 className="text-base font-semibold text-neutral-900">No trips planned</h3>
                    <p className="mt-1 text-sm text-neutral-500 max-w-sm">Start your adventure by creating a new collaborative trip plan.</p>
                    <div className="mt-6">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            type="button"
                            className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none transition-colors shadow-sm active:scale-[0.98]"
                        >
                            <Plus className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                            Create New Trip
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {trips.map((trip) => (
                        <Link key={trip._id} to={`/trip/${trip._id}`} className="group block p-6 bg-white rounded-2xl border border-neutral-200 space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                            <div className="flex justify-between items-start">
                                <h5 className="text-xl font-bold tracking-tight text-neutral-900 line-clamp-1">{trip.title}</h5>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                                    {trip.members.length} {trip.members.length === 1 ? 'member' : 'members'}
                                </span>
                            </div>
                            <div className="pt-2 border-t border-neutral-100 flex items-center text-sm text-neutral-500 font-medium">
                                <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                <span className="mx-2 text-neutral-300">-</span>
                                {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <CreateTripModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onTripCreated={fetchTrips} />
            )}
        </div>
    );
};

export default Dashboard;
