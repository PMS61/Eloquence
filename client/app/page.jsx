"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <div className="py-2" id="background">
      {/* Navbar */}
      <nav className="bg-gray-900 fixed w-full z-20 top-0 start-0 opacity-[0.97]">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <Image
              src="/logo1.png"
              alt="Logo"
              width={72}
              height={32}
              className="h-8"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white font-poppins">
              Eloquence
            </span>
          </Link>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {/* "Get Started" button visible only on larger screens */}
            <Link href="/signup" className="hidden md:block">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 font-poppins"
              >
                Get started
              </button>
            </Link>
            {/* Hamburger menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded={menuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          {/* Mobile menu (includes "Get Started" button) */}
          <div
            className={`${
              menuOpen ? "block" : "hidden"
            } md:flex md:items-center md:w-auto md:order-1 w-full`}
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 font-poppins">
              <li>
                <button
                  onClick={() => scrollToSection("features")}
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Contact
                </button>
              </li>
              {/* "Get Started" button inside the mobile menu */}
              <li className="md:hidden">
                <Link href="/signup">
                  <button
                    type="button"
                    className="w-full text-left py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Get Started
                  </button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col p-4 gap-y-3">
        <section className="text-base-content m-6 h-screen flex items-center justify-center text-center relative overflow-hidden rounded-lg">
          <div className="container mx-auto px-4 z-10">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 gradient-text font-poppins">
              Welcome to Our Website
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-yellow-50 font-poppins">
              AI-powered public speaking enhancer that provides real-time
              feedback on pace, modulation, volume, facial expressions, and
              vocabulary.
            </p>
            <Link
              href="/signup"
              className="bg-blue-600 text-base-content font-bold py-2 px-6 sm:py-3 sm:px-8 rounded hover:bg-blue-700 text-white font-poppins"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="md:h-screen md:m-6 py-12 sm:py-20 rounded-lg h-full flex items-center justify-center"
        >
          <div className="container mx-auto text-center px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-base-content mb-8 sm:mb-12 gradient-text font-poppins">
              Our Features
            </h2>
            <div className="flex flex-col md:flex-row gap-8 sm:gap-12">
              {/* Card 1 */}
              <div className="card">
                <div className="card-content">
                  <h3 className="h3 font-poppins">
                    <span>Real-time</span> Feedback
                  </h3>
                  <p className="p font-poppins pt-2">
                    Receive immediate insights on your pacing, modulation,
                    volume, facial expressions, and vocabulary, allowing you to
                    adjust and improve your communication skills on the spot.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="card">
                <div className="card-content">
                  <h3 className="h3 font-poppins">
                    <span>Personalized</span> Practice
                  </h3>
                  <p className="p font-poppins pt-2">
                    Offers tailored practice scenarios and prompts that adapt to
                    individual skill levels and communication goals, allowing
                    users to focus on specific areas for improvement.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="card">
                <div className="card-content">
                  <h3 className="h3 font-poppins">
                    <span>Progress</span> Tracking
                  </h3>
                  <p className="p font-poppins pt-2">
                    Monitors user performance over time with detailed analytics
                    and visual reports, helping users identify strengths and
                    areas needing improvement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="text-base-content m-6 rounded-lg h-screen flex items-center justify-center"
        >
          <div className="container mx-auto text-center px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 gradient-text font-poppins">
              About Us
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 text-yellow-50 font-poppins">
              We are a tech company dedicated to providing top-notch solutions
              for businesses worldwide.
            </p>
            <p className="text-lg sm:text-xl md:text-2xl text-yellow-50 font-poppins">
              Our mission is to simplify processes and drive growth.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="text-base-content h-screen m-6 rounded-lg flex items-center justify-center"
        >
          <div className="container mx-auto text-center px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 gradient-text font-poppins">
              Get in Touch
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-yellow-50 font-poppins">
              Reach out to us for more information on our services.
            </p>
            <Link
              href="#contact-form"
              className="bg-blue-600 text-base-content font-bold py-2 px-6 sm:py-3 sm:px-8 rounded hover:bg-blue-700 text-white font-poppins"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-base-content pt-12 pb-1 text-center mx-9">
        <div className="container mx-auto px-4">
          <p className="text-sm font-poppins text-white">
            © 2024 ELOQUENCE. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Styled JSX */}
      <style jsx>{`
        .gradient-text {
          background: linear-gradient(125deg, #ff8c32, #ffd700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .h3 span {
          font-weight: 800;
          background: linear-gradient(125deg, #ff8c32, #ffd700);
          text-transform: uppercase;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          position: relative;
          display: inline-block;
        }

        .h3 span::after {
          content: "";
          display: block;
          width: 45%;
          height: 3px;
          background: linear-gradient(125deg, #ff8c32, #ffd700);
          position: absolute;
          top: 100%;
          margin-top: -4px;
        }

        @media (max-width: 700px) {
          .h3 span::after {
            width: 45%;
            height: 2px;
            margin-top: -3px;
          }
        }

        .card {
          background-color: #111827;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.25rem;
          padding: 1rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s;
        }

        .card:hover {
          transform: translateY(-10px);
        }

        .card-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          background-image: radial-gradient(
            rgba(255, 255, 255, 0.1) 1px,
            transparent 1px
          );
          background-position: 50% 50%;
          background-size: 0.8rem 0.8rem;
          padding: 1.5rem;
          border-radius: 1rem;
        }

        .card-content .h3 {
          color: #ffffff;
          text-transform: uppercase;
          font-size: 1.25rem;
        }

        .card-content .p {
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.5rem;
          font-size: 0.9rem;
        }

        .glass-bg {
          background-color: #0F172A;
        }
      `}</style>
    </div>
  );
}