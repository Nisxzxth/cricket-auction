import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import PlayerCard from '../components/PlayerCard';
import SearchBar from '../components/SearchBar';
import { playerAPI } from '../lib/api';
import toast from 'react-hot-toast';

export default function AuctionPage() {
  const [players, setPlayers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [seeding, setSeeding] = useState(false);

  const fetchPlayers = useCallback(async () => {
    try {
      const res = await playerAPI.getAll();
      setPlayers(res.data.data);
      setFiltered(res.data.data);
    } catch (err) {
      console.log('Fetch error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  useEffect(() => {
    const result = players.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.playerNumber.toString() === search
    );
    setFiltered(result);
    setCurrentIndex(0);
  }, [search, players]);

  const handleNext = () => {
    if (filtered.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filtered.length);
  };

  const handlePrev = () => {
    if (filtered.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await playerAPI.seed();
      toast.success('Sample players loaded!', {
        style: {
          background: '#0f1729',
          color: '#e2e8f0',
          border: '1px solid rgba(251,191,36,0.3)'
        }
      });
      await fetchPlayers();
    } catch {
      toast.error('Failed to seed. Is the backend running?');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="relative h-screen w-full bg-slate-950 text-white overflow-y-auto flex flex-col">
      <Head>
        <title>LIVE AUCTION 2026</title>
      </Head>

      {/* Stadium Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-20 transition-opacity duration-1000"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000')"
        }}
      />

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start p-4 md:p-6 overflow-y-auto">

        {players.length === 0 && !loading && (
          <div className="mt-5">
            <p className="text-slate-400 text-sm mb-3 font-body">
              No players found. Load sample players to get started.
            </p>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="btn-gold px-6 py-2.5 rounded-xl text-sm"
              style={{ letterSpacing: '0.08em' }}
            >
              {seeding ? 'Loading...' : '🎯 Load Sample Players'}
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col mt-20  items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500 border-r-2 border-r-transparent" />
            <p className="text-[10px] font-black tracking-[0.4em] text-yellow-500 uppercase">
              Syncing Data
            </p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="w-full mt-20 max-w-5xl flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-700">

            {/* Player Card */}
            <PlayerCard
              player={filtered[currentIndex]}
              onStatusChange={(upd) =>
                setPlayers((prev) =>
                  prev.map((p) => (p._id === upd._id ? upd : p))
                )
              }
            />

            {/* Controls */}
            <div className="w-full max-w-3xl flex flex-col md:flex-row items-center gap-4 bg-white/[0.03] backdrop-blur-xl p-2 rounded-[1rem] border border-white/10 shadow-2xl">

              {/* Search */}
              <div className="flex-1 w-full bg-black/20 rounded-2xl border border-white/5 focus-within:border-yellow-500/50 transition-colors">
                <SearchBar onSearch={setSearch} />
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-3 w-full md:w-auto">

                <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/5">

                  <button
                    onClick={handlePrev}
                    className="p-3 hover:bg-white/10 transition-all rounded-lg group"
                    title="Previous Player"
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="group-active:-translate-x-1 transition-transform">
                      <path d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div className="px-4 border-x border-white/10 flex flex-col items-center min-w-[80px]">
                    <span className="text-[10px] font-black text-yellow-500 leading-none tracking-tighter">
                      {String(currentIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">
                      OF {filtered.length}
                    </span>
                  </div>

                  <button
                    onClick={handleNext}
                    className="p-3 hover:bg-white/10 transition-all rounded-lg group"
                    title="Next Player"
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="group-active:translate-x-1 transition-transform">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center group cursor-pointer" onClick={() => setSearch('')}>
            <p className="text-white/20 font-black tracking-[0.5em] text-2xl uppercase group-hover:text-yellow-500/40 transition-colors">
              No Player Found
            </p>
            <p className="text-white/10 text-xs font-bold mt-4 uppercase tracking-widest">
              Click anywhere to reset search
            </p>
          </div>
        )}

      </main>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-0" />
    </div>
  );
}