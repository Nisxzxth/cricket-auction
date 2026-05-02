import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { playerAPI } from '../lib/api';
import toast from 'react-hot-toast';

const PROF_COLORS = {
  Batsman: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  Bowler: { color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
  'All-rounder': { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  'Wicket-keeper': { color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
};

function PlayerTable({ players, type }) {
  if (!players.length) {
    return (
      <div className="text-center py-20 bg-white/5 rounded-[30px] border border-dashed border-white/10">
        <div className="text-5xl mb-4 opacity-30">
          {type === 'sold' ? '🔨' : '⏳'}
        </div>
        <p className="font-black text-xl text-white/20 tracking-[0.2em] uppercase">
          No {type} Players Found
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-md">
      {/* MIN WIDTH prevents column collapse on mobile */}
      <div className="min-w-[720px]">

        {/* Header */}
        <div className="grid grid-cols-5 gap-2 bg-white/5 border-b border-white/10">
          {['#', 'PLAYER NAME', 'TYPE', 'BASE', type === 'sold' ? 'SOLD' : 'STATUS'].map((h, i) => (
            <div
              key={i}
              className="px-6 py-4 text-[10px] font-black text-white/40 tracking-[0.2em]"
            >
              {h}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="divide-y divide-white/5">
          {players.map((player) => {
            const prof = PROF_COLORS[player.proficiency] || {
              color: '#fbbf24',
              bg: 'rgba(251,191,36,0.05)',
            };

            return (
              <div
                key={player._id}
                className="grid grid-cols-5 gap-2 hover:bg-white/[0.02] transition-colors group"
              >
                <div className="px-6 py-5 flex items-center font-black text-yellow-500/50 italic">
                  {String(player.playerNumber).padStart(2, '0')}
                </div>

                <div className="px-6 py-5 flex items-center">
                  <span className="font-bold text-white group-hover:text-yellow-500 transition-colors uppercase">
                    {player.name}
                  </span>
                </div>

                <div className="px-6 py-5 flex items-center">
                  <span
                    className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border"
                    style={{
                      background: prof.bg,
                      color: prof.color,
                      borderColor: `${prof.color}30`,
                    }}
                  >
                    {player.proficiency}
                  </span>
                </div>

                <div className="px-6 py-5 flex items-center font-bold text-white/60">
                  ₹{player.basePrice}
                </div>

                <div className="px-6 py-5 flex items-center">
                  {type === 'sold' ? (
                    <span className="font-black text-green-500">
                      ₹{player.soldPrice || player.basePrice}
                    </span>
                  ) : (
                    <span className="text-[10px] font-black text-white/40 tracking-widest uppercase">
                      AVAILABLE
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sold');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await playerAPI.getAll();
        setPlayers(res.data.data);
      } catch {
        toast.error("Database connection failed");
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const soldPlayers = players.filter(p => p.status === 'Sold');
  const unsoldPlayers = players.filter(p => p.status === 'Unsold');

  const handleDownload = () => {
    setDownloading(true);
    try {
      playerAPI.downloadExcel();
      toast.success('Generating Export...');
    } catch {
      toast.error('Export failed');
    } finally {
      setTimeout(() => setDownloading(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 pt-24 md:pt-12 md:p-12">
      <Head>
        <title>Players list </title>
      </Head>

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <Link
              href="/"
              className="text-yellow-500 font-black text-[10px] tracking-[0.3em] uppercase hover:opacity-70 flex items-center gap-2 mb-4"
            >
              ← Back to Auction
            </Link>

            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">
              Players <span className="text-yellow-500">List</span>
            </h1>

            <p className="text-white/30 font-bold tracking-[0.2em] text-xs mt-2 uppercase">
              Birla & Pravin Turf Premier League · 2026
            </p>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading || players.length === 0}
            className="w-full md:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:border-green-500/50 hover:bg-green-500/5 text-green-500 rounded-2xl font-black text-xs tracking-widest uppercase"
          >
            {downloading ? "Exporting..." : "Download Excel"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Pool', val: players.length },
            { label: 'Sold', val: soldPlayers.length },
            { label: 'Unsold', val: unsoldPlayers.length },
            {
              label: 'Total Value',
              val: `₹${soldPlayers.reduce(
                (acc, p) => acc + (p.soldPrice || p.basePrice),
                0
              )}`,
            },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-1">
                {s.label}
              </p>
              <p className="text-2xl font-black tracking-tighter text-white">
                {s.val}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 w-fit mb-6">
          <button
            onClick={() => setActiveTab('sold')}
            className={`px-8 py-3 rounded-xl font-black text-xs uppercase ${
              activeTab === 'sold'
                ? 'bg-yellow-500 text-black'
                : 'text-white/40'
            }`}
          >
            Sold ({soldPlayers.length})
          </button>

          <button
            onClick={() => setActiveTab('unsold')}
            className={`px-8 py-3 rounded-xl font-black text-xs uppercase ${
              activeTab === 'unsold'
                ? 'bg-yellow-500 text-black'
                : 'text-white/40'
            }`}
          >
            Unsold ({unsoldPlayers.length})
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-20 text-center text-white/20 font-black tracking-widest">
            LOADING DATABASE...
          </div>
        ) : (
          <PlayerTable
            players={activeTab === 'sold' ? soldPlayers : unsoldPlayers}
            type={activeTab}
          />
        )}
      </div>
    </div>
  );
}