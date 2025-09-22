import "./Card3D.css";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const Card3D = ({
  imageSrc,
}) => {
  const cardRef = useRef(null);
  const animationRef = useRef(null);

  const settings = {
    maxRotation: 15,
    minRotation: 1,
    maxDistance: 100,
    smoothness: 0.005,
  };
  var timeout = null;
  const [currentRotation, setCurrentRotation] = useState({ x: 0, y: 0 });
  const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0 });
  const [isMouseOverCard, setIsMouseOverCard] = useState(false);
  const [cardCenter, setCardCenter] = useState({ x: 0, y: 0 });

  const calculateDistance = useCallback(
    (mouseX, mouseY, cardCenterX, cardCenterY) => {
      const dx = mouseX - cardCenterX;
      const dy = mouseY - cardCenterY;
      return Math.sqrt(dx * dx + dy * dy);
    },
    []
  );

  const getRotationIntensity = useCallback(
    (distance) => {
      const normalizedDistance = Math.min(distance / settings.maxDistance, 1);
      const easedDistance = Math.pow(normalizedDistance, 0.7);
      return (
        settings.minRotation +
        (settings.maxRotation - settings.minRotation) * easedDistance
      );
    },
    [settings]
  );

  const lerp = useCallback((start, end, factor) => {
    return start + (end - start) * factor;
  }, []);

  const updateCardCenter = useCallback(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setCardCenter({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isMouseOverCard || !cardRef.current) return;

      const distance = calculateDistance(
        e.clientX,
        e.clientY,
        cardCenter.x,
        cardCenter.y
      );
      const rotationIntensity = getRotationIntensity(distance);

      const rect = cardRef.current.getBoundingClientRect();
      let posX = e.clientX - cardCenter.x;
      let posY = e.clientY - cardCenter.y;
      posX = posX > 300 ? 300 : posX;
      posX = posX < -300 ? -300 : posX;
      posY = posY > 300 ? 300 : posY;
      posY = posY < -300 ? -300 : posY;
      posX = posX > 0 ? -posX : posX * -1;
      // posY = posY > 0 ? -posY : posY * -1;
      const mouseX = posX / (rect.width / 2);
      const mouseY = posY / (rect.height / 2);

   
   setTargetRotation({
          x: -mouseY * rotationIntensity,
          y: mouseX * rotationIntensity,
        });

    },
    [isMouseOverCard, cardCenter, calculateDistance, getRotationIntensity]
  );

  const handleMouseEnter = useCallback(() => {
    setIsMouseOverCard(true);
    if (timeout) {
      clearTimeout(timeout);
 
      timeout = null;
    }
  }, [timeout]);

  const handleMouseLeave = useCallback(() => {
    timeout = setTimeout(() => {
      setIsMouseOverCard(false);
      setTargetRotation({ x: 0, y: 0 });
    }, 3000);

  }, []);

  const animate = useCallback(() => {
    setCurrentRotation((prev) => ({
      x: lerp(prev.x, targetRotation.x, settings.smoothness),
      y: lerp(prev.y, targetRotation.y, settings.smoothness),
    }));

    animationRef.current = requestAnimationFrame(animate);
  }, [targetRotation, lerp, settings.smoothness]);

  useEffect(() => {
    const rect = cardRef.current.getBoundingClientRect();
    setCardCenter({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    document.addEventListener("mousemove", handleMouseMove);

    animate();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleMouseMove, animate]);
  useEffect(() => {
    cardRef.current.addEventListener("mouseenter", handleMouseEnter);

    cardRef.current.addEventListener("mouseleave", handleMouseLeave);
  }, []);

  const cardStyle = {
    transform: `perspective(1000px) rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg)`,
  };
  return (
    <div ref={cardRef} className="card-3d" style={cardStyle}>
      <img src={imageSrc} className="card-3d__image" />
    </div>
  );
};

export default Card3D;
