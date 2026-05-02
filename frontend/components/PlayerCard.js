import { useState, useEffect } from 'react';
import Image from 'next/image';
import { playerAPI } from '../lib/api';
import toast from 'react-hot-toast';

export default function PlayerCard({ player, onStatusChange }) {
  const [loading, setLoading] = useState(false);
  const [soldPrice, setSoldPrice] = useState('');

  const isSold = player.status === 'Sold';

  // ✅ reset when player changes
  useEffect(() => {
    if (player.status === 'Sold') {
      setSoldPrice(String(player.soldPrice || 0));
    } else {
      setSoldPrice('0');
    }
  }, [player._id, player.status, player.soldPrice]);

  // ✅ normalized validation
  const price = Number(soldPrice);
  const isInvalidPrice =
    !soldPrice || isNaN(price) || price <= 0;

  const handleToggleStatus = async () => {
    setLoading(true);
    const newStatus = isSold ? 'Unsold' : 'Sold';

    try {
      // ✅ strict validation before submit
      if (newStatus === 'Sold') {
        if (isInvalidPrice) {
          toast.error('Sold price must be greater than 0');
          setLoading(false);
          return;
        }
      }

      const res = await playerAPI.updateStatus(player._id, {
        status: newStatus,
        soldPrice: newStatus === 'Sold' ? price : 0
      });

      onStatusChange && onStatusChange(res.data.data);
      toast.success(`${player.name} is ${newStatus.toUpperCase()}`);
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const proficiencies = Array.isArray(player.proficiency)
    ? player.proficiency
    : [player.proficiency];

  return (
    <div className="relative w-full flex flex-col md:flex-row bg-slate-900/60 backdrop-blur-xl rounded-[30px] md:rounded-[40px] border border-white/10 shadow-2xl overflow-hidden min-h-[450px] md:min-h-[500px]">

      {/* HEADER */}
      <div className="absolute top-6 right-8 md:top-10 md:right-12 z-0 opacity-10 pointer-events-none">
        <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter text-white uppercase text-right leading-none">
          Auction<br />2026
        </h1>
      </div>

      {/* IMAGE */}
      <div className="relative w-full md:w-2/5 h-[350px] md:h-[500px] overflow-hidden">
      {/* <div className="relative w-full md:w-2/5 min-h-[250px] md:min-h-[400px] overflow-hidden"> */}
        <Image
          src={player.image || '/players/default.png'}
          alt={player.name}
          fill
          className="object-cover object-center"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />

        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-6xl md:text-8xl font-black text-white/20 z-20 select-none leading-none">
          #{String(player.playerNumber).padStart(2, '0')}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 md:p-16 flex flex-col justify-center relative z-10">

        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none">
          {player.name}
        </h2>

        {/* STATS */}
        <div className="flex flex-row items-center justify-between gap-4 md:gap-10 mb-8 md:mb-10">

          {/* Base Price */}
          <div className="flex-1">
            <p className="text-white/40 text-[10px] uppercase mb-1">
              Base Price
            </p>
            <p className="text-xl md:text-3xl font-bold text-yellow-500">
              ₹{player.basePrice}
            </p>
          </div>

          {/* Sold Price */}
          <div className="flex-1">
            <p className="text-white/40 text-[10px] uppercase mb-1">
              Sold Price
            </p>

            {isSold ? (
              <p className="text-xl md:text-3xl font-bold text-green-500">
                ₹{soldPrice}
              </p>
            ) : (
              <input
                type="number"
                value={soldPrice}
                placeholder="0"
                onChange={(e) => setSoldPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm md:text-lg"
                min="0"
              />
            )}
          </div>

          {/* STATUS */}
          <div className="flex-1">
            <p className="text-white/40 text-[10px] uppercase mb-1">
              Status
            </p>
            <p className={`text-xl md:text-3xl font-bold ${isSold ? 'text-green-500' : 'text-white/30'}`}>
              {isSold ? 'SOLD' : 'AVAILABLE'}
            </p>
          </div>
        </div>

        {/* PROFICIENCY */}
        <div className="mb-8 md:mb-10">
          <p className="text-white/40 text-[10px] uppercase mb-2">
            Proficiency
          </p>

          <div className="flex flex-wrap gap-2">
            {proficiencies.map((role, index) => (
              <span
                key={index}
                className="px-3 py-1 text-[10px] md:text-xs font-bold uppercase bg-white/10 border border-white/20 rounded-full text-white/80"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleToggleStatus}
          disabled={loading || (!isSold && isInvalidPrice)}
          className={`group flex items-center justify-between px-6 py-4 md:px-8 md:py-5 rounded-2xl transition-all ${
            isSold
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-white hover:bg-yellow-500 text-black'
          }`}
        >
          <span className="text-xs md:text-xl font-black uppercase tracking-widest">
            {isSold ? 'Mark as Available' : 'Mark as Sold'}
          </span>
          <span className="text-xl group-hover:translate-x-2 transition-transform">
            →
          </span>
        </button>
      </div>

      {/* SOLD RIBBON */}
      {isSold && (
        <div className="absolute top-8 -right-12 bg-green-500 text-black font-black py-1 px-16 md:py-2 md:px-20 rotate-45 shadow-xl text-xs md:text-base">
          SOLD
        </div>
      )}
    </div>
  );
}