import { useState, useCallback } from 'react';

export default function SearchBar({ onSearch, placeholder = "SEARCH BY PLAYER NUMBER OR NAME..." }) {
  const [value, setValue] = useState('');

  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setValue(val);
    onSearch(val);
  }, [onSearch]);

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className="relative w-full group">
      {/* Search Icon - Matches the Yellow Gold theme */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-500 transition-opacity duration-300 group-focus-within:opacity-100 opacity-40">
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
      </div>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-transparent pl-12 pr-12 py-3 outline-none text-white font-black text-[10px] md:text-xs tracking-[0.2em] uppercase placeholder:text-white/20 transition-all"
        autoComplete="off"
      />

      {/* Clear button - Appears only when typing */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-red-500 transition-colors"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      )}

      {/* Subtle Bottom Glow Line on Focus */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-yellow-500 transition-all duration-500 w-0 group-focus-within:w-full opacity-50" />
    </div>
  );
}