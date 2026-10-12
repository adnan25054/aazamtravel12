import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Building, ChevronDown, X, Check } from 'lucide-react';
import { INDIAN_STATIONS, IndianStation, searchStations, formatStationLabel } from '../data/indianStations';

export interface StationAutocompleteProps {
  value: string;
  onChange: (value: string, stationCode?: string, stationName?: string) => void;
  placeholder?: string;
  label?: string;
  icon?: 'origin' | 'destination' | 'station';
  required?: boolean;
  id?: string;
  className?: string;
  inputClassName?: string;
  returnOnlyCode?: boolean; // if true, sets value as "NDLS", otherwise "New Delhi (NDLS)"
  onSelectStation?: (stn: IndianStation) => void;
  showPopularChips?: boolean;
}

export const StationAutocomplete: React.FC<StationAutocompleteProps> = ({
  value,
  onChange,
  placeholder = 'Type station name or code (e.g. NDLS, Mumbai, Indore)',
  label,
  icon = 'origin',
  required = false,
  id,
  className = '',
  inputClassName = '',
  returnOnlyCode = false,
  onSelectStation,
  showPopularChips = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggestions based on current input
  const suggestions = searchStations(value, 8);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (stn: IndianStation) => {
    const formatted = returnOnlyCode ? stn.StationCode : formatStationLabel(stn);
    onChange(formatted, stn.StationCode, stn.NameEn);
    if (onSelectStation) {
      onSelectStation(stn);
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (isOpen && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        e.preventDefault();
        handleSelect(suggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const clearInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('', '', '');
    inputRef.current?.focus();
    setIsOpen(true);
  };

  const popularQuickStations: IndianStation[] = [
    { StationCode: 'NDLS', NameEn: 'New Delhi', State: 'Delhi' },
    { StationCode: 'CSMT', NameEn: 'Mumbai CSMT', State: 'Maharashtra' },
    { StationCode: 'INDB', NameEn: 'Indore Jn', State: 'Madhya Pradesh' },
    { StationCode: 'HWH', NameEn: 'Howrah Jn', State: 'West Bengal' },
    { StationCode: 'PUNE', NameEn: 'Pune Jn', State: 'Maharashtra' },
    { StationCode: 'BPL', NameEn: 'Bhopal Jn', State: 'Madhya Pradesh' },
    { StationCode: 'BRC', NameEn: 'Vadodara Jn', State: 'Gujarat' },
    { StationCode: 'NGP', NameEn: 'Nagpur Jn', State: 'Maharashtra' },
  ];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-orange-500">*</span>}
        </label>
      )}

      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          {icon === 'destination' ? (
            <MapPin className="w-4 h-4 text-emerald-600" />
          ) : icon === 'station' ? (
            <Building className="w-4 h-4 text-sky-600" />
          ) : (
            <MapPin className="w-4 h-4 text-orange-500" />
          )}
        </div>

        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className={`w-full pl-10 pr-14 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-900 font-semibold transition-all bg-white placeholder:text-slate-400 placeholder:font-normal ${inputClassName}`}
        />

        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={clearInput}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Clear station"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setIsOpen(!isOpen);
              inputRef.current?.focus();
            }}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Auto-suggest Dropdown */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-100">
            <span>Station Name & Code Suggestions</span>
            <span>{suggestions.length} found</span>
          </div>

          {suggestions.length > 0 ? (
            suggestions.map((stn, index) => {
              const isSelected =
                value === formatStationLabel(stn) ||
                value === stn.StationCode ||
                value.includes(`(${stn.StationCode})`);
              const isHighlighted = index === highlightedIndex;

              return (
                <button
                  key={stn.StationCode}
                  type="button"
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => handleSelect(stn)}
                  className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-2.5 transition-colors ${
                    isHighlighted
                      ? 'bg-orange-50 text-orange-950'
                      : isSelected
                        ? 'bg-slate-50 text-slate-900 font-bold'
                        : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="shrink-0 px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-xs font-black tracking-wider shadow-2xs">
                      {stn.StationCode}
                    </span>
                    <div className="min-w-0 truncate">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {stn.NameEn}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5 truncate">
                        {stn.NameHn && <span>{stn.NameHn}</span>}
                        {stn.NameHn && stn.State && <span>•</span>}
                        {stn.State && <span>{stn.State}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {stn.Zone && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                        {stn.Zone}
                      </span>
                    )}
                    {isSelected && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="px-4 py-3 text-xs text-slate-500 text-center">
              No matching stations found. You can still enter custom station name or code.
            </div>
          )}

          {/* Quick select popular stations if query is short */}
          {showPopularChips && (
            <div className="p-2 border-t border-slate-100 bg-slate-50/70 mt-1">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">Quick Select:</span>
              <div className="flex flex-wrap gap-1">
                {popularQuickStations.slice(0, 6).map((pop) => (
                  <button
                    key={pop.StationCode}
                    type="button"
                    onClick={() => handleSelect(pop)}
                    className="px-2 py-0.5 rounded-md bg-white hover:bg-orange-50 border border-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1"
                  >
                    <span>{pop.NameEn}</span>
                    <span className="text-[9px] text-slate-400">({pop.StationCode})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
