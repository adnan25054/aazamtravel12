import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Building2, 
  Copy, 
  Check, 
  Filter, 
  Train, 
  ArrowRight, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { INDIAN_STATIONS, IndianStation, searchStations } from '../data/indianStations';

interface StationSearchBarProps {
  onSelectStationForBooking?: (stn: IndianStation) => void;
  onCheckLiveBoard?: (stationCode: string) => void;
  initialQuery?: string;
  variant?: 'card' | 'standalone' | 'compact';
  className?: string;
}

export const StationSearchBar: React.FC<StationSearchBarProps> = ({
  onSelectStationForBooking,
  onCheckLiveBoard,
  initialQuery = '',
  variant = 'card',
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Extract unique states and zones for quick filters
  const allStates = useMemo(() => {
    const set = new Set<string>();
    INDIAN_STATIONS.forEach((s) => {
      if (s.State) set.add(s.State);
    });
    return Array.from(set).sort();
  }, []);

  const allZones = useMemo(() => {
    const set = new Set<string>();
    INDIAN_STATIONS.forEach((s) => {
      if (s.Zone) set.add(s.Zone);
    });
    return Array.from(set).sort();
  }, []);

  // Filtered stations based on query + filters
  const filteredStations = useMemo(() => {
    let list: IndianStation[] = [];
    const q = searchQuery.trim();

    if (q) {
      list = searchStations(q, 100);
    } else {
      list = INDIAN_STATIONS;
    }

    if (selectedState !== 'all') {
      list = list.filter((s) => s.State === selectedState);
    }

    if (selectedZone !== 'all') {
      list = list.filter((s) => s.Zone === selectedZone);
    }

    return list;
  }, [searchQuery, selectedState, selectedZone]);

  const handleCopyCode = (code: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedState('all');
    setSelectedZone('all');
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Search Header Container */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0B2545] to-[#133E68] text-white p-5 sm:p-7 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        {/* Glow ambient background accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 bg-orange-500/20 text-orange-400 rounded-2xl border border-orange-500/30">
                <Search className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  All Railway Stations with Code Search
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white rounded-full">
                    {INDIAN_STATIONS.length}+ Stations
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Search any Indian Railways station name, IRCTC alpha-code, city, state, or Hindi name
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>IRCTC / CRIS Verified Directory</span>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative flex items-center">
            <div className="absolute left-4 pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-orange-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type station code or name (e.g. NDLS, Mumbai, Indore, BPL, Varanasi, Pune)..."
              className="w-full pl-12 pr-28 py-4 bg-white/95 text-slate-900 placeholder:text-slate-400 font-medium rounded-2xl shadow-inner text-sm sm:text-base border-2 border-transparent focus:border-orange-500 focus:bg-white focus:outline-none transition-all"
            />
            <div className="absolute right-3 flex items-center gap-1.5">
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Clear Search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <span className="hidden sm:inline-block px-2.5 py-1 text-xs font-bold text-slate-500 bg-slate-100 rounded-lg border border-slate-200">
                {filteredStations.length} Results
              </span>
            </div>
          </div>

          {/* Quick Filters: States, Zones & Popular Stations */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-orange-400" /> Filter:
            </span>

            {/* State selector */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-400 cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All States ({allStates.length})</option>
              {allStates.map((st) => (
                <option key={st} value={st} className="bg-slate-900 text-white">
                  {st}
                </option>
              ))}
            </select>

            {/* Zone selector */}
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-400 cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All Zones ({allZones.length})</option>
              {allZones.map((zn) => (
                <option key={zn} value={zn} className="bg-slate-900 text-white">
                  Zone {zn}
                </option>
              ))}
            </select>

            {/* Popular Quick Pills */}
            <div className="hidden md:flex items-center gap-1.5 ml-auto">
              <span className="text-slate-400 text-[11px]">Popular:</span>
              {['NDLS', 'CSMT', 'INDB', 'HWH', 'PUNE', 'BPL', 'ADI'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSearchQuery(code)}
                  className="px-2 py-0.5 rounded-lg font-mono font-bold text-[11px] bg-white/10 hover:bg-orange-500 hover:text-white text-slate-200 transition-colors border border-white/10"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid / List */}
      <div className="mt-4 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-md">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs text-slate-500">
          <div className="font-semibold flex items-center gap-2 text-slate-700">
            <Building2 className="w-4 h-4 text-orange-500" />
            <span>
              Showing <strong className="text-slate-900">{filteredStations.length}</strong> matching railway stations
            </span>
          </div>
          <div className="text-[11px] text-slate-400 hidden sm:block">
            Click code to copy · Instant 1-tap book or live board lookup
          </div>
        </div>

        {filteredStations.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-base">No stations match &ldquo;{searchQuery}&rdquo;</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try searching with another keyword (e.g. city name, code prefix like ND or DL, or state).
            </p>
            <button
              type="button"
              onClick={clearSearch}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredStations.slice(0, 75).map((stn) => {
              const isCopied = copiedCode === stn.StationCode;
              return (
                <div
                  key={stn.StationCode}
                  className="p-3.5 rounded-2xl border border-slate-200/80 hover:border-orange-300 hover:shadow-md bg-white hover:bg-orange-50/20 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top row: Code badge + Zone + Copy button */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyCode(stn.StationCode)}
                          className={`font-mono text-xs font-black px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                            isCopied
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 group-hover:border-orange-300'
                          }`}
                          title="Click to copy station code"
                        >
                          <span>{stn.StationCode}</span>
                          {isCopied ? (
                            <Check className="w-3 h-3 text-white" />
                          ) : (
                            <Copy className="w-3 h-3 opacity-60 hover:opacity-100" />
                          )}
                        </button>
                        {stn.Zone && (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {stn.Zone}
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] font-medium text-slate-500 truncate max-w-[120px]">
                        {stn.State}
                      </span>
                    </div>

                    {/* Station Name in English + Hindi */}
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-900 transition-colors leading-tight">
                      {stn.NameEn}
                    </h4>
                    {stn.NameHn && (
                      <p className="text-xs text-slate-500 mt-0.5 font-normal">
                        {stn.NameHn}
                      </p>
                    )}
                    {stn.City && stn.City !== stn.NameEn && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>City: {stn.City}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions: Book Tickets & Check Station Live Board */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    {onSelectStationForBooking && (
                      <button
                        type="button"
                        onClick={() => onSelectStationForBooking(stn)}
                        className="flex-1 py-1.5 px-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors shadow-xs"
                      >
                        <Train className="w-3 h-3" />
                        <span>Book Train</span>
                      </button>
                    )}

                    {onCheckLiveBoard && (
                      <button
                        type="button"
                        onClick={() => onCheckLiveBoard(stn.StationCode)}
                        className="py-1.5 px-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                        title="Check Station Live Arrivals / Departures Board"
                      >
                        <span>Live Board</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredStations.length > 75 && (
          <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
            Showing first 75 of {filteredStations.length} matching stations. Type in search bar to narrow down results.
          </div>
        )}
      </div>
    </div>
  );
};
