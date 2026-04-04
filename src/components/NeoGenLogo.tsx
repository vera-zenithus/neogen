import React from 'react'

interface NeoGenLogoProps {
  size?: number
  className?: string
}

export const NeoGenIcon: React.FC<NeoGenLogoProps> = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="ng-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#14b8a6" />
      </linearGradient>
    </defs>
    {/* Rounded square background */}
    <rect width="32" height="32" rx="8" fill="url(#ng-grad)" />
    {/* T-account: top horizontal line */}
    <rect x="6" y="9" width="20" height="2.5" rx="1.25" fill="white" />
    {/* T-account: vertical line (center) */}
    <rect x="14.75" y="9" width="2.5" height="15" rx="1.25" fill="white" />
    {/* AI dot: top right accent */}
    <circle cx="25" cy="7" r="2.5" fill="white" fillOpacity="0.9" />
  </svg>
)

export const NeoGenWordmark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`font-bold text-lg tracking-tight flex items-center gap-0 ${className}`}>
    <a href="https://neogenworld.com" className="text-cyan-400 hover:opacity-80 transition-opacity">Neo</a>
    <span className="mx-1.5 w-px h-4 bg-cyan-400/70 inline-block" />
    <a href="/app" className="text-white hover:opacity-80 transition-opacity">Gen</a>
  </span>
)

const NeoGenLogo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <div className="flex items-center gap-2.5">
    <NeoGenIcon size={size} />
    <NeoGenWordmark />
  </div>
)

export default NeoGenLogo
