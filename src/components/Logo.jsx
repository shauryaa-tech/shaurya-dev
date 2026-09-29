import React from "react";
import { useSiteContent } from "../site-content";

export const Logo = ({ size = 38 }) => {
  const { site } = useSiteContent();
  const cyan = site.theme.cyan;
  const violet = site.theme.violet;
  return (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-label="SPS logo">
    <defs>
      <filter id="lg" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="1.6" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width="48" height="48" rx="12" fill="#0B0F19" stroke="rgba(255,255,255,0.1)" />
    <path
      d="M32 14C30 9 16 9 16 18c0 9 16 9 16 16 0 7-14 7-17 1"
      fill="none"
      stroke={cyan}
      strokeWidth="3.4"
      strokeLinecap="round"
      filter="url(#lg)"
    />
    <circle cx="32" cy="14" r="3.2" fill={violet} filter="url(#lg)" />
    <circle cx="15" cy="35" r="3.2" fill={cyan} filter="url(#lg)" />
  </svg>
  );
};

export default Logo;
