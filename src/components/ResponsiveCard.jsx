import Card from "./Card.jsx";
import { useState, useEffect } from "react";

export default function ResponsiveCard({ data }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const containerWidth = window.innerWidth - 40; // account for padding
      const cardWidth = 347;
      
      if (containerWidth < cardWidth) {
        setScale(containerWidth / cardWidth);
      } else {
        setScale(1);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div
      style={{
        width: 347,
        height: 419,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        transition: "transform 0.3s ease",
      }}
    >
      <Card {...data} />
    </div>
  );
}
