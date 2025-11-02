// src/components/ResponsiveCard.jsx
import Card from "./Card.jsx";

export default function ResponsiveCard({ data }) {
  // we keep a fixed wrapper, but you can scale it down with CSS media queries later
  return (
    <div
      style={{
        width: 347,
        height: 419,
      }}
    >
      <Card {...data} />
    </div>
  );
}
