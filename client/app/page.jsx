"use client";

import React from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="dark-theme">
      {/* Header */}
      <header className="bg-gray-800 text-gray-100 py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">ELOQUENCE</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="#features" className="hover:text-gray-400">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-gray-400">
                  About
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-gray-400">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-900 text-gray-100 py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Welcome to Our Website</h2>
          <p className="text-xl mb-8">
            AI-powered public speaking enhancer that provides real-time feedback on pace, modulation, volume, facial expressions, and vocabulary.
          </p>
          <Link href="#get-started" className="bg-blue-500 text-white font-bold py-2 px-6 rounded hover:bg-blue-600">
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-800 py-20">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-100 mb-8">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="card">
              <div className="card-content">
                <div className="h3">
                  <span>Real-time</span> Feedback
                </div>
                <p className="p">
                  Receive immediate insights on your pacing, modulation, volume, facial expressions, and vocabulary, allowing you to adjust and improve your communication skills on the spot.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card">
              <div className="card-content">
                <div className="h3">
                  <span>Personalized</span> Practice
                </div>
                <p className="p">
                  Offers tailored practice scenarios and prompts that adapt to individual skill levels and communication goals, allowing users to focus on specific areas for improvement.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card">
              <div className="card-content">
                <div className="h3">
                  <span>Progress</span> Tracking
                </div>
                <p className="p">
                  Monitors user performance over time with detailed analytics and visual reports, helping users identify strengths and areas needing improvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-gray-900 text-gray-100 py-20">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-8">About Us</h2>
          <p className="text-lg mb-4">
            We are a tech company dedicated to providing top-notch solutions for businesses worldwide.
          </p>
          <p className="text-lg">
            Our mission is to simplify processes and drive growth.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-800 text-gray-100 py-20">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
          <p className="text-lg mb-4">
            Reach out to us for more information on our services.
          </p>
          <Link href="#contact-form" className="bg-blue-500 text-white font-bold py-2 px-6 rounded hover:bg-blue-600">
            Contact Us
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-4">
        <div className="container mx-auto text-center px-4">
          <p>© 2024 ELOQUENCE. All rights reserved.</p>
        </div>
      </footer>

      {/* Styled JSX */}
      <style jsx>{`
        .h3 span {
          font-weight: 800;
          background: linear-gradient(125deg, #b663ff, #13c1ef);
          text-transform: uppercase;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .h3::after {
          content: "";
          margin-top: -5px;
          height: 3px;
          width: 25%;
          background: linear-gradient(125deg, #b663ff, #13c1ef);
          display: block;
        }

        .card {
          background-color: rgb(16, 16, 16); /* Original card background */
          border: 1px solid rgb(255 255 255 / 5%);
          border-radius: 1.5rem;
          padding: 1.5rem;
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
          background-size: 1.1rem 1.1rem;
          padding: 2.3rem;
          border-radius: 1.25rem;
          overflow: hidden;
        }

        .card-content .h1, .h3, .p {
          text-align: center;
        }

        .card-content .h3 {
          color: #fff;
          text-transform: uppercase;
          font-size: 1.5rem;
        }

        .card-content .p {
          color: rgb(255 255 255 / 75%);
          line-height: 1.3rem;
        }

        @media (max-width: 700px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
