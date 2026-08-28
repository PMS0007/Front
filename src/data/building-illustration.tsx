export function BuildingIllustration() {
  return (
    <svg
      width="200"
      height="220"
      viewBox="0 0 200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >

      <line x1="100" y1="8" x2="100" y2="42" stroke="#f2b90c" strokeWidth="1.5" />
      <path d="M100 10 L124 18 L100 26 Z" fill="#f2b90c" />

      <path
        d="M15 88 L100 36 L185 88 Z"
        fill="#16233f"
        stroke="#32456e"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <line x1="40" y1="76" x2="160" y2="76" stroke="#f2b90c" strokeOpacity="0.5" />

 
      <rect x="26" y="88" width="148" height="108" fill="#0e1626" stroke="#243254" strokeWidth="1.5" />


      {[52, 82, 118, 148].map((x, i) => (
        <g key={i}>
          <path
            d={`M${x - 11} 118 a11 11 0 0 1 22 0`}
            stroke="#32456e"
            strokeWidth="1.5"
            fill="none"
          />
          <rect x={x - 13} y="108" width="26" height="34" fill="#f2b90c" fillOpacity="0.85" />
        </g>
      ))}


      <rect x="38" y="152" width="22" height="22" fill="#f2b90c" fillOpacity="0.85" />
      <rect x="140" y="152" width="22" height="22" fill="#f2b90c" fillOpacity="0.85" />


      <rect x="70" y="140" width="3.5" height="13" fill="#f2b90c" />
      <rect x="127" y="140" width="3.5" height="13" fill="#f2b90c" />


      <rect x="85" y="146" width="30" height="50" rx="15" fill="#16233f" stroke="#32456e" strokeWidth="1.5" />
      <circle cx="95" cy="171" r="1.6" fill="#f2b90c" />
      <circle cx="105" cy="171" r="1.6" fill="#f2b90c" />

      <rect x="14" y="196" width="172" height="7" fill="#0a1120" />
    </svg>
  );
}