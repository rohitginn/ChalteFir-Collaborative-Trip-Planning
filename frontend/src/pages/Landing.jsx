import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Users, Calendar, ArrowRight } from 'lucide-react';

const Landing = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 sm:px-6 lg:px-8 bg-neutral-50 overflow-hidden relative">
            {/* Background glowing blobs for minimal premium feel */}
            <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 flex justify-center pointer-events-none opacity-40">
                <div className="w-[600px] h-[300px] bg-neutral-200/50 rounded-full blur-3xl mix-blend-multiply filter" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-3xl z-10"
            >
                <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-neutral-900 mb-6 leading-tight">
                    Plan together. <br className="hidden sm:block" />
                    Travel better.
                </h1>
                <p className="text-lg sm:text-xl text-neutral-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                    ChalteFir is the minimal, collaborative workspace for your group adventures.
                    Organize daily itineraries, split group expenses, and chat in real-time without the clutter.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
                    <Link
                        to="/register"
                        className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-full text-white bg-neutral-900 hover:bg-neutral-800 transition-all shadow-sm active:scale-95"
                    >
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <Link
                        to="/login"
                        className="inline-flex justify-center items-center px-8 py-3.5 border border-neutral-200 text-base font-semibold rounded-full text-neutral-900 bg-white hover:bg-neutral-50 transition-all shadow-sm active:scale-95"
                    >
                        Sign In
                    </Link>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl z-10 w-full mt-8">
                <FeatureCard
                    icon={<Map className="h-6 w-6 text-neutral-900" />}
                    title="Visual Itineraries"
                    description="Drag and drop activities on a beautifully simple daily planner map."
                    delay={0.1}
                />
                <FeatureCard
                    icon={<Users className="h-6 w-6 text-neutral-900" />}
                    title="Real-time Collaboration"
                    description="Invite friends via email and edit the trip details together instantly."
                    delay={0.2}
                />
                <FeatureCard
                    icon={<Calendar className="h-6 w-6 text-neutral-900" />}
                    title="Easy Estimations"
                    description="Drop your budgets inside activities. We track how much money you spend."
                    delay={0.3}
                />
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-neutral-200/60 shadow-sm"
    >
        <div className="h-12 w-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-4 border border-neutral-200/50">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-2">{title}</h3>
        <p className="text-sm text-neutral-500 leading-relaxed">{description}</p>
    </motion.div>
);

export default Landing;
