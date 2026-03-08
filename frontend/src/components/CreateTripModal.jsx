import React, { useState } from 'react';
import API from '../api/api.js';
import { X, Mail, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const CreateTripModal = ({ isOpen, onClose, onTripCreated }) => {
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleAddEmail = (e) => {
        e.preventDefault();
        if (emailInput && !emails.includes(emailInput)) {
            setEmails([...emails, emailInput]);
            setEmailInput('');
        }
    };

    const handleRemoveEmail = (emailToRemove) => {
        setEmails(emails.filter((e) => e !== emailToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post(
                '/trips',
                { title, startDate, endDate, invitedEmails: emails }
            );

            onTripCreated();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to create trip');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-neutral-100"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-neutral-100">
                            <h3 className="text-xl font-bold tracking-tight text-neutral-900">Plan a New Trip</h3>
                            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 transition-colors p-1 rounded-full hover:bg-neutral-100">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-900 mb-1.5">Trip Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="appearance-none block w-full px-3 py-2.5 border border-neutral-200 placeholder-neutral-400 text-neutral-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 sm:text-sm transition-shadow"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="E.g. Summer Vacation 2026"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-900 mb-1.5">From</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Calendar className="h-4 w-4 text-neutral-400" />
                                            </div>
                                            <DatePicker
                                                selected={startDate ? new Date(startDate) : null}
                                                onChange={(date) => setStartDate(date ? date.toISOString() : '')}
                                                selectsStart
                                                startDate={startDate ? new Date(startDate) : null}
                                                endDate={endDate ? new Date(endDate) : null}
                                                dateFormat="MMM d, yyyy"
                                                className="appearance-none block w-full pl-9 pr-3 py-2.5 border border-neutral-200 text-neutral-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 sm:text-sm transition-shadow shadow-sm"
                                                placeholderText="Select start date"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-900 mb-1.5">To</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Calendar className="h-4 w-4 text-neutral-400" />
                                            </div>
                                            <DatePicker
                                                selected={endDate ? new Date(endDate) : null}
                                                onChange={(date) => setEndDate(date ? date.toISOString() : '')}
                                                selectsEnd
                                                startDate={startDate ? new Date(startDate) : null}
                                                endDate={endDate ? new Date(endDate) : null}
                                                minDate={startDate ? new Date(startDate) : null}
                                                dateFormat="MMM d, yyyy"
                                                className="appearance-none block w-full pl-9 pr-3 py-2.5 border border-neutral-200 text-neutral-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 sm:text-sm transition-shadow shadow-sm"
                                                placeholderText="Select end date"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-900 mb-1.5">Invite Members via Email</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-grow">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-4 w-4 text-neutral-400" />
                                            </div>
                                            <input
                                                type="email"
                                                className="appearance-none block w-full pl-9 pr-3 py-2 border border-neutral-200 placeholder-neutral-400 text-neutral-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 sm:text-sm transition-shadow shadow-sm"
                                                placeholder="friend@email.com"
                                                value={emailInput}
                                                onChange={(e) => setEmailInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddEmail(e);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddEmail}
                                            className="px-4 py-2 bg-white text-neutral-700 font-semibold text-sm rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors shadow-sm"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    {emails.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2 p-3 bg-neutral-50/50 rounded-lg border border-neutral-100">
                                            {emails.map((email, idx) => (
                                                <span key={idx} className="inline-flex items-center pl-2.5 pr-1 py-1 rounded-md text-xs font-semibold bg-white text-neutral-700 border border-neutral-200 shadow-sm">
                                                    <span className="truncate max-w-[150px]">{email}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveEmail(email)}
                                                        className="ml-1.5 flex-shrink-0 h-4 w-4 rounded inline-flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 flex justify-end gap-3 border-t border-neutral-100 pt-5">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-5 py-2.5 bg-white border border-neutral-200 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-colors shadow-sm text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-5 py-2.5 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm text-sm active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                                    >
                                        {loading ? 'Creating...' : 'Create Trip'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CreateTripModal;
