import bg from "../assets/card-bg.png";
import logo from "../assets/logo.png";

export default function Card({
  title = "Oddsgibs intuition use case",
  pnl = "+0.00",
  percentageChange = "+0.00%",
  currentValue = "",
  totalBought = "",
}) {
  // parse numeric values to determine color
  const pnlNum = parseFloat(String(pnl).replace(/[+,]/g, ""));
  const pctNum = parseFloat(String(percentageChange).replace(/[+,%]/g, ""));
  const green = "#45FF80";
  const red = "#FF4D4D";
  const pnlColor = isFinite(pnlNum) && pnlNum < 0 ? red : green;
  const pctColor = isFinite(pctNum) && pctNum < 0 ? red : green;

  return (
    <div
      style={{
        position: "relative",
        width: 347,
        height: 419,
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "sans-serif",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      {/* LOGO */}
      <img
        src={logo}
        alt="Logo"
        style={{
          position: "absolute",
          left: 52,
          top: 15,
          width: 248,
          height: 60,
          objectFit: "contain",
        }}
      />

      {/* SUPPORT POSITION */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 90,
          width: 1670,
          height: 23,
          fontWeight: 400,
          fontSize: 18,
          lineHeight: "18px",
          color: "#D0D0D0",
          textTransform: "uppercase",
        }}
      >
        Support Position
      </div>

      {/* ITEM TITLE */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 116,
          width: 244,
          fontWeight: 400,
          fontSize: 18,
          lineHeight: "22px",
          color: "#FFFFFF",
          textAlign: "left",
          whiteSpace: "normal",
          wordWrap: "break-word",
          overflow: "hidden",
          maxHeight: "60px",
        }}
      >
        {title}
      </div>

      {/* BIG PNL */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 160,
          width: 170,
          height: 46,
          fontWeight: 700,
          fontSize: 46,
          lineHeight: "46px",
          color: pnlColor,
          letterSpacing: "0em",
        }}
      >
        {pnl}
      </div>

      {/* % CHANGE */}
      <div
        style={{
          position: "absolute",
          left: 215,
          top: 185,
          width: 90,
          height: 23,
          fontWeight: 400,
          fontSize: 16,
          lineHeight: "18px",
          color: pctColor,
          textAlign: "right",
        }}
      >
        {percentageChange}
      </div>

      {/* $TRUST (PnL) */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 205,
          width: 125,
          height: 23,
          fontWeight: 400,
          fontSize: 18,
          lineHeight: "18px",
          color: "#FFFFFF",
          textTransform: "uppercase",
        }}
      >
        $TRUST (PnL)
      </div>

      {/* ---- DATA ROWS ---- */}

      {/* TOTAL BOUGHT */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 245,
          width: 160,
          fontWeight: 400,
          fontSize: 18,
          color: "#AAAAAA",
          textTransform: "uppercase",
        }}
      >
        Total Bought
      </div>
      <div
        style={{
          position: "absolute",
          right: 50, // anchor numerics to right edge
          top: 245,
          width: 90,
          textAlign: "right",
          fontWeight: 400,
          fontSize: 18,
          color: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        {totalBought}
      </div>

      {/* CURRENT VALUE */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 278,
          width: 160,
          fontWeight: 400,
          fontSize: 18,
          color: "#AAAAAA",
          textTransform: "uppercase",
        }}
      >
        Current Value
      </div>
      <div
        style={{
          position: "absolute",
          right: 50, // same right-edge alignment
          top: 278,
          width: 90,
          textAlign: "right",
          fontWeight: 400,
          fontSize: 18,
          color: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        {currentValue}
      </div>

      {/* TOTAL PROFIT */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 314,
          width: 160,
          fontWeight: 400,
          fontSize: 18,
          color: "#AAAAAA",
          textTransform: "uppercase",
        }}
      >
        Total Profit
      </div>
      <div
        style={{
          position: "absolute",
          right: 50, // perfect vertical alignment of last digits
          top: 314,
          width: 90,
          textAlign: "right",
          fontWeight: 400,
          fontSize: 18,
          color: pnlColor,
          overflow: "hidden",
        }}
      >
        {pnl}
      </div>

      {/* FOOTER */}
      <div
        style={{
          position: "absolute",
          left: 75,
          top: 385,
          width: 1840,
          height: 23,
          fontWeight: 400,
          fontSize: 18,
          lineHeight: "18px",
          color: "#FFFFFF",
          textTransform: "uppercase",
          textAlign: "left",
        }}
      >
        $TRUST The Process
      </div>
    </div>
  );
}
