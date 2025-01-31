"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../components/bg.css'
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
        <section className="= flex items-center justify-center min-h-screen px-4   bg-gray-900 " id='background'>
            <div className="w-lg md:w-1/3 glass-bg  rounded-lg shadow border bg-gray-800 border-gray-700 p-6 sm:p-6 md:p-8">
                <h1 className="text-lg font-bold text-center text-white m-2 ">
                    Log in to your account
                </h1>
                <form className="space-y-4 m-2" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white m-2">Your email</label>
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
                        <label htmlFor="password" className="block text-sm font-medium text-white m-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            className="w-full p-2 text-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            required
                            onChange={onChange}
                            value={credentials.password}
                        />
                    </div>
                    <div className="w-full flex justify-center items-center">
                    <button
                        type="submit"
                        className=" px-8 py-3 text-white text-sm bg-gray-900 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                        Login
                    </button>
                    </div>
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        Don’t have an account yet?  
                        <Link href="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500"> Sign up</Link>
                    </p>
                </form>
            </div>
           
        </section>
    );
}