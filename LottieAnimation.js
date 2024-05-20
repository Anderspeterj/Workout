// LottieAnimation.js
import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import animationData from '../Workout/assets/animations/bear-drinking-tea.json'; // Adjust the path as needed

const LottieAnimation = () => {
  const animationContainer = useRef(null);

  useEffect(() => {
    lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData, // use the imported animation data
    });
  }, []);

  return <div ref={animationContainer} style={{ width: 200, height: 200 }} />;
};

export default LottieAnimation;
