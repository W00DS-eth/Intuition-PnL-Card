import { useRef, useState, useEffect } from "react";
import Card from "./components/Card.jsx";
import ResponsiveCard from "./components/ResponsiveCard.jsx";
import * as htmlToImage from "html-to-image";

function formatNumber(n, digits = 2) {
  const v = Number(n);
  if (!isFinite(v)) return "";
  return v.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
function formatSigned(n, digits = 2) {
  const v = Number(n);
  if (!isFinite(v)) return "";
  const sign = v > 0 ? "+" : v < 0 ? "" : "";
  return sign + formatNumber(v, digits);
}
function computeDerived(currentValue, totalBought) {
  const cv = parseFloat(currentValue);
  const tb = parseFloat(totalBought);
  if (!isFinite(cv) || !isFinite(tb)) return { pnl: "", percentageChange: "" };

  const pnl = cv - tb;
  const pct = tb === 0 ? 0 : (pnl / tb) * 100;

  return {
    pnl: formatSigned(pnl, 2),
    percentageChange: formatSigned(pct, 2) + "%",
  };
}

export default function App() {
  const [form, setForm] = useState({
    title: "Oddsgibs intuition use case",
    currentValue: "299.97",
    totalBought: "17.10",
    pnl: "+0.00",
    percentageChange: "+0.00%",
  });

  useEffect(() => {
    const { pnl, percentageChange } = computeDerived(
      form.currentValue,
      form.totalBought
    );
    setForm((f) => ({ ...f, pnl, percentageChange }));
  }, [form.currentValue, form.totalBought]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  const exportRef = useRef(null);

  async function handleDownload() {
    const node = exportRef.current;
    if (!node) return;
    const dataUrl = await htmlToImage.toPng(node, { pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "intuition-card.png";
    link.href = dataUrl;
    link.click();
  }

  async function handleCopy() {
    const node = exportRef.current;
    if (!node) return;
    const blob = await htmlToImage.toBlob(node, { pixelRatio: 2 });
    if (!blob) return;
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
    alert("Card copied to clipboard! Paste it into Twitter/X.");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        fontFamily: "sans-serif",
        width: "100vw",
        minHeight: "100vh",
        gap: "50px",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* LEFT PANEL */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "300px",
          width: "100%",
          padding: "20px",
          background: "rgba(0,0,0,0.6)",
          borderRadius: "10px",
          backdropFilter: "blur(4px)",
        }}
      >
        <h2
          style={{
            color: "#fff",
          marginBottom: "6px",
          textShadow: "0 0 6px rgba(69, 255, 128, 0.6)",
        }}
      >
        Flex your $TRUST
      </h2>

        <label style={{ fontSize: 14 }}>
          Title:
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        <label style={{ fontSize: 14 }}>
          Current Value:
          <input
            name="currentValue"
            value={form.currentValue}
            onChange={handleChange}
            inputMode="decimal"
            style={inputStyle}
          />
        </label>

        <label style={{ fontSize: 14 }}>
          Total Bought:
          <input
            name="totalBought"
            value={form.totalBought}
            onChange={handleChange}
            inputMode="decimal"
            style={inputStyle}
          />
        </label>

        <div style={{ fontSize: 12, color: "#bbb" }}>
          PnL and % change are calculated automatically.
        </div>

        <button className="btn btn-primary" onClick={handleDownload}>
          Download PNG
        </button>

        <button className="btn btn-secondary" onClick={handleCopy}>
          Copy Image
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ResponsiveCard data={form} />
      </div>

      {/* HIDDEN EXPORT */}
      <div
        style={{
          position: "fixed",
          top: -9999,
          left: -9999,
          width: 347,
          height: 419,
        }}
      >
        <div ref={exportRef}>
          <Card {...form} />
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginTop: "4px",
  marginBottom: "6px",
  borderRadius: "6px",
  border: "1px solid #333",
  backgroundColor: "#111",
  color: "#fff",
  fontSize: "14px",
};
