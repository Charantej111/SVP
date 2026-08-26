import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { LocationIllustration } from './LocationIllustration';
import { useLocationDetection } from '../../hooks/useLocationDetection';
import { CurrentLocationButton } from '../location/CurrentLocationButton';
import { LocationSearch } from '../location/LocationSearch';
import { LocationConfirmation } from '../location/LocationConfirmation';
import { LocationMap } from '../location/LocationMap';
import { LocationError } from '../location/LocationError';

export const LocationModal = () => {
  const { 
    isLocationModalOpen, 
    closeLocationModal, 
    deliveryLocation, 
    setDeliveryLocation 
  } = useCart();

  const {
    status,
    detectedLocation,
    readingsCount,
    errorMessage,
    startGpsDetection,
    selectSearchedPlace,
    updateMapCoordinates,
    resetToSearch,
    openMapAdjustment,
    backToConfirmation
  } = useLocationDetection(deliveryLocation);

  // Reset to default search state whenever modal opens
  useEffect(() => {
    if (isLocationModalOpen) {
      resetToSearch();
    }
  }, [isLocationModalOpen, resetToSearch]);

  if (!isLocationModalOpen) return null;

  // Handle final user confirmation of a delivery location
  const handleConfirmLocation = (locationToConfirm = detectedLocation) => {
    if (locationToConfirm) {
      setDeliveryLocation(locationToConfirm);
    }
    closeLocationModal();
  };

  const isErrorState = [
    'insecure_context',
    'permission_denied',
    'position_unavailable',
    'timeout',
    'error'
  ].includes(status);

  const isMapState = status === 'adjusting_map';
  const isConfirmingState = (status === 'confirming' || status === 'low_accuracy') && detectedLocation;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-[#E2E2E7] relative animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        
        {/* Modal Top Header Bar with isolated Close Button */}
        <div className="flex items-center justify-between px-6 pt-5 pb-1">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            {isMapState ? 'Map Location Picker' : isConfirmingState ? 'Confirm Delivery Address' : 'Delivery Location'}
          </div>
          
          {/* Isolated Close Button */}
          <button
            type="button"
            onClick={closeLocationModal}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close location modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 pt-2 pb-6 space-y-4">
          
          {/* View 1: Map Adjustment View */}
          {isMapState ? (
            <LocationMap
              initialLocation={detectedLocation || deliveryLocation}
              onConfirmAdjustedLocation={(adjustedLocation) => {
                handleConfirmLocation(adjustedLocation);
              }}
              onBack={backToConfirmation}
            />
          ) : isConfirmingState ? (
            /* View 2: Confirmation Screen */
            <LocationConfirmation
              location={detectedLocation}
              onConfirm={() => handleConfirmLocation(detectedLocation)}
              onAdjustOnMap={openMapAdjustment}
              onChangeLocation={resetToSearch}
            />
          ) : (
            /* View 3: Default Search & GPS View */
            <div className="space-y-4">
              
              {/* Headline + Location Illustration */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 pr-2">
                  <h2 className="text-[19px] sm:text-[22px] font-extrabold text-[#02060C] tracking-tight leading-[25px]">
                    Select your delivery location
                  </h2>
                  <p className="text-[12px] sm:text-[13px] text-[#686B78] mt-1 font-medium leading-[17px]">
                    Type your village, area, colony or street name to detect your delivery address.
                  </p>
                </div>

                {/* Vector Graphic Illustration */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-[#E2E2E7] p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                  <LocationIllustration className="w-full h-full object-contain" />
                </div>
              </div>

              {/* Error Message banner if GPS failed */}
              {isErrorState && (
                <LocationError
                  status={status}
                  message={errorMessage}
                  onRetryGps={startGpsDetection}
                  onSearchManually={resetToSearch}
                />
              )}

              {/* Live Address Search Input */}
              <LocationSearch
                onSelectPlace={selectSearchedPlace}
                autoFocus={!isErrorState}
              />

              {/* GPS Current Location Button */}
              <div className="pt-0.5">
                <CurrentLocationButton
                  onClick={startGpsDetection}
                  status={status}
                  readingsCount={readingsCount}
                />
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
