"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../components/bg.css';

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
        <div className="flex items-center justify-center min-h-screen px-4 bg-[#0F172A]" id='background'>
            <section className="w-full max-w-md rounded-lg shadow-lg bg-[#1E293B] p-8 border border-[#334155]">
                <h1 className="text-2xl font-bold text-center text-[#C9CBD0] mb-6">
                    Sign up for an account
                </h1>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[#C9CBD0] mb-2">Username</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="w-full p-3 text-sm bg-[#334155] border border-[#3ABDF8] rounded-lg focus:ring-2 focus:ring-[#818CF8] focus:border-[#818CF8] placeholder-[#C9CBD0]"
                            placeholder="Your username"
                            required
                            onChange={onChange}
                            value={credentials.name}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#C9CBD0] mb-2">Your email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="w-full p-3 text-sm bg-[#334155] border border-[#3ABDF8] rounded-lg focus:ring-2 focus:ring-[#818CF8] focus:border-[#818CF8] placeholder-[#C9CBD0]"
                            placeholder="name@company.com"
                            required
                            onChange={onChange}
                            value={credentials.email}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#C9CBD0] mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="w-full p-3 text-sm bg-[#334155] border border-[#3ABDF8] rounded-lg focus:ring-2 focus:ring-[#818CF8] focus:border-[#818CF8] placeholder-[#C9CBD0]"
                            placeholder="••••••••"
                            required
                            onChange={onChange}
                            value={credentials.password}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#C9CBD0] mb-2">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            className="w-full p-3 text-sm bg-[#334155] border border-[#3ABDF8] rounded-lg focus:ring-2 focus:ring-[#818CF8] focus:border-[#818CF8] placeholder-[#C9CBD0]"
                            placeholder="••••••••"
                            required
                            onChange={onChange}
                            value={credentials.confirmPassword}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-8 py-3 text-white text-sm bg-[#3ABDF8] hover:bg-[#2AA8E0] focus:ring-4 focus:outline-none focus:ring-[#818CF8] font-medium rounded-lg transition duration-300"
                    >
                        Sign Up
                    </button>
                    {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                    <p className="text-xs text-center text-[#C9CBD0]">
                        Already have an account?  
                        <Link href="/login" className="font-medium text-[#818CF8] hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </section>
        </div>
    );
}