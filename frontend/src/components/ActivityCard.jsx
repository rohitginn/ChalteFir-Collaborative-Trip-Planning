import React, { useState } from 'react';
import API from '../api/api.js';
import { Paperclip, MessageSquare, CheckSquare, DollarSign, Clock, MapPin, Save, Trash2 } from 'lucide-react';

const ActivityCard = ({ activity, canEdit, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [timing, setTiming] = useState(activity.timing || '');
    const [place, setPlace] = useState(activity.place || '');
    const [budgetAmount, setBudgetAmount] = useState(activity.budget?.amount || 0);
    const standardCategories = ['travelling', 'food', 'stay', 'activities', 'other'];
    const [budgetCategory, setBudgetCategory] = useState(activity.budget?.category || 'other');
    const [isCustomCategory, setIsCustomCategory] = useState(!standardCategories.includes(activity.budget?.category || 'other'));

    const [newComment, setNewComment] = useState('');
    const [checklists, setChecklists] = useState(activity.checklists || []);
    const [newChecklist, setNewChecklist] = useState('');
    const [attachments, setAttachments] = useState(activity.attachments || []);
    const [isUploading, setIsUploading] = useState(false);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const handleSaveDoc = async () => {
        try {
            await API.put(`/activities/${activity._id}`, {
                timing,
                place,
                budget: { amount: budgetAmount, category: budgetCategory },
                checklists
            });
            setIsEditing(false);
            onUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this activity?')) return;
        try {
            await API.delete(`/activities/${activity._id}`);
            onUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await API.post(`/activities/${activity._id}/comment`, { text: newComment });
            setNewComment('');
            onUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileUpload = async (e) => {
        if (!canEdit) return;
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Upload to Cloudinary via backend
            const { data } = await API.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const newAttachments = [...attachments, { url: data.url, filename: data.filename }];
            setAttachments(newAttachments);

            // Save to DB
            await API.put(`/activities/${activity._id}`, { attachments: newAttachments });

        } catch (err) {
            console.error('Upload Error:', err);
            alert('File upload failed');
        } finally {
            setIsUploading(false);
            e.target.value = null; // reset input
        }
    };

    const toggleChecklist = async (index) => {
        if (!canEdit) return;
        const newLists = [...checklists];
        newLists[index].isCompleted = !newLists[index].isCompleted;
        setChecklists(newLists);

        // Auto save
        try {
            await API.put(`/activities/${activity._id}`, { checklists: newLists });
        } catch (err) { }
    };

    const handleAddChecklist = async (e) => {
        e.preventDefault();
        if (!newChecklist.trim()) return;
        const newLists = [...checklists, { task: newChecklist, isCompleted: false }];
        setChecklists(newLists);
        setNewChecklist('');

        try {
            await API.put(`/activities/${activity._id}`, { checklists: newLists });
        } catch (err) { }
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/60 shadow-sm hover:shadow-md transition-shadow">
            {isEditing && canEdit ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Timing</label>
                            <input type="text" value={timing} onChange={e => setTiming(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-neutral-200 text-neutral-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 sm:text-sm" placeholder="10:00 AM" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Place</label>
                            <input type="text" value={place} onChange={e => setPlace(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-neutral-200 text-neutral-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 sm:text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Budget Amount ($)</label>
                            <input type="number" value={budgetAmount} onChange={e => setBudgetAmount(Number(e.target.value))} className="appearance-none block w-full px-3 py-2 border border-neutral-200 text-neutral-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Category</label>
                            {isCustomCategory ? (
                                <div className="flex">
                                    <input
                                        type="text"
                                        autoFocus
                                        value={budgetCategory}
                                        placeholder="Type category..."
                                        onChange={e => setBudgetCategory(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-neutral-200 text-neutral-900 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 sm:text-sm bg-white"
                                    />
                                    <button type="button" onClick={() => { setIsCustomCategory(false); setBudgetCategory('other'); }} className="px-3 border border-l-0 border-neutral-200 rounded-r-lg bg-neutral-50 text-neutral-500 hover:bg-neutral-100 transition-colors text-xs font-bold uppercase">X</button>
                                </div>
                            ) : (
                                <select
                                    value={budgetCategory}
                                    onChange={e => {
                                        if (e.target.value === '@custom') {
                                            setIsCustomCategory(true);
                                            setBudgetCategory('');
                                        } else {
                                            setBudgetCategory(e.target.value);
                                        }
                                    }}
                                    className="appearance-none block w-full px-3 py-2 border border-neutral-200 text-neutral-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 sm:text-sm bg-white"
                                >
                                    <option value="travelling">Travelling</option>
                                    <option value="food">Food</option>
                                    <option value="stay">Stay</option>
                                    <option value="activities">Activities</option>
                                    <option value="other">Other</option>
                                    <option value="@custom" className="font-bold text-neutral-900">+ Custom Category</option>
                                </select>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors">Cancel</button>
                        <button onClick={handleSaveDoc} className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors flex items-center shadow-sm">
                            <Save size={16} className="mr-1.5" /> Save
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center text-lg font-bold text-neutral-900">
                                <MapPin size={18} className="text-neutral-400 mr-2" />
                                {activity.place}
                            </div>
                            <div className="flex items-center text-sm font-medium text-neutral-500 mt-1">
                                <Clock size={14} className="mr-1.5" />
                                {activity.timing || 'No timing set'}
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            {activity.budget?.amount > 0 && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700 shadow-sm border border-neutral-200/60">
                                    <DollarSign size={12} className="mr-0.5 text-neutral-400" />
                                    {activity.budget.amount} <span className="ml-1 text-neutral-500 font-medium capitalize">{activity.budget.category}</span>
                                </span>
                            )}
                            {canEdit && (
                                <div className="mt-3 flex space-x-3">
                                    <button onClick={() => setIsEditing(true)} className="text-sm font-semibold text-neutral-400 hover:text-neutral-900 transition-colors">Edit</button>
                                    <button onClick={handleDelete} className="text-sm font-semibold text-neutral-400 hover:text-red-600 transition-colors">Delete</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Checklist Section */}
                        <div className="bg-neutral-50/50 p-4 rounded-xl border border-neutral-100">
                            <h4 className="flex items-center text-sm font-bold tracking-tight text-neutral-900 mb-4">
                                <CheckSquare size={16} className="mr-2 text-neutral-400" /> Tasks
                            </h4>
                            <ul className="space-y-3 mb-4">
                                {checklists.map((item, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                type="checkbox"
                                                checked={item.isCompleted}
                                                onChange={() => toggleChecklist(idx)}
                                                disabled={!canEdit}
                                                className="h-4 w-4 text-neutral-900 focus:ring-neutral-900 border-neutral-300 rounded cursor-pointer transition-colors"
                                            />
                                        </div>
                                        <label className={`ml-2.5 block text-sm font-medium transition-colors ${item.isCompleted ? 'text-neutral-400 line-through decoration-neutral-300' : 'text-neutral-700'}`}>
                                            {item.task}
                                        </label>
                                    </li>
                                ))}
                                {checklists.length === 0 && <li className="text-xs text-neutral-400 font-medium italic">No tasks added yet.</li>}
                            </ul>
                            {canEdit && (
                                <form onSubmit={handleAddChecklist} className="flex">
                                    <input
                                        type="text"
                                        value={newChecklist}
                                        onChange={e => setNewChecklist(e.target.value)}
                                        placeholder="Add a task..."
                                        className="appearance-none block w-full px-3 py-2 border border-neutral-200 placeholder-neutral-400 text-neutral-900 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 sm:text-sm bg-white"
                                    />
                                    <button type="submit" className="inline-flex items-center px-4 py-2 border border-l-0 border-neutral-200 rounded-r-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-sm font-semibold transition-colors">
                                        Add
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Comments Section */}
                        <div className="bg-neutral-50/50 p-4 rounded-xl border border-neutral-100 flex flex-col h-full">
                            <h4 className="flex items-center text-sm font-bold tracking-tight text-neutral-900 mb-4">
                                <MessageSquare size={16} className="mr-2 text-neutral-400" /> Discussion
                            </h4>
                            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 scrollbar-hide max-h-48 min-h-[8rem]">
                                {(activity.comments || []).map((msg, idx) => (
                                    <div key={idx} className="bg-white rounded-lg p-3 text-sm shadow-sm border border-neutral-100 flex flex-col">
                                        <div className="flex justify-between items-baseline mb-1.5">
                                            <span className="font-semibold text-neutral-900">{msg.user?.name || 'User'}</span>
                                            <span className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-neutral-600 leading-relaxed font-medium">{msg.text}</p>
                                    </div>
                                ))}
                                {(!activity.comments || activity.comments.length === 0) && (
                                    <p className="text-xs text-neutral-400 font-medium italic">No comments yet. Start a discussion!</p>
                                )}
                            </div>
                            <form onSubmit={handleAddComment} className="flex mt-auto">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                    placeholder="Type a message..."
                                    className="appearance-none block w-full px-3 py-2 border border-neutral-200 placeholder-neutral-400 text-neutral-900 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 sm:text-sm bg-white"
                                />
                                <button type="submit" className="inline-flex items-center px-4 py-2 border border-l-0 border-neutral-200 rounded-r-lg bg-neutral-900 text-white hover:bg-neutral-800 text-sm font-semibold transition-colors">
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* File Attachments Area */}
                    <div className="mt-8">
                        <div className="border border-dashed border-neutral-300 rounded-xl p-6 bg-neutral-50/30 flex flex-col items-center justify-center text-center transition-colors hover:bg-neutral-50">
                            <Paperclip size={24} className="text-neutral-400 mb-2" />
                            <h4 className="text-sm font-bold tracking-tight text-neutral-900 mb-1">
                                Attachments and Tickets
                            </h4>
                            <p className="text-xs font-medium text-neutral-500 mb-4 max-w-xs">Upload important receipts, booking confirmations or tickets relative to this activity.</p>
                            <label className={`cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-neutral-200 shadow-sm text-sm font-semibold rounded-lg transition-colors ${isUploading ? 'text-neutral-400 opacity-70' : 'text-neutral-700 hover:bg-neutral-50 active:scale-[0.98]'}`}>
                                {isUploading ? 'Uploading...' : 'Select File'}
                                <input type="file" className="hidden" disabled={!canEdit || isUploading} onChange={handleFileUpload} />
                            </label>

                            {attachments.length > 0 && (
                                <div className="mt-4 w-full text-left space-y-2">
                                    {attachments.map((file, idx) => (
                                        <a key={idx} href={file.url} target="_blank" rel="noopener noreferrer" className="block p-3 bg-white rounded border border-neutral-200 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-neutral-50 truncate transition-colors">
                                            {file.filename}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityCard;
