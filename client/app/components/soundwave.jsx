import React, { useEffect } from "react";

export default function SoundWave() {
  useEffect(() => {
    const bars = document.querySelectorAll(".bar");
    bars.forEach((bar) => {
      bar.style.animationDuration = `${Math.random() * (0.7 - 0.2) + 0.2}s`;
    });
  }, []);

  return (
    <div className="sound-wave">
      {[...Array(480)].map((_, i) => (
        <div key={i} className="bar" />
      ))}
     <style jsx>{`
  .sound-wave {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 100%;
  }

  .bar {
    animation-name: wave-lg;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    animation-direction: alternate;
    background: #720d82;
    margin: 0 1.5px;
    height: 15px;
    width: 15px;
  }

  .bar:nth-child(-n + 7),
  .bar:nth-last-child(-n + 7) {
    animation-name: wave-md;
  }

  .bar:nth-child(-n + 3),
  .bar:nth-last-child(-n + 3) {
    animation-name: wave-sm;
  }

  @keyframes wave-sm {
    0% {
      opacity: 0.35;
      height: 30px;
    }
    100% {
      opacity: 1;
      height: 75px;
    }
  }

  @keyframes wave-md {
    0% {
      opacity: 0.35;
      height: 45px;
    }
    100% {
      opacity: 1;
      height: 150px;
    }
  }

  @keyframes wave-lg {
    0% {
      opacity: 0.35;
      height: 45px;
    }
    100% {
      opacity: 1;
      height: 210px;
    }
  }

  /* Add media query for mobile adjustments */
  @media (max-width: 600px) {
    .sound-wave {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 75px;
      align-items: flex-end;
    }

    .bar {
      height: 10px;
      width: 10px;
      margin: 0 1px;
    }
  }
`}</style>

    </div>
  );
}
