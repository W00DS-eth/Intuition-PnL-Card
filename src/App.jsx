import { useRef, useState } from "react";
import Card from "./components/Card.jsx";
import ResponsiveCard from "./components/ResponsiveCard.jsx";
import * as htmlToImage from "html-to-image";

function App() {
  const [form, setForm] = useState({
    title: "Oddsgibs intuition use case",
    pnl: "+107.25",
    currentValue: "204.35",
    totalBought: "97.1",
    shares: "5.06",
    ownership: "22.34%",
  });

  // ref to the REAL, unscaled card (for download/copy)
  const exportRef = useRef(null);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleDownload() {
    const node = exportRef.current;
    if (!node) return;

    try {
      const dataUrl = await htmlToImage.toPng(node, {
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = "intuition-card.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("download failed", err);
    }
  }

  async function handleCopy() {
    const node = exportRef.current;
    if (!node) return;

    try {
      const blob = await htmlToImage.toBlob(node, {
        pixelRatio: 2,
      });
      if (!blob) return;

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);

      alert("Card copied to clipboard! Paste it into Twitter/X.");
    } catch (err) {
      console.error("copy failed", err);
      alert("Copy failed in this browser — try Download PNG instead.");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "sans-serif",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        gap: "50px",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* LEFT PANEL: FORM + BUTTONS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "300px",
          width: "100%",
          padding: "20px",
          background: "rgba(20,20,20,0.6)",
          borderRadius: "10px",
        }}
      >
        <h2 style={{ color: "#45FF80", marginBottom: "6px" }}>Create Card</h2>

        {/* inputs */}
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
          PnL:
          <input
            name="pnl"
            value={form.pnl}
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
            style={inputStyle}
          />
        </label>

        <label style={{ fontSize: 14 }}>
          Total Bought:
          <input
            name="totalBought"
            value={form.totalBought}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        <label style={{ fontSize: 14 }}>
          Shares:
          <input
            name="shares"
            value={form.shares}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        <label style={{ fontSize: 14 }}>
          Ownership:
          <input
            name="ownership"
            value={form.ownership}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        <button
          onClick={handleDownload}
          style={{
            marginTop: "10px",
            background: "#45FF80",
            border: "none",
            padding: "8px 10px",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Download PNG
        </button>

        <button
          onClick={handleCopy}
          style={{
            background: "#ffffff11",
            border: "1px solid #45FF80",
            padding: "8px 10px",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Copy Image
        </button>
      </div>

      {/* RIGHT PANEL: visible, normal card (can be scaled later) */}
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

      {/* HIDDEN real-size card for exporting */}
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
  borderRadius: "4px",
  border: "1px solid #333",
  backgroundColor: "#111",
  color: "#fff",
  fontSize: "14px",
};

export default App;
