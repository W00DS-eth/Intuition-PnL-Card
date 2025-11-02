import bg from "../assets/card-bg.png";
import logo from "../assets/logo.png";

export default function Card({
  title = "Oddsgibs intuition use case",
  pnl = "+107.25",
  currentValue = "204.35",
  totalBought = "97.1",
  shares = "5.06",
  ownership = "22.34%",
}) {
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
      {/* LOGO (png) */}
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
          letterSpacing: "0em",
          textTransform: "uppercase",
        }}
      >
        Support Position
      </div>

      {/* ITEM TITLE (dynamic) */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 116,
          width: 244,
          height: 23,
          fontWeight: 400,
          fontSize: 18,
          lineHeight: "18px",
          color: "#FFFFFF",
          textAlign: "left",
        }}
      >
        {title}
      </div>

      {/* BIG PNL (dynamic) */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 160,
          width: 170,
          height: 29,
          fontWeight: 700,
          fontSize: 46,
          lineHeight: "46px",
          color: "#45FF80",
          letterSpacing: "0.03em",
        }}
      >
        {pnl}
      </div>

      {/* $TRUST (PnL) LABEL */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 205,
          width: 1250,
          height: 23,
          fontWeight: 400,
          fontSize: 18,
          lineHeight: "18px",
          color: "#FFFFFF",
          letterSpacing: "0em",
          textTransform: "uppercase",
        }}
      >
        $TRUST (PnL)
      </div>

      {/* CURRENT VALUE (label) */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 245,
          width: 1510,
          height: 23,
          fontWeight: 400,
          fontSize: 18,
          lineHeight: "18px",
          color: "#AAAAAA",
          letterSpacing: "0em",
          textTransform: "uppercase",
        }}
      >
        Current Value
      </div>

      {/* CURRENT VALUE (value) */}
      <div
        style={{
          position: "absolute",
          left: 238,
          top: 246,
          width: 62,
          height: 23,
          fontWeight: 400,
          fontSize: 18,
          lineHeight: "18px",
          color: "#FFFFFF",
          textAlign: "right",
        }}
      >
        {currentValue}
      </div>

      {/* TOTAL BOUGHT (label) */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 278,
          width: 1420,
          height: 23,
          fontWeight: 400,
          fontSize: 18,
          lineHeight: "18px",
          color: "#AAAAAA",
          letterSpacing: "0em",
          textTransform: "uppercase",
        }}
      >
        Total Bought
      </div>

      {/* TOTAL BOUGHT (value) */}
      <div
        style={{
          position: "absolute",
          left: 260,
          top: 278,
          width: 40,
          height: 23,
          fontWeight: 400,
          fontSize: 18,
          lineHeight: "18px",
          color: "#FFFFFF",
          textAlign: "right",
        }}
      >
        {totalBought}
      </div>

      {/* SHARES (label) */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 314,
          width: 74,
          height: 23,
          fontWeight: 400,
          fontSize: 18,
          lineHeight: "18px",
          color: "#AAAAAA",
          letterSpacing: "0em",
          textTransform: "uppercase",
        }}
      >
        Shares
      </div>

      {/* SHARES (value) */}
      <div
        style={{
          position: "absolute",
          left: 260,
          top: 314,
          width: 40,
          height: 23,
          fontWeight: 400,
          fontSize: 18,
          lineHeight: "18px",
          color: "#FFFFFF",
          textAlign: "right",
        }}
      >
        {shares}
      </div>

      {/* OWNERSHIP (label) */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 351,
          width: 114,
          height: 23,
          fontWeight: 400,
          fontSize: 18,
          lineHeight: "18px",
          color: "#AAAAAA",
          letterSpacing: "0em",
          textTransform: "uppercase",
        }}
      >
        Ownership
      </div>

      {/* OWNERSHIP (value) */}
      <div
        style={{
          position: "absolute",
          left: 230,
          top: 351,
          width: 70,
          height: 23,
          fontWeight: 400,
          fontSize: 18,
          lineHeight: "18px",
          color: "#FFFFFF",
          textAlign: "right",
        }}
      >
        {ownership}
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
          letterSpacing: "0em",
          textTransform: "uppercase",
          textAlign: "left",
        }}
      >
        $TRUST The Process
      </div>
    </div>
  );
}
