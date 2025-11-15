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

  const [copyStatus, setCopyStatus] = useState(""); // For user feedback

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

  // Detect if user is on mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  async function handleDownload() {
    try {
      const node = exportRef.current;
      if (!node) return;

      const blob = await htmlToImage.toBlob(node, { pixelRatio: 2 });
      if (!blob) return;

      // For mobile devices, use the share API if available
      if (isMobile && navigator.share && navigator.canShare({ files: [new File([blob], "intuition-card.png", { type: "image/png" })] })) {
        const file = new File([blob], "intuition-card.png", { type: "image/png" });
        
        try {
          await navigator.share({
            files: [file],
            title: "My Intuition PnL Card",
            text: "Check out my $TRUST gains!"
          });
          return; // Share successful, exit function
        } catch (shareError) {
          // User cancelled share or it failed, fall through to download
          console.log("Share cancelled or failed, falling back to download");
        }
      }

      // Fallback: Standard download for desktop or if share fails
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "intuition-card.png";
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed. Please try again.");
    }
  }

  async function handleCopy() {
    try {
      const node = exportRef.current;
      if (!node) return;

      setCopyStatus("Copying...");

      const blob = await htmlToImage.toBlob(node, { pixelRatio: 2 });
      if (!blob) {
        setCopyStatus("Failed");
        setTimeout(() => setCopyStatus(""), 2000);
        return;
      }

      // Check if clipboard API is available
      if (navigator.clipboard && ClipboardItem) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setCopyStatus("Copied! ✓");
          setTimeout(() => setCopyStatus(""), 2000);
        } catch (clipError) {
          console.error("Clipboard write failed:", clipError);
          // If clipboard fails on mobile, offer to download instead
          if (isMobile) {
            setCopyStatus("Copy not supported - downloading instead...");
            setTimeout(() => setCopyStatus(""), 2000);
            
            // Trigger download as fallback
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = "intuition-card.png";
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
          } else {
            setCopyStatus("Copy failed");
            setTimeout(() => setCopyStatus(""), 2000);
          }
        }
      } else {
        // Clipboard API not available - on mobile, offer download instead
        if (isMobile) {
          setCopyStatus("Copy not available - downloading instead...");
          setTimeout(() => setCopyStatus(""), 3000);
          
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = "intuition-card.png";
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        } else {
          alert("Copy to clipboard is not supported in this browser. Use the download button instead.");
          setCopyStatus("");
        }
      }
    } catch (error) {
      console.error("Copy error:", error);
      setCopyStatus("Error");
      setTimeout(() => setCopyStatus(""), 2000);
    }
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
          {isMobile ? "📥 Save to Photos" : "Download PNG"}
        </button>

        <button className="btn btn-secondary" onClick={handleCopy}>
          {copyStatus || (isMobile ? "📋 Copy Image" : "Copy Image")}
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
