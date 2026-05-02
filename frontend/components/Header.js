import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Image from 'next/image';

export default function Header() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuctionPage = router.pathname === '/';

  const navItems = [
    { label: 'Auction Live', href: '/', icon: '' },
    { label: 'Players List', href: '/players', icon: '' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${
      isAuctionPage 
        ? 'bg-slate-950/20 backdrop-blur-md border-white/5' 
        : 'bg-slate-950/80 backdrop-blur-2xl border-white/10'
    }`}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* <CricketLogo /> */}
            <Image src="/logo.png" alt="N.P. Trophy Logo" width={45} height={0} className="rounded-full" />
            <div className="flex flex-col">
              <h1 className="font-black text-sm md:text-base tracking-tighter leading-none text-white uppercase italic">
                Birla <span className="text-yellow-500">&</span> Pravin
              </h1>
              <p className="text-[8px] md:text-[9px] font-bold tracking-[0.2em] text-white/40 uppercase">
                Turf Premier League · 2026
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map(item => {
              const isActive = router.pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                  className={`relative flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 uppercase border ${
                    isActive 
                      ? 'bg-yellow-500 border-yellow-500 text-black shadow-[0_10px_20px_rgba(234,179,8,0.2)]' 
                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-xs">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-yellow-500"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              {mobileOpen ? <path d="M6 18L18 6M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
            </svg>
          </button>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-3 pb-3 space-y-2 animate-in fade-in slide-in-from-top-2">
            {navItems.map(item => (
              <Link key={item.href} href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-5 py-4 rounded-xl text-[10px] font-black tracking-widest uppercase border ${
                  router.pathname === item.href 
                    ? 'bg-yellow-500 text-black border-yellow-500' 
                    : 'bg-white/5 text-white/60 border-white/10'
                }`}
              >
                <span>{item.label}</span>
                <span>{item.icon}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}