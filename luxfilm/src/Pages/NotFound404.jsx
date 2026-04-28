import React from "react";
import { Link } from "react-router"; 
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function NotFound() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg-primary)] p-6 transition-colors duration-500"
      onMouseMove={(e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 40;
        const y = (window.innerHeight / 2 - e.pageY) / 40;
        const card = document.getElementById("card");
        if (card) {
          card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        }
      }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0"
        options={{
          background: { color: "transparent" },
          particles: {
            number: { value: 40 },
            color: { value: "#e50914" },
            size: { value: 2 },
            move: { enable: true, speed: 0.8 },
            opacity: { value: 0.3 },
          },
        }}
      />

      <div className="absolute w-96 h-96 bg-red-600 opacity-10 rounded-full blur-3xl top-[-50px] left-[-50px] animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-red-800 opacity-10 rounded-full blur-3xl bottom-[-50px] right-[-50px] animate-pulse"></div>

      <div
        id="card"
        className="relative  backdrop-blur-2xl shadow-2xl rounded-3xl p-10 text-center max-w-lg w-full  transition-transform duration-200"
        style={{ perspective: "1000px" }}
      >
        {/* Title 404 */}
        <h1 className="text-8xl font-extrabold bg-gradient-to-b from-red-600 to-red-900 bg-clip-text text-transparent mb-4 drop-shadow-sm">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-[var(--white-pure)] mb-2">
          Oops! Lost in Space?
        </h2>

        <p className="text-[var(--white-pure)] opacity-70 mb-8">
          The page you're looking for has been moved or doesn't exist in our cinematic universe.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/"
            className="px-8 py-3 rounded-xl bg-[var(--error-red)] text-white font-bold shadow-lg hover:bg-red-700 hover:scale-105 transition duration-300"
          >
            Go to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-white font-bold backdrop-blur-md transition duration-300 hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}