"use client"
import { useState, useEffect } from 'react';
import { RegisterLink } from '@kinde-oss/kinde-auth-nextjs';
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs';
const PremiumLanding = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Using a premium black and white image
  const bgImageUrl = "https://www.masaischool.com/blog/content/images/2023/03/Scholarship-distribution-3.JPG";

  useEffect(() => {
    const img = new Image();
    img.src = bgImageUrl;
    img.onload = () => {
      setImageLoaded(true);
    };
  }, [bgImageUrl]);

  return (
    <div className="relative min-h-screen bg-black">
      {/* Navbar */}
      <nav className="absolute top-0 z-50 w-full px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-white text-xl font-light tracking-[0.2em]">LEVEL UP</span>
          <LoginLink>
          <button className="px-6 py-2 text-sm text-white border border-white/20 rounded-full 
            hover:bg-white hover:text-black transition-all duration-300">
            Sign In
          </button>
              </LoginLink>
        </div>
      </nav>

      {/* Background with noise texture overlay */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
          imageLoaded ? 'opacity-40' : 'opacity-0'
        }`}
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      />
      
      {/* Noise overlay for texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj4NCjxmaWx0ZXIgaWQ9ImEiIHg9IjAiIHk9IjAiPg0KPGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPg0KPC9maWx0ZXI+DQo8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIwLjA1Ii8+DQo8L3N2Zz4=')] opacity-50" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight">
            Elevate Your
            <span className="block mt-2 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
              Potential
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Experience excellence through our premium platform designed for those who demand nothing but the finest in personal development.
          </p>

          {/* CTA Button */}
          <div 
            className="inline-block group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <RegisterLink>
            <button className={`
              relative overflow-hidden px-12 py-5 bg-white text-black 
              rounded-full font-medium text-lg transition-all duration-500
              hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]
              ${isHovered ? 'tracking-widest' : 'tracking-wide'}
            `}>
              <span className="relative z-10">BEGIN YOUR JOURNEY</span>
              <div className={`
                absolute inset-0 bg-black transition-transform duration-500
                ${isHovered ? 'translate-y-0' : 'translate-y-full'}
              `}/>
              <span className={`
                absolute inset-1 flex items-center justify-center text-white 
                ${isHovered ? 'translate-y-0' : 'translate-y-full'}
                `}>SIGNUP</span>
            </button>
                </RegisterLink>
          </div>
        </div>

        {/* Bottom Accent */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] 
        bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:30px_30px]" />
    </div>
  );
};

export default PremiumLanding;