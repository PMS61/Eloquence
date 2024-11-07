"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (credentials.password !== credentials.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
    
        try {
            const response = await fetch('http://127.0.0.1:5000/auth/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: credentials.name,
                    email: credentials.email,
                    password: credentials.password,
                }),
            });
    
            const json = await response.json();
    
            if (response.ok) {
                if (json.authToken) {
                    console.log("SignUp Success");
                    localStorage.setItem('token', json.authToken); 
                    router.push(`/dashboard/${json.userId}`);
                }
            } else {
                setError(json.error || "Failed to sign up");
            }
        } catch (error) {
            setError("An error occurred while signing up. Please try again.");
        }
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gray-900 ">
            <section className="w-full max-w-sm rounded-lg shadow-md bg-gray-800 border-gray-700 p-4 sm:p-6 md:p-6">
                <h1 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-4">
                    Sign up for an account
                </h1>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-white">Username</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="w-full p-2 text-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Your username"
                            required
                            onChange={onChange}
                            value={credentials.name}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="w-full p-2 text-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="name@company.com"
                            required
                            onChange={onChange}
                            value={credentials.email}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="w-full p-2 text-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="••••••••"
                            required
                            onChange={onChange}
                            value={credentials.password}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            className="w-full p-2 text-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="••••••••"
                            required
                            onChange={onChange}
                            value={credentials.confirmPassword}
                        />
                    </div>
                    <button type="submit" className="w-full py-2 text-white text-sm bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign Up</button>
                    {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        Already have an account? <Link href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</Link>
                    </p>
                </form>
            </section>
        </div>
    );
}
