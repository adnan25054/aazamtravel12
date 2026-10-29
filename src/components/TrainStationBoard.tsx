import React, { useState } from 'react';
import { Building, Radio, Filter, Clock, Milestone, CheckCircle2, Activity, MessageSquare, AlertCircle, Loader2, RefreshCw, ExternalLink } from 'lucide-react';
import { RailRadarLiveStationResponse } from '../types';
import { StationAutocomplete } from './StationAutocomplete';
import { OFFICIAL_LOGO_URL } from './Logo';
import { extractStationCode } from '../data/indianStations';

interface TrainStationBoardProps {
  stationBoardCode: string;
  setStationBoardCode: (code: string) => void;
  stationBoardHours: number;
  setStationBoardHours: (hours: number) => void;
  stationBoardLoading: boolean;
  stationBoardError: string | null;
  stationBoardData: RailRadarLiveStationResponse | null;
  onFetchStationBoard: (code?: string, hours?: number) => void;
  onTrackLive: (trainNumber: string) => void;
  cleanWhatsApp: string;
}

export const TrainStationBoard: React.FC<TrainStationBoardProps> = ({
  stationBoardCode,
  setStationBoardCode,
  stationBoardHours,
  setStationBoardHours,
  stationBoardLoading,
  stationBoardError,
  stationBoardData,
  onFetchStationBoard,
  onTrackLive,
  cleanWhatsApp,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'departures' | 'arrivals' | 'ontime' | 'delayed'>('all');

  const popularStations = [
    { code: 'INDB', label: 'Indore' },
    { code: 'NDLS', label: 'New Delhi' },
    { code: 'CSMT', label: 'Mumbai CSMT' },
    { code: 'BRC', label: 'Vadodara' },
    { code: 'BPL', label: 'Bhopal' },
    { code: 'HWH', label: 'Howrah' },
    { code: 'PUNE', label: 'Pune' },
    { code: 'NGP', label: 'Nagpur' },
  ];

  const handleSearchSubmit = () => {
    const resolved = extractStationCode(stationBoardCode);
    if (resolved) {
      setStationBoardCode(resolved);
      onFetchStationBoard(resolved, stationBoardHours);
    } else {
      onFetchStationBoard(stationBoardCode, stationBoardHours);
    }
  };

  const lastUpdatedDisplay = stationBoardData?.meta?.timestamp
    ? new Date(stationBoardData.meta.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : null;

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header with Agency Logo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <img
            src={OFFICIAL_LOGO_URL}
            alt="Aazam Travel Agency Official Logo"
            className="w-11 h-11 rounded-xl object-contain bg-white p-1 border border-slate-200 shrink-0 shadow-2xs"
          />
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-sky-600" />
              Live Station Arrivals & Departures Board
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Search by station name or IRCTC code to view scheduled vs. actual/estimated timings, delay status, and platform numbers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-slate-500 font-semibold text-[11px]">Popular Stations:</span>
          {popularStations.map((stn) => (
            <button
              key={stn.code}
              type="button"
              onClick={() => {
                setStationBoardCode(stn.code);
                onFetchStationBoard(stn.code, stationBoardHours);
              }}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs border transition-colors ${
                stationBoardCode.toUpperCase() === stn.code
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border-slate-200'
              }`}
            >
              {stn.code} <span className="font-normal text-[10px] opacity-80">({stn.label})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Station Search with Auto-Suggest & Hours Window Controls */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center gap-3">
        <div className="w-full md:flex-1 space-y-1">
          <label className="text-[11px] font-bold text-slate-700 block">
            Station Name or IRCTC Code (e.g., Indore, New Delhi, NDLS, CSMT) *
          </label>
          <StationAutocomplete
            value={stationBoardCode}
            returnOnlyCode={false}
            onChange={(val, code) => {
              setStationBoardCode(code || val);
            }}
            onSelectStation={(stn) => {
              setStationBoardCode(stn.StationCode);
              onFetchStationBoard(stn.StationCode, stationBoardHours);
            }}
            placeholder="Type Station Name or Code (e.g. New Delhi, NDLS, Mumbai, INDB)"
            icon="station"
            inputClassName="font-bold text-slate-800"
          />
        </div>

        <div className="w-full md:w-auto space-y-1">
          <label className="text-[11px] font-bold text-slate-700 block">
            Time Window (Hours)
          </label>
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-300">
            {[2, 4, 8].map((hrs) => (
              <button
                key={hrs}
                type="button"
                onClick={() => {
                  setStationBoardHours(hrs);
                  const resolved = extractStationCode(stationBoardCode) || stationBoardCode;
                  onFetchStationBoard(resolved, hrs);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  stationBoardHours === hrs
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {hrs} Hours
              </button>
            ))}
          </div>
        </div>

        <div className="w-full md:w-auto md:self-end">
          <button
            type="button"
            disabled={stationBoardLoading}
            onClick={handleSearchSubmit}
            className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            {stationBoardLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scanning Station...</span>
              </>
            ) : (
              <>
                <Radio className="w-4 h-4" />
                <span>View Live Station</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error State with Retry & Official Alternative */}
      {stationBoardError && (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
            <div className="space-y-1 flex-1">
              <h3 className="text-sm font-bold text-rose-900">
                Live Station Data Unavailable
              </h3>
              <p className="text-xs text-rose-800 leading-relaxed">
                {stationBoardError}
              </p>
              <p className="text-[11px] text-rose-700">
                Note: We never display fabricated train movements, timings, or platform numbers. When the live station feed is unconfigured or unreachable, you can retry or check the official Indian Railways NTES Live Station portal.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              disabled={stationBoardLoading}
              onClick={handleSearchSubmit}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${stationBoardLoading ? 'animate-spin' : ''}`} />
              <span>Retry Search</span>
            </button>

            <a
              href="https://enquiry.indianrail.gov.in/mntes/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs transition-colors"
            >
              <span>Official NTES Live Station</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>

            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                `Hello Aazam Travel Agency, I need train enquiry assistance for station ${stationBoardCode}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Desk on WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Station Board Results */}
      {stationBoardData && stationBoardData.data && (
        <div className="space-y-4">
          {/* Station Overview Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-900 to-[#0A2540] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center font-mono font-black text-xl text-sky-300 border border-white/20">
                {stationBoardData.data.station.code}
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2 flex-wrap">
                  <span>{stationBoardData.data.station.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-black uppercase">
                    Live Feed
                  </span>
                </h3>
                <p className="text-xs text-sky-200 mt-0.5">
                  Arrivals & Departures window: <strong>{stationBoardData.data.window?.from || 'Current'}</strong> to <strong>{stationBoardData.data.window?.to || `+${stationBoardHours}h`}</strong> ({stationBoardHours} hrs)
                </p>
                {lastUpdatedDisplay && (
                  <p className="text-[11px] text-amber-300 font-semibold mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Last Updated: {lastUpdatedDisplay}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-center">
                <span className="block text-[10px] text-sky-200 font-bold uppercase">Total Trains</span>
                <span className="font-black text-base text-white">{stationBoardData.data.trains?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-bold text-[11px] flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Filter Trains:
            </span>
            {[
              { id: 'all', label: `All (${stationBoardData.data.trains?.length || 0})` },
              { id: 'departures', label: 'Departures' },
              { id: 'arrivals', label: 'Arrivals' },
              { id: 'ontime', label: 'Right Time' },
              { id: 'delayed', label: 'Delayed' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterType(f.id as any)}
                className={`px-3 py-1 rounded-lg font-bold transition-colors shrink-0 ${
                  filterType === f.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Empty state if 0 trains in window */}
          {(!stationBoardData.data.trains || stationBoardData.data.trains.length === 0) && (
            <div className="p-8 rounded-2xl border border-slate-200 bg-white text-center space-y-2">
              <p className="text-sm font-bold text-slate-800">
                No trains reported in the selected {stationBoardHours}-hour window for {stationBoardData.data.station.name} ({stationBoardData.data.station.code}).
              </p>
              <p className="text-xs text-slate-500">
                Try expanding the time window to 8 Hours or searching an adjacent junction station.
              </p>
            </div>
          )}

          {/* Train Cards List */}
          <div className="space-y-3">
            {(stationBoardData.data.trains || [])
              .filter((item) => {
                if (filterType === 'departures') return !!item.stop?.departure;
                if (filterType === 'arrivals') return !!item.stop?.arrival;
                if (filterType === 'ontime') return (item.live?.delayMinutes || 0) === 0;
                if (filterType === 'delayed') return (item.live?.delayMinutes || 0) > 0;
                return true;
              })
              .map((item, idx) => {
                const { train, stop, live } = item;
                const isDelayed = (live?.delayMinutes || 0) > 0;
                const isAtStation = live?.type === 'at-station';
                const isEnRoute = live?.type === 'en-route';

                const formatExpectedTime = (val?: string) => {
                  if (!val) return null;
                  if (val.includes('T')) {
                    const parsed = new Date(val);
                    if (!isNaN(parsed.getTime())) {
                      return parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    }
                  }
                  return val;
                };

                const expectedArr = formatExpectedTime(live?.expectedArrivalTime);
                const expectedDep = formatExpectedTime(live?.expectedDepartureTime);

                return (
                  <div
                    key={`${train.number}-${stop?.sequence || idx}`}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-md transition-all space-y-3"
                  >
                    {/* Top Row: Train info and Status Badges */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 font-mono font-black text-sm border border-sky-200">
                          {train.number}
                        </span>
                        <div>
                          <h4 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2 flex-wrap">
                            <span>{train.name}</span>
                            {train.type && (
                              <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-100">
                                {train.type}
                              </span>
                            )}
                          </h4>
                          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>Route: <strong className="text-slate-700">{train.source}</strong> ➔ <strong className="text-slate-700">{train.destination}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                        <div className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs flex items-center gap-1.5 shadow-2xs">
                          <Milestone className="w-3.5 h-3.5 text-amber-600" />
                          <span>Platform: {live?.platform ? `PF #${live.platform}` : 'TBA'}</span>
                        </div>

                        <div
                          className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                            isDelayed
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {isDelayed ? (
                            <>
                              <Clock className="w-3.5 h-3.5 text-rose-600" />
                              <span>Delayed by {live.delayMinutes} min</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>No Delay (On Time)</span>
                            </>
                          )}
                        </div>

                        {live?.type && (
                          <div
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 ${
                              isAtStation
                                ? 'bg-emerald-600 text-white'
                                : isEnRoute
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span className="capitalize">{live.type.replace('-', ' ')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Timings row & Actions (Clearly labelling Scheduled vs Actual/Estimated) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600 flex-1">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Scheduled Arrival</span>
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {stop?.arrival || 'Source'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Scheduled Departure</span>
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {stop?.departure || 'Destination'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Est. / Actual Arrival
                          </span>
                          <span className={`font-mono font-bold text-sm ${isDelayed ? 'text-rose-600' : 'text-emerald-700'}`}>
                            {expectedArr || stop?.arrival || '--'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Est. / Actual Departure
                          </span>
                          <span className={`font-mono font-bold text-sm ${isDelayed ? 'text-rose-600' : 'text-emerald-700'}`}>
                            {expectedDep || stop?.departure || '--'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 sm:pt-0 shrink-0">
                        <button
                          type="button"
                          onClick={() => onTrackLive(train.number)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Activity className="w-3.5 h-3.5 text-orange-600" />
                          <span>Track Live</span>
                        </button>

                        <a
                          href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                            `Hello Aazam Travel Agency, I want to book tickets for train ${train.number} (${train.name}) from ${stationBoardData.data.station.code} to ${train.destination}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Book</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

