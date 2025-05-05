import React, { useEffect, useState } from "react";

const Hero = () => {
  const [brightness, setBrightness] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 300;
      const brightnessValue = Math.max(0.4, 1 - scrollY / maxScroll);
      setBrightness(brightnessValue);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="wrapper">
    <section
      className="hero-section"
      style={{ filter: `brightness(${brightness})` }}
    >
      <h3>Leading investment platform</h3>
      <h1 style={{ color: 'white' }}>Invest in your future</h1>
      <button className="hero-button">Start a campaign</button>
    </section>
    </div>
  );
};

export default Hero;