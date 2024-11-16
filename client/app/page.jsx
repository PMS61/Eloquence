"use client";

import React from "react";
import Link from "next/link";
import { Satisfy, Playfair_Display } from '@next/font/google';

const satisfy = Satisfy({
  subsets: ['latin'],
  weight: ['400'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
});



export default function LandingPage() {


  const scrollToSection = (sectionId) => {
    const section = document.querySelector(sectionId);
    section.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="  py-2" id="background">
      {/* Header */}
      <header className="glass-bg  top-0 z-50 bg-gray-800 text-gray-100 py-4 rounded-lg mx-4 md:mx-10">
  <div className="container mx-auto flex justify-between items-center px-2 md:px-4">
    <img src="/logo1.png" alt="logo" className="w-28 h-12 md:w-44 md:h-16" />
    <h1
      className={`${satisfy.className} text-3xl md:text-7xl p-2 font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text`}
    >
      Eloquence
    </h1>

    <nav>
      <ul className={`${playfair.className} flex flex-col mr-3 gap-x-3 md:gap-x-6 text-base md:text-2xl text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text`}>
        <li>
          <a
            href="#"
            onClick={() => scrollToSection("#features")}
            className="hover:text-gray-400"
          >
            Features
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => scrollToSection("#about")}
            className="hover:text-gray-400"
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={() => scrollToSection("#contact")}
            className="hover:text-gray-400"
          >
            Contact
          </a>
        </li>
      </ul>
    </nav>
  </div>
</header>



      {/* Hero Section */}
      <div className="flex flex-col p-4 gap-y-3  ">
      <section className="glass-bg bg-gray-900 text-gray-100  m-6 h-screen flex items-center justify-center text-center relative overflow-hidden rounded-lg">
        <div className="container mx-auto px-4 z-10">
          <h2 className="text-4xl font-bold mb-4">Welcome to Our Website</h2>
          <p className="text-xl mb-8">
            AI-powered public speaking enhancer that provides real-time feedback
            on pace, modulation, volume, facial expressions, and vocabulary.
          </p>
          <Link
            href="/dashboard"
            className="bg-blue-500 text-white font-bold py-2 px-6 rounded hover:bg-blue-600"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="glass-bg bg-gray-900  md:h-screen md:m-6 py-2 rounded-lg h-full flex items-center justify-center"
      >
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-100 mb-8">
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="card">
              <div className="card-content">
                <div className="h3">
                  <span>Real-time</span> Feedback
                </div>
                <p className="p">
                  Receive immediate insights on your pacing, modulation, volume,
                  facial expressions, and vocabulary, allowing you to adjust and
                  improve your communication skills on the spot.
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
                  Offers tailored practice scenarios and prompts that adapt to
                  individual skill levels and communication goals, allowing
                  users to focus on specific areas for improvement.
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
                  Monitors user performance over time with detailed analytics
                  and visual reports, helping users identify strengths and areas
                  needing improvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="glass-bg bg-gray-900 text-gray-100  m-6 rounded-lg h-screen flex items-center justify-center"
      >
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-8">About Us</h2>
          <p className="text-lg mb-4">
            We are a tech company dedicated to providing top-notch solutions for
            businesses worldwide.
          </p>
          <p className="text-lg">
            Our mission is to simplify processes and drive growth.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="glass-bg bg-gray-900 text-gray-100  h-screen m-6 rounded-lg flex items-center justify-center"
      >
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
          <p className="text-lg mb-4">
            Reach out to us for more information on our services.
          </p>
          <Link
            href="#contact-form"
            className="bg-blue-500 text-white font-bold py-2 px-6 rounded hover:bg-blue-600"
          >
            Contact Us
          </Link>
        </div>
      </section>
      </div>

      {/* Footer */}
      <footer className="glass-bg bg-gray-900 text-gray-400 py-6 text-center mx-9 my-2 rounded-lg">
        <div className="container mx-auto px-4">
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
          position: relative; /* Needed for ::after positioning */
          display: inline-block;
        }

        .h3 span::after {
          content: "";
          display: block;
          width: 45%; /* Adjusts the width of the underline */
          height: 3px; /* Thickness of the underline */
          background: linear-gradient(125deg, #b663ff, #13c1ef);
          position: absolute;
          top: 100%; /* Positions it just below the text */
          margin-top: -4px; /* Brings the line closer to the text */
        }

        /* Responsive Adjustments */
        @media (max-width: 700px) {
          .h3 span::after {
            width: 45%; /* Make the underline a bit shorter on smaller screens */
            height: 2px; /* Adjust thickness for smaller screens */
            margin-top: -3px; /* Adjusts distance for smaller screens */
          }
        }

        .card {
  background-color: rgb(16, 16, 16);
  border: 1px solid rgb(255 255 255 / 5%);
  border-radius: 1.25rem;
  padding: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

@media (min-width: 768px) {
  .card {
    border-radius: 1.5rem;
    padding: 1.5rem;
  }
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

@media (min-width: 768px) {
  .card-content {
    background-size: 1.1rem 1.1rem;
    padding: 2.3rem;
    border-radius: 1.25rem;
  }
}

.card-content .h1,
.h3,
.p {
  text-align: center;
}

.card-content .h3 {
  color: #fff;
  text-transform: uppercase;
  font-size: 1.25rem;
}

@media (min-width: 768px) {
  .card-content .h3 {
    font-size: 1.5rem;
  }
}

.card-content .p {
  color: rgb(255 255 255 / 75%);
  line-height: 1.2rem;
  font-size: 0.9rem;
}

@media (min-width: 768px) {
  .card-content .p {
    line-height: 1.3rem;
    font-size: 1rem;
  }
}


      #background {
  background: linear-gradient(
    90deg,
    #3ea2f6, /* Light Blue */
    #4eb8f7, /* Sky Blue */
    #70a4ff, /* Deeper Blue */
    #f34bcf, /* Pink */
    #a788ff, /* Light Purple */
    #ff7592, /* Peach */
    #cd6eff  /* Lavender */
  );
  background-size: 1000% 1000%;
  animation: backgroundAnimation 15s ease infinite;
}

@keyframes backgroundAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}


  .glass-bg {
    background: rgba(0, 0, 0, 0.5); /* Black background with 50% opacity */
    backdrop-filter: blur(10px); /* Blurs the content behind the element */
    -webkit-backdrop-filter: blur(10px); /* For Safari support */
    border: 1px solid rgba(255, 255, 255, 0.2); /* Light border for a frosted effect */
    border-radius: 1rem; /* Rounded corners for aesthetic */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); /* Subtle shadow for depth */
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
