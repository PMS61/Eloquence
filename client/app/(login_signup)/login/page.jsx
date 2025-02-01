"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../components/bg.css';
import Link from 'next/link';

export default function Login() {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted");

        const response = await fetch(`http://127.0.0.1:5000/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const json = await response.json();
        console.log("Response JSON:", json);

        if (json.token) {
            console.log("Login Successful");
            localStorage.setItem('token', json.token);
            localStorage.setItem('username', json.username);  // Store username
            localStorage.setItem('userId', json.userId);      // Store user ID
            router.push(`/dashboard`); // Redirect to dashboard
        } else {
            console.log("Login Failed");
            alert(json.error || "Invalid credentials");
        }
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <section className="flex items-center justify-center min-h-screen px-4 bg-[#0F172A]" id='background'>
            <div className="w-full max-w-md rounded-lg shadow-lg bg-[#1E293B] p-8 border border-[#334155]">
                <h1 className="text-2xl font-bold text-center text-[#C9CBD0] mb-6">
                    Log in to your account
                </h1>
                <form className="space-y-6" onSubmit={handleSubmit}>
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
                            placeholder="••••••••"
                            className="w-full p-3 text-sm bg-[#334155] border border-[#3ABDF8] rounded-lg focus:ring-2 focus:ring-[#818CF8] focus:border-[#818CF8] placeholder-[#C9CBD0]"
                            required
                            onChange={onChange}
                            value={credentials.password}
                        />
                    </div>
                    <div className="w-full flex justify-center items-center">
                        <button
                            type="submit"
                            className="w-full px-8 py-3 text-white text-sm bg-[#3ABDF8] hover:bg-[#2AA8E0] focus:ring-4 focus:outline-none focus:ring-[#818CF8] font-medium rounded-lg transition duration-300"
                        >
                            Login
                        </button>
                    </div>
                    <p className="text-s text-center text-[#C9CBD0]">
                        Don’t have an account yet?  
                        <Link href="/signup" className="font-medium text-[#818CF8] hover:underline">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
}