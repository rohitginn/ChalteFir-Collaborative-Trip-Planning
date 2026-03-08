import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/api.js';
import { format, addDays, differenceInDays } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityCard from '../components/ActivityCard';
import ExpenseTracker from '../components/ExpenseTracker';
import ManageMembersModal from '../components/ManageMembersModal';

const TripPlanner = () => {
    const { id } = useParams();
    const [trip, setTrip] = useState(null);
    const [activities, setActivities] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showExpenseTracker, setShowExpenseTracker] = useState(false);
    const [error, setError] = useState(null);
    const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const fetchTripData = async () => {
        try {
            const { data } = await API.get(`/trips/${id}`);
            setTrip(data);
            if (!selectedDate) {
                setSelectedDate(new Date(data.startDate));
            }
        } catch (err) {
            setError('Failed to load trip details');
        }
    };

    const fetchActivities = async (date) => {
        if (!date) return;
        try {
            const dateString = date.toISOString().split('T')[0];
            const { data } = await API.get(`/activities/trip/${id}?date=${dateString}`);
            setActivities(data);
        } catch (err) {
            console.error('Failed to load activities', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTripData();
    }, [id]);

    useEffect(() => {
        if (selectedDate) {
            fetchActivities(selectedDate);
        }
    }, [selectedDate, id]);

    const handleAddActivity = async () => {
        try {
            const newActivity = {
                tripId: id,
                date: selectedDate,
                place: 'New Place',
                timing: '10:00 AM',
                budget: { amount: 0, category: 'other' }
            };
            await API.post('/activities', newActivity);
            fetchActivities(selectedDate);
        } catch (err) {
            alert('You do not have permission to add activities');
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        if (result.destination.index === result.source.index) return;

        const items = Array.from(activities);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update local state first
        setActivities(items);

        // Update order on backend
        try {
            await Promise.all(items.map((item, index) =>
                API.put(`/activities/${item._id}`, { order: index })
            ));
        } catch (error) {
            console.error('Failed to save order');
        }
    };

    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!trip || loading) return <div className="p-4">Loading trip details...</div>;

    const tripDays = differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;
    const dates = Array.from({ length: tripDays }).map((_, i) => addDays(new Date(trip.startDate), i));

    // Determine role
    const currentUserRole = trip.members.find(m => m.user._id === userInfo._id)?.role || 'Viewer';
    const canEdit = currentUserRole === 'Owner' || currentUserRole === 'Editor';

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/60 overflow-hidden mt-6 mx-4 sm:mx-6 lg:mx-8 max-w-7xl xl:mx-auto">
            {/* Trip Header */}
            <div className="px-8 py-6 border-b border-neutral-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-neutral-50/50">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-neutral-900">{trip.title}</h2>
                    <p className="text-sm font-medium text-neutral-500 mt-1.5 flex items-center">
                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {format(new Date(trip.startDate), 'MMM d, yyyy')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 items-center mt-3 sm:mt-0">
                    <div className="flex -space-x-2 mr-2">
                        {trip.members.slice(0, 3).map((m, i) => (
                            <div key={i} className="h-7 w-7 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-xs font-bold text-neutral-600 shadow-sm" title={m.user?.email || 'User'}>
                                {(m.user?.name || m.user?.email || '?').charAt(0).toUpperCase()}
                            </div>
                        ))}
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-900 text-white shadow-sm">
                        Role: {currentUserRole}
                    </span>
                    {currentUserRole === 'Owner' && (
                        <button
                            onClick={() => setIsManageMembersOpen(true)}
                            className="text-sm font-semibold text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 px-3 py-1.5 rounded-lg transition-colors shadow-sm active:scale-[0.98]"
                        >
                            Members
                        </button>
                    )}
                    <button
                        onClick={() => setShowExpenseTracker(!showExpenseTracker)}
                        className="text-sm font-semibold text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 px-4 py-2 rounded-lg transition-colors shadow-sm active:scale-[0.98]"
                    >
                        {showExpenseTracker ? 'Back to Itinerary' : 'View Expenses'}
                    </button>
                </div>
            </div>

            {!showExpenseTracker ? (
                <div className="p-8">
                    {/* Day Tabs */}
                    <div className="flex overflow-x-auto mb-8 space-x-2 pb-2 scrollbar-hide">
                        {dates.map((date, idx) => {
                            const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedDate(date)}
                                    className={`relative py-2.5 px-5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${isSelected
                                        ? 'text-white'
                                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                                        }`}
                                >
                                    {isSelected && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute inset-0 bg-neutral-900 rounded-full"
                                            style={{ zIndex: 0 }}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">
                                        Day {idx + 1} <span className="opacity-70 font-normal ml-1 border-l border-current pl-2">{format(date, 'MMM d')}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Activities List */}
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="activities-list">
                            {(provided) => (
                                <div
                                    className="space-y-4"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {activities.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="text-neutral-400 text-center py-12 flex flex-col items-center border border-dashed border-neutral-200 rounded-xl"
                                        >
                                            <p className="text-sm font-medium">No activities planned yet.</p>
                                        </motion.div>
                                    ) : (
                                        activities.map((activity, index) => (
                                            <Draggable key={activity._id} draggableId={activity._id} index={index} isDragDisabled={!canEdit}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={provided.draggableProps.style}
                                                        className={snapshot.isDragging ? "opacity-90 scale-[1.02] shadow-2xl transition-transform z-50 rounded-xl" : ""}
                                                    >
                                                        <ActivityCard
                                                            activity={activity}
                                                            canEdit={canEdit}
                                                            onUpdate={() => fetchActivities(selectedDate)}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))
                                    )}
                                    {provided.placeholder}

                                    {canEdit && (
                                        <button
                                            onClick={handleAddActivity}
                                            className="w-full mt-6 py-3.5 border border-dashed border-neutral-300 rounded-xl text-sm font-semibold text-neutral-500 hover:border-neutral-800 hover:text-neutral-900 transition-colors bg-neutral-50/50 hover:bg-neutral-50 active:scale-[0.99]"
                                        >
                                            + Add New Activity
                                        </button>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            ) : (
                <ExpenseTracker tripId={id} />
            )}

            {trip && (
                <ManageMembersModal
                    isOpen={isManageMembersOpen}
                    onClose={() => setIsManageMembersOpen(false)}
                    trip={trip}
                    onUpdate={fetchTripData}
                />
            )}
        </div>
    );
};

export default TripPlanner;
