import { useRef, useState, useEffect } from "react";
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import '@rainbow-me/rainbowkit/styles.css'

import Card from "./components/Card.jsx";
import ResponsiveCard from "./components/ResponsiveCard.jsx";
import WalletConnect from "./components/WalletConnect.jsx";
import PositionsTable from "./components/PositionsTable.jsx";
import { config } from './wagmi'
import * as htmlToImage from "html-to-image";

const queryClient = new QueryClient()

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

function AppContent() {
  const { address: connectedAddress } = useAccount()
  const [activeAddress, setActiveAddress] = useState(null)
  const [viewMode, setViewMode] = useState('manual') // 'manual' or 'blockchain'
  
  const [form, setForm] = useState({
    title: "Oddsgibs intuition use case",
    currentValue: "299.97",
    totalBought: "17.10",
    pnl: "+0.00",
    percentageChange: "+0.00%",
  });

  const [copyStatus, setCopyStatus] = useState("");

  // When wallet connects, set it as active address
  useEffect(() => {
    if (connectedAddress) {
      setActiveAddress(connectedAddress)
      setViewMode('blockchain')
    }
  }, [connectedAddress])

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

  function handleAddressChange(address) {
    setActiveAddress(address)
    setViewMode('blockchain')
  }

  function handleGenerateFromPosition(position) {
    setForm({
      title: position.name,
      currentValue: position.currentValue,
      totalBought: position.invested,
      pnl: position.pnl,
      percentageChange: position.percentageChange,
    })
    // Scroll to card generator
    document.querySelector('.card-generator')?.scrollIntoView({ behavior: 'smooth' })
  }

  const exportRef = useRef(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  async function handleDownload() {
    try {
      const node = exportRef.current;
      if (!node) return;

      const blob = await htmlToImage.toBlob(node, { pixelRatio: 2 });
      if (!blob) return;

      if (isMobile && navigator.share && navigator.canShare({ files: [new File([blob], "intuition-card.png", { type: "image/png" })] })) {
        const file = new File([blob], "intuition-card.png", { type: "image/png" });
        
        try {
          await navigator.share({
            files: [file],
            title: "My Intuition PnL Card",
            text: "Check out my $TRUST gains!"
          });
          return;
        } catch (shareError) {
          console.log("Share cancelled or failed, falling back to download");
        }
      }

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

      if (navigator.clipboard && ClipboardItem) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setCopyStatus("Copied! ✓");
          setTimeout(() => setCopyStatus(""), 2000);
        } catch (clipError) {
          console.error("Clipboard write failed:", clipError);
          if (isMobile) {
            setCopyStatus("Copy not supported - downloading instead...");
            setTimeout(() => setCopyStatus(""), 2000);
            
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
    <div className="app-container-blockchain">
      {/* Wallet Connect Bar */}
      <WalletConnect onAddressChange={handleAddressChange} />

      {/* View Mode Toggle */}
      <div className="view-mode-toggle">
        <button 
          className={`btn ${viewMode === 'blockchain' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setViewMode('blockchain')}
        >
          📊 My Positions
        </button>
        <button 
          className={`btn ${viewMode === 'manual' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setViewMode('manual')}
        >
          ✏️ Manual Card
        </button>
      </div>

      {/* Positions Table (Blockchain Mode) */}
      {viewMode === 'blockchain' && (
        <PositionsTable 
          address={activeAddress} 
          onGenerateCard={handleGenerateFromPosition}
        />
      )}

      {/* Card Generator */}
      <div className="card-generator">
        <div className="controls-panel">
          <h2 className="panel-title">
            {viewMode === 'blockchain' ? 'Selected Position Card' : 'Flex your $TRUST'}
          </h2>

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

        <div className="card-preview">
          <ResponsiveCard data={form} />
        </div>
      </div>

      {/* Hidden Export */}
      <div className="export-container">
        <div ref={exportRef}>
          <Card {...form} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AppContent />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
