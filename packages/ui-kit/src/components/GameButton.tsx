import React from 'react'

export interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
}

export const GameButton: React.FC<GameButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = "px-6 py-2.5 rounded font-bold uppercase tracking-wider text-sm transition-all duration-200"
  const styles = variant === 'primary' 
    ? 'bg-[#6c47ff] hover:bg-[#8b5cf6] text-white shadow-lg shadow-indigo-500/30'
    : variant === 'danger'
    ? 'bg-red-600 hover:bg-red-500 text-white'
    : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600'

  return <button className={`${base} ${styles} ${className}`} {...props}>{children}</button>
}