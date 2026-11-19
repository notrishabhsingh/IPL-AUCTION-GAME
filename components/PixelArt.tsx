type IconProps = {
  className?: string;
};

function Svg({
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function PixelBall({ className }: IconProps) {
  return (
    <Svg className={className}>
      <g fill="#ff3b3b">
        <rect x="5" y="1" width="6" height="1" />
        <rect x="3" y="2" width="10" height="1" />
        <rect x="2" y="3" width="12" height="1" />
        <rect x="1" y="4" width="14" height="8" />
        <rect x="2" y="12" width="12" height="1" />
        <rect x="3" y="13" width="10" height="1" />
        <rect x="5" y="14" width="6" height="1" />
      </g>
      <g fill="#7d1111" opacity="0.7">
        <rect x="1" y="10" width="2" height="2" />
        <rect x="13" y="10" width="2" height="2" />
        <rect x="3" y="12" width="3" height="1" />
        <rect x="10" y="12" width="3" height="1" />
      </g>
      <g fill="#ffd9a0">
        <rect x="7" y="2" width="2" height="1" />
        <rect x="6" y="3" width="1" height="1" />
        <rect x="9" y="3" width="1" height="1" />
        <rect x="6" y="4" width="1" height="1" />
        <rect x="9" y="4" width="1" height="1" />
        <rect x="6" y="5" width="1" height="1" />
        <rect x="9" y="5" width="1" height="1" />
        <rect x="7" y="6" width="2" height="1" />
        <rect x="6" y="7" width="1" height="1" />
        <rect x="9" y="7" width="1" height="1" />
        <rect x="6" y="8" width="1" height="1" />
        <rect x="9" y="8" width="1" height="1" />
        <rect x="7" y="9" width="2" height="1" />
        <rect x="6" y="10" width="1" height="1" />
        <rect x="9" y="10" width="1" height="1" />
        <rect x="6" y="11" width="1" height="1" />
        <rect x="9" y="11" width="1" height="1" />
        <rect x="7" y="12" width="2" height="1" />
      </g>
    </Svg>
  );
}

export function PixelStumps({ className }: IconProps) {
  return (
    <Svg className={className}>
      <g fill="#f5ecd6">
        <rect x="2" y="4" width="2" height="11" />
        <rect x="7" y="4" width="2" height="11" />
        <rect x="12" y="4" width="2" height="11" />
        <rect x="1" y="2" width="4" height="2" />
        <rect x="6" y="2" width="4" height="2" />
        <rect x="11" y="2" width="4" height="2" />
      </g>
      <g fill="#b99c6a">
        <rect x="2" y="13" width="2" height="2" />
        <rect x="7" y="13" width="2" height="2" />
        <rect x="12" y="13" width="2" height="2" />
        <rect x="2" y="8" width="2" height="1" />
        <rect x="7" y="8" width="2" height="1" />
        <rect x="12" y="8" width="2" height="1" />
      </g>
    </Svg>
  );
}

export function PixelTrophy({ className }: IconProps) {
  return (
    <Svg className={className}>
      <g fill="#ffc14d">
        <rect x="3" y="1" width="10" height="2" />
        <rect x="2" y="3" width="12" height="4" />
        <rect x="4" y="7" width="8" height="2" />
        <rect x="6" y="9" width="4" height="2" />
        <rect x="4" y="11" width="8" height="2" />
        <rect x="3" y="13" width="10" height="2" />
      </g>
      <g fill="#ffe9a8">
        <rect x="3" y="2" width="2" height="3" />
        <rect x="5" y="4" width="1" height="2" />
        <rect x="10" y="4" width="1" height="2" />
      </g>
      <g fill="#b57a1c">
        <rect x="7" y="11" width="2" height="3" />
        <rect x="4" y="14" width="8" height="1" />
        <rect x="2" y="12" width="2" height="2" />
        <rect x="12" y="12" width="2" height="2" />
      </g>
    </Svg>
  );
}

export function PixelCoin({ className }: IconProps) {
  return (
    <Svg className={className}>
      <g fill="#ffc14d">
        <rect x="5" y="1" width="6" height="1" />
        <rect x="3" y="2" width="10" height="1" />
        <rect x="2" y="3" width="12" height="1" />
        <rect x="1" y="4" width="14" height="8" />
        <rect x="2" y="12" width="12" height="1" />
        <rect x="3" y="13" width="10" height="1" />
        <rect x="5" y="14" width="6" height="1" />
      </g>
      <g fill="#8a5a10">
        <rect x="5" y="5" width="6" height="1" />
        <rect x="4" y="6" width="2" height="4" />
        <rect x="10" y="6" width="2" height="4" />
        <rect x="5" y="10" width="6" height="1" />
      </g>
      <g fill="#ffe9a8">
        <rect x="3" y="3" width="2" height="2" />
        <rect x="11" y="3" width="2" height="2" />
      </g>
    </Svg>
  );
}

export function PixelBat({ className }: IconProps) {
  return (
    <Svg className={className}>
      <g fill="#c99554">
        <rect x="9" y="1" width="3" height="2" />
        <rect x="8" y="3" width="4" height="4" />
        <rect x="7" y="7" width="5" height="3" />
        <rect x="6" y="10" width="6" height="3" />
        <rect x="5" y="13" width="6" height="2" />
      </g>
      <g fill="#f5ecd6">
        <rect x="10" y="1" width="1" height="2" />
        <rect x="9" y="3" width="1" height="6" />
      </g>
      <g fill="#7d4a1c">
        <rect x="11" y="12" width="2" height="2" />
        <rect x="12" y="14" width="2" height="1" />
      </g>
    </Svg>
  );
}
