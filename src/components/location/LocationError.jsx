import React from 'react';
import { ShieldAlert, MapPinOff, Clock, AlertCircle, Search, RefreshCw, Lock } from 'lucide-react';

export const LocationError = ({
  status,
  message,
  onRetryGps,
  onSearchManually
}) => {
  let title = 'Location Detection Issue';
  let description = message || 'We were unable to detect your current location.';
  let icon = <AlertCircle className="w-6 h-6 text-amber-600" />;
  let showRetry = false;

  switch (status) {
    case 'insecure_context':
      title = 'HTTPS Required for Device GPS';
      description = 'Mobile browsers block GPS on non-secure HTTP addresses (like local network IPs). To use GPS on your phone, open the site with https:// or search for your delivery location manually below.';
      icon = <Lock className="w-6 h-6 text-amber-600" />;
      break;
    case 'permission_denied':
      title = 'Location access is blocked';
      description = 'Location permission is denied or blocked by the browser. If on mobile HTTP, try accessing via HTTPS, or enable location in site settings, or search manually below.';
      icon = <ShieldAlert className="w-6 h-6 text-red-600" />;
      showRetry = true;
      break;
    case 'position_unavailable':
      title = "We couldn't determine your location";
      description = 'Please check your device GPS/location settings or search for your delivery address manually.';
      icon = <MapPinOff className="w-6 h-6 text-amber-600" />;
      showRetry = true;
      break;
    case 'timeout':
      title = 'Location detection timed out';
      description = 'Location detection took too long. Try again with a stronger GPS signal or search manually.';
      icon = <Clock className="w-6 h-6 text-amber-600" />;
      showRetry = true;
      break;
    default:
      showRetry = true;
      break;
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4 animate-in fade-in duration-200">
      
      {/* Error Header */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-2xl bg-white border border-amber-200 shrink-0 shadow-2xs">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-extrabold text-[#02060C] tracking-tight leading-tight">
            {title}
          </h3>
          <p className="text-[12.5px] text-[#686B78] font-medium leading-relaxed mt-1">
            {description}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onSearchManually}
          className="w-full sm:flex-1 h-[42px] bg-brand-800 hover:bg-brand-900 text-white font-black text-[13px] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          <Search className="w-4 h-4" />
          <span>Search location manually</span>
        </button>

        {showRetry && (
          <button
            type="button"
            onClick={onRetryGps}
            className="w-full sm:w-auto h-[42px] px-4 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 font-extrabold text-[13px] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try GPS Again</span>
          </button>
        )}
      </div>

    </div>
  );
};
