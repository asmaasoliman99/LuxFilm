// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";

// export default function NotFound() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-6">
//       <div className="text-8xl font-bold text-gray-200">404</div>

//       <h1 className="text-4xl font-bold text-gray-800">Page Not Found</h1>

//       <p className="text-xl text-gray-600 max-w-md">
//         Sorry, the page you're looking for doesn't exist. Let's get you back to
//         shopping!
//       </p>

//       <div className="flex gap-4">
//         <Link to="/">
//           <Button className="px-8 py-2">Back to Home</Button>
//         </Link>
//         <Link to="/cart">
//           <Button variant="outline" className="px-8 py-2">
//             Go to Cart
//           </Button>
//         </Link>
//       </div>

//       <div className="mt-12 text-6xl">🔍</div>
//     </div>
//   );
// }
import React from "react";
import { Link } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function NotFound() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-black to-gray-900 p-6"
      onMouseMove={(e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 40;
        const y = (window.innerHeight / 2 - e.pageY) / 40;
        const card = document.getElementById("card");
        if (card) {
          card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        }
      }}
    >
      {/* Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0"
        options={{
          background: { color: "transparent" },
          particles: {
            number: { value: 50 },
            size: { value: 3 },
            move: { enable: true, speed: 1 },
            opacity: { value: 0.5 },
          },
        }}
      />

      {/* Glow Blobs */}
      <div className="absolute w-96 h-96 bg-red-900 opacity-20 rounded-full blur-3xl top-[-50px] left-[-50px] animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-orange-900 opacity-20 rounded-full blur-3xl bottom-[-50px] right-[-50px] animate-pulse"></div>

      {/* Card */}
      <div
        id="card"
        className="relative bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-3xl p-10 text-center max-w-lg w-full border border-gray-700/50 transition-transform duration-200"
      >
        {/* Image */}
        {/* <img
          src="https://illustrations.popsy.co/gray/web-error.svg"
          alt="404 illustration"
          className="w-72 mx-auto mb-6 animate-float"
        /> */}

        {/* Title */}
        <h1 className="text-7xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-100 bg-clip-text text-transparent mb-4">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-white mb-2">
          Page Not Found
        </h2>

        <p className="text-gray-300 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/"
            className="px-6 py-3 rounded-2xl bg-red-600 text-white shadow-lg hover:bg-red-700 transition duration-300"
          >
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-2xl bg-gray-700 hover:bg-gray-600 text-white shadow-md transition duration-300"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Floating Animation */}
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
