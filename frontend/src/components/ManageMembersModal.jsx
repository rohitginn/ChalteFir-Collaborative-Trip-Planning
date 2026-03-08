import React, { useState } from 'react';
import API from '../api/api.js';
import { X, Mail, Shield, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManageMembersModal = ({ isOpen, onClose, trip, onUpdate }) => {
    const [emailInput, setEmailInput] = useState('');
    const [selectedRole, setSelectedRole] = useState('Editor');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !trip) return null;

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const handleAction = async (actionData) => {
        try {
            setLoading(true);
            await API.put(`/trips/${trip._id}/members`, actionData);
            onUpdate();
        } catch (err) {
            alert(err.response?.data?.message || 'Action failed');
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = (e) => {
        e.preventDefault();
        if (!emailInput.trim()) return;
        handleAction({ action: 'invite', email: emailInput, role: selectedRole });
        setEmailInput('');
    };

    const isOwner = (memberUser) => {
        return trip.members.find(m => m.user._id === memberUser._id)?.role === 'Owner';
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
                        className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-neutral-100 flex flex-col max-h-[85vh]"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-neutral-100">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight text-neutral-900">Manage Members</h3>
                                <p className="text-sm font-medium text-neutral-500 mt-1">Control access to {trip.title}</p>
                            </div>
                            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 transition-colors p-1 rounded-full hover:bg-neutral-100">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <form onSubmit={handleInvite} className="mb-6 bg-neutral-50/50 p-4 rounded-xl border border-neutral-100">
                                <label className="block text-sm font-semibold text-neutral-900 mb-2">Invite new member</label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-grow">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-neutral-400" />
                                        </div>
                                        <input
                                            type="email"
                                            className="appearance-none block w-full pl-9 pr-3 py-2.5 border border-neutral-200 placeholder-neutral-400 text-neutral-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 sm:text-sm bg-white"
                                            placeholder="friend@email.com"
                                            value={emailInput}
                                            onChange={(e) => setEmailInput(e.target.value)}
                                        />
                                    </div>
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="appearance-none px-3 py-2.5 border border-neutral-200 text-neutral-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 sm:text-sm bg-white font-medium"
                                    >
                                        <option value="Editor">Editor</option>
                                        <option value="Viewer">Viewer</option>
                                    </select>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-5 py-2.5 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors text-sm shadow-sm active:scale-[0.98] disabled:opacity-75 whitespace-nowrap"
                                    >
                                        Send Invite
                                    </button>
                                </div>
                            </form>

                            <h4 className="text-sm font-bold tracking-tight text-neutral-900 mb-3 border-b border-neutral-100 pb-2">Active Members</h4>
                            <div className="space-y-4 mb-6">
                                {trip.members.map((member) => (
                                    <div key={member.user._id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-sm font-bold text-neutral-600">
                                                {(member.user.name || member.user.email || '?').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-neutral-900 leading-none">{member.user.name || 'Unnamed'}</p>
                                                <p className="text-xs font-medium text-neutral-500 mt-1">{member.user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {member.role === 'Owner' ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-neutral-100 text-neutral-600">
                                                    <Shield size={12} className="mr-1" /> Owner
                                                </span>
                                            ) : (
                                                <select
                                                    value={member.role}
                                                    onChange={(e) => handleAction({ action: 'updateRole', userId: member.user._id, role: e.target.value })}
                                                    className="text-xs font-semibold px-2 py-1 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-none"
                                                >
                                                    <option value="Editor">Editor</option>
                                                    <option value="Viewer">Viewer</option>
                                                </select>
                                            )}
                                            {member.role !== 'Owner' && (
                                                <button
                                                    onClick={() => handleAction({ action: 'remove', userId: member.user._id })}
                                                    className="text-neutral-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                                                    title="Remove member"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {trip.invitedEmails && trip.invitedEmails.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-bold tracking-tight text-neutral-900 mb-3 border-b border-neutral-100 pb-2">Pending Invites</h4>
                                    <div className="space-y-3">
                                        {trip.invitedEmails.map((email, idx) => (
                                            <div key={idx} className="flex items-center justify-between pl-3 pr-2 py-2 bg-white border border-neutral-200 rounded-lg">
                                                <div className="text-sm font-medium text-neutral-500">{email}</div>
                                                <button
                                                    onClick={() => handleAction({ action: 'removeInvite', email })}
                                                    className="text-xs font-semibold text-neutral-500 hover:text-red-500 px-2 py-1 rounded transition-colors"
                                                >
                                                    Revoke
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end">
                            <button onClick={onClose} className="px-5 py-2.5 bg-white border border-neutral-200 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-colors shadow-sm text-sm">
                                Done
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ManageMembersModal;
