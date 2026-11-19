export default function RetroBackground() {
  return (
    <div className="retro-bg" aria-hidden="true">
      <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges">
        <defs>
          <linearGradient id="rb-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#05070f" />
            <stop offset="55%" stopColor="#091426" />
            <stop offset="100%" stopColor="#10293b" />
          </linearGradient>
          <linearGradient id="rb-field" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f3d2a" />
            <stop offset="100%" stopColor="#082418" />
          </linearGradient>
          <radialGradient id="rb-glow" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" />
          </radialGradient>
          <pattern id="rb-stars" width="72" height="72" patternUnits="userSpaceOnUse">
            <rect x="7" y="9" width="1" height="1" fill="#dfeaff" opacity="0.7" />
            <rect x="31" y="21" width="2" height="1" fill="#cfe4ff" opacity="0.45" />
            <rect x="53" y="6" width="1" height="1" fill="#ffffff" opacity="0.55" />
            <rect x="16" y="47" width="1" height="2" fill="#bcd8ff" opacity="0.35" />
            <rect x="44" y="55" width="1" height="1" fill="#e9f4ff" opacity="0.55" />
            <rect x="63" y="38" width="2" height="1" fill="#bcd8ff" opacity="0.3" />
          </pattern>
          <pattern id="rb-crowd" width="7" height="6" patternUnits="userSpaceOnUse">
            <rect width="7" height="6" fill="#081120" />
            <rect x="1" y="1" width="2" height="2" fill="#243a57" opacity="0.85" />
            <rect x="5" y="3" width="1" height="1" fill="#345074" opacity="0.8" />
            <rect x="3" y="4" width="1" height="1" fill="#1c3048" opacity="0.9" />
            <rect x="6" y="0" width="1" height="1" fill="#3d5a80" opacity="0.6" />
          </pattern>
          <clipPath id="rb-field-clip">
            <ellipse cx="200" cy="252" rx="252" ry="112" />
          </clipPath>
        </defs>

        <rect width="400" height="240" fill="url(#rb-sky)" />
        <rect width="400" height="120" fill="url(#rb-stars)" />
        <rect width="400" height="140" fill="url(#rb-glow)" />

        {/* moon */}
        <g opacity="0.75">
          <rect x="312" y="28" width="16" height="2" fill="#dcecd2" />
          <rect x="309" y="30" width="22" height="10" fill="#dcecd2" />
          <rect x="312" y="40" width="16" height="2" fill="#dcecd2" />
          <rect x="319" y="31" width="7" height="8" fill="#091426" opacity="0.55" />
        </g>

        {/* floodlight towers */}
        <g>
          <rect x="28" y="34" width="3" height="78" fill="#1b2a3d" />
          <rect x="18" y="30" width="24" height="3" fill="#23364e" />
          <rect x="20" y="33" width="4" height="5" fill="#ffe9a8" opacity="0.9" />
          <rect x="28" y="33" width="4" height="5" fill="#ffe9a8" opacity="0.75" />
          <rect x="36" y="33" width="4" height="5" fill="#ffe9a8" opacity="0.9" />
          <rect x="369" y="34" width="3" height="78" fill="#1b2a3d" />
          <rect x="358" y="30" width="24" height="3" fill="#23364e" />
          <rect x="360" y="33" width="4" height="5" fill="#bfe8ff" opacity="0.9" />
          <rect x="368" y="33" width="4" height="5" fill="#bfe8ff" opacity="0.7" />
          <rect x="376" y="33" width="4" height="5" fill="#bfe8ff" opacity="0.9" />
          <polygon points="30,40 122,206 196,206" fill="#ffe9a8" opacity="0.045" />
          <polygon points="370,40 278,206 204,206" fill="#bfe8ff" opacity="0.04" />
        </g>

        {/* stands */}
        <path d="M0 150 Q100 128 200 127 Q300 128 400 150 L400 196 Q300 168 200 167 Q100 168 0 196 Z" fill="url(#rb-crowd)" opacity="0.95" />
        <path d="M0 158 Q100 137 200 136 Q300 137 400 158" fill="none" stroke="#2d4a6b" strokeWidth="2" opacity="0.65" />
        <rect x="0" y="186" width="400" height="3" fill="#1a2c42" opacity="0.8" />

        {/* field */}
        <ellipse cx="200" cy="252" rx="252" ry="112" fill="url(#rb-field)" />
        <g clipPath="url(#rb-field-clip)" opacity="0.55">
          <rect x="0" y="168" width="400" height="9" fill="#0c3524" />
          <rect x="0" y="186" width="400" height="9" fill="#0c3524" />
          <rect x="0" y="204" width="400" height="9" fill="#0c3524" />
          <rect x="0" y="222" width="400" height="9" fill="#0c3524" />
          <rect x="0" y="240" width="400" height="9" fill="#0c3524" />
        </g>
        <ellipse cx="200" cy="252" rx="232" ry="98" fill="none" stroke="#cfe6bd" strokeWidth="1.5" strokeDasharray="6 7" opacity="0.24" />

        {/* pitch */}
        <g opacity="0.68">
          <path d="M183 240 L217 240 L207 186 L193 186 Z" fill="#8f7247" />
          <path d="M186 240 L214 240 L205 186 L195 186 Z" fill="#a88956" opacity="0.65" />
          <rect x="190" y="190" width="20" height="1.5" fill="#f1e7cf" opacity="0.55" />
          <rect x="183" y="232" width="34" height="1.5" fill="#f1e7cf" opacity="0.55" />
          <rect x="199" y="191" width="1.5" height="42" fill="#6f5631" opacity="0.55" />

          {/* stumps + bails */}
          <g fill="#e8dfc6">
            <rect x="196" y="177" width="2" height="9" />
            <rect x="199" y="177" width="2" height="9" />
            <rect x="202" y="177" width="2" height="9" />
            <rect x="195" y="175" width="5" height="1.5" />
            <rect x="200" y="175" width="5" height="1.5" />
          </g>
          <rect x="194" y="187" width="12" height="1" fill="#0d3524" opacity="0.5" />

          {/* pixel cricket ball */}
          <g className="retro-ball" transform="translate(148 202)" shapeRendering="crispEdges">
            <g fill="#ff3b3b">
              <rect x="2" y="0" width="4" height="1" />
              <rect x="1" y="1" width="6" height="1" />
              <rect x="0" y="2" width="8" height="4" />
              <rect x="1" y="6" width="6" height="1" />
              <rect x="2" y="7" width="4" height="1" />
            </g>
            <g fill="#ffd9a0">
              <rect x="3" y="2" width="1" height="1" />
              <rect x="4" y="3" width="1" height="1" />
              <rect x="3" y="4" width="1" height="1" />
              <rect x="4" y="5" width="1" height="1" />
              <rect x="3" y="6" width="1" height="1" />
            </g>
          </g>
        </g>

        {/* boundary rope glow */}
        <ellipse cx="200" cy="252" rx="250" ry="110" fill="none" stroke="#8fd6a7" strokeWidth="1" opacity="0.12" />
      </svg>

      <div className="retro-beam retro-beam--left" />
      <div className="retro-beam retro-beam--right" />
      <div className="retro-grid" />
    </div>
  );
}
