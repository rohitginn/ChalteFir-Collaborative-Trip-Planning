import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Users, Wallet, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';

const Landing = () => {
    return (
        <div className="flex flex-col min-h-[85vh] bg-neutral-50 overflow-hidden relative selection:bg-neutral-200">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 flex justify-center pointer-events-none opacity-40">
                    <div className="w-[800px] h-[400px] bg-neutral-200/60 rounded-full blur-3xl mix-blend-multiply filter" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl z-10"
                >
                    <div className="inline-flex items-center px-3 py-1 rounded-full border border-neutral-200 bg-white/50 backdrop-blur-sm shadow-sm mb-8">
                        <Sparkles className="h-4 w-4 text-neutral-500 mr-2" />
                        <span className="text-sm font-semibold text-neutral-600">The Minimal Standard for Group Travel</span>
                    </div>

                    <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-neutral-900 mb-8 leading-[0.9]">
                        Plan together. <br className="hidden sm:block" />
                        Travel better.
                    </h1>
                    <p className="text-xl sm:text-2xl text-neutral-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                        ChalteFir is the minimal, collaborative workspace for your group adventures. Organize daily itineraries, split expenses, and chat in real-time.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/register"
                            className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-neutral-900 hover:bg-neutral-800 transition-all shadow-sm active:scale-95"
                        >
                            Start Planning — It's Free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Features Showcase Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-neutral-200/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-6">Everything you need, nothing you don't.</h2>
                        <p className="text-lg text-neutral-500 max-w-2xl mx-auto">We stripped away the clutter so you can focus on building the perfect trip with your friends.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureBlock
                            icon={<MapPin className="h-6 w-6" />}
                            title="Visual Itineraries"
                            desc="Drag, drop, and organize your days effortlessly."
                            delay={0.1}
                        />
                        <FeatureBlock
                            icon={<Users className="h-6 w-6" />}
                            title="Live Collaboration"
                            desc="Invite friends and watch edits happen in real-time."
                            delay={0.2}
                        />
                        <FeatureBlock
                            icon={<Wallet className="h-6 w-6" />}
                            title="Expense Tracking"
                            desc="Log budgets for each activity and view auto-generated charts."
                            delay={0.3}
                        />
                        <FeatureBlock
                            icon={<MessageSquare className="h-6 w-6" />}
                            title="Activity Chat"
                            desc="Keep context clear with dedicated chat threads per activity."
                            delay={0.4}
                        />
                    </div>
                </div>
            </section>

            {/* Application Preview / Mockup Section */}
            <section className="py-32 px-4 sm:px-6 lg:px-8 bg-neutral-50 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="w-full max-w-5xl rounded-3xl bg-white border border-neutral-200/60 shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Fake Mac Window Bar */}
                        <div className="h-12 bg-neutral-100 flex items-center px-6 border-b border-neutral-200/60">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="mx-auto text-xs font-semibold text-neutral-400 px-4 py-1 bg-white rounded-md shadow-sm border border-neutral-200/50">chaltefir.com</div>
                        </div>
                        {/* Fake Content */}
                        <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 bg-neutral-50/50">
                            <div className="flex-1 space-y-6">
                                <div className="h-8 w-3/4 bg-neutral-200 rounded-lg animate-pulse"></div>
                                <div className="space-y-3">
                                    <div className="h-24 w-full bg-white border border-neutral-200 rounded-xl shadow-sm"></div>
                                    <div className="h-24 w-full bg-white border border-neutral-200 rounded-xl shadow-sm"></div>
                                    <div className="h-24 w-full bg-white border border-neutral-200 rounded-xl shadow-sm opacity-50"></div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/3">
                                <div className="w-full aspect-square bg-white border border-neutral-200 rounded-2xl shadow-sm flex items-center justify-center p-8">
                                    {/* Spinner representing chart */}
                                    <div className="w-full h-full rounded-full border-[10px] border-neutral-100 border-t-neutral-800 animate-[spin_3s_linear_infinite]"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-neutral-200/60 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                    <div className="flex flex-col gap-4">
                        <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-neutral-900">
                            <img src="/logo.png" alt="ChalteFir Logo" className="h-8 w-8 object-contain" />
                            ChalteFir.
                        </Link>
                        <p className="text-sm font-medium text-neutral-500 max-w-sm leading-relaxed">
                            Designed with minimal aesthetics to bring focus back to the joy of traveling with people you love.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
                        <div className="flex flex-col gap-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Product</span>
                            <Link to="/register" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">Start Planning</Link>
                            <Link to="/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">Sign In</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Legal</span>
                            <span className="text-sm font-medium text-neutral-600 cursor-not-allowed">Privacy Policy</span>
                            <span className="text-sm font-medium text-neutral-600 cursor-not-allowed">Terms of Service</span>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-neutral-400">
                    <p>© {new Date().getFullYear()} ChalteFir. All rights reserved.</p>
                    <p>Designed for the Buildathon.</p>
                </div>
            </footer>
        </div>
    );
};

const FeatureBlock = ({ icon, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        className="flex flex-col items-start p-6 rounded-2xl bg-neutral-50/50 border border-neutral-100 hover:border-neutral-200 transition-colors"
    >
        <div className="p-3 bg-white border border-neutral-200/60 rounded-xl shadow-sm mb-5 text-neutral-800">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-2">{title}</h3>
        <p className="text-sm text-neutral-500 leading-relaxed font-medium">{desc}</p>
    </motion.div>
);

export default Landing;
