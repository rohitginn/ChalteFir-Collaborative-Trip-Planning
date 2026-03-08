import React, { useState } from 'react';
import API from '../api/api.js';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-neutral-50 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-sm space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-neutral-200/60 transition-all">
                <div>
                    <h2 className="text-center text-2xl font-bold tracking-tight text-neutral-900">
                        Sign In
                    </h2>
                </div>
                <form className="mt-8 space-y-5" onSubmit={handleLogin}>
                    {error && <div className="text-red-500 text-sm font-medium text-center">{error}</div>}
                    <div className="space-y-4">
                        <div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none block w-full px-3 py-2.5 border border-neutral-200 placeholder-neutral-400 text-neutral-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 sm:text-sm transition-shadow"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none block w-full px-3 py-2.5 border border-neutral-200 placeholder-neutral-400 text-neutral-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 sm:text-sm transition-shadow"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 transition-colors active:scale-[0.98]"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center pt-2">
                    <Link to="/register" className="font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
                        Don't have an account? <span className="underline underline-offset-4">Register</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
