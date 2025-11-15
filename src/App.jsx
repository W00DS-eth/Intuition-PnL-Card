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
    <div className="app-container">
      {/* LEFT PANEL */}
      <div className="controls-panel">
        <h2 className="panel-title">Flex your $TRUST</h2>

        <label className="input-label">
          Title:
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="input-field"
          />
        </label>

        <label className="input-label">
          Current Value:
          <input
            name="currentValue"
            value={form.currentValue}
            onChange={handleChange}
            inputMode="decimal"
            className="input-field"
          />
        </label>

        <label className="input-label">
          Total Bought:
          <input
            name="totalBought"
            value={form.totalBought}
            onChange={handleChange}
            inputMode="decimal"
            className="input-field"
          />
        </label>

        <div className="info-text">
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
      <div className="card-preview">
        <ResponsiveCard data={form} />
      </div>

      {/* HIDDEN EXPORT */}
      <div className="export-container">
        <div ref={exportRef}>
          <Card {...form} />
        </div>
      </div>
    </div>
  );
}
