import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Radio } from 'lucide-react';

interface VirtualCardProps {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

const VirtualCard: React.FC<VirtualCardProps> = ({ cardHolder, cardNumber, expiry, cvv }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Format card number with spaces every 4 digits
  const formatCardNumber = (num: string) => {
    return num ? num.replace(/(.{4})/g, '$1 ').trim() : '0000 0000 0000 0000';
  };

  const maskedCardNumber = (num: string) => {
    if (!num) return '**** **** **** 0000';
    const last4 = num.slice(-4);
    return `**** **** **** ${last4}`;
  };

  return (
    <div className="relative w-full max-w-sm h-56 group perspective">
      <div className={`relative w-full h-full transition-all duration-500 rounded-3xl p-6 overflow-hidden 
        bg-gradient-to-br from-indigo-600 via-blue-700 to-slate-900 border border-white/20 shadow-2xl ${showDetails ? 'shadow-blue-500/20' : ''}`}>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

        {/* Header */}
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <ShieldCheck className="text-blue-400" size={18} />
            </div>
            <span className="text-white text-sm font-black tracking-tighter uppercase italic">FinSecure</span>
          </div>
          <Radio className="text-white/40 animate-pulse" size={20} />
        </div>

        {/* Chip */}
        <div className="mt-6 mb-8 relative z-10 flex items-center gap-4">
          <div className="w-10 h-8 rounded-md bg-gradient-to-br from-amber-200 to-amber-500 opacity-80 border border-white/10"></div>
          <div className="flex flex-col">
            <span className="text-[8px] text-white/40 uppercase font-bold tracking-[0.2em] leading-none">Virtual Debit</span>
            <span className="text-[10px] text-blue-300 font-bold tracking-widest mt-1 uppercase">Select Platinum</span>
          </div>
        </div>

        {/* Card Number */}
        <div className="relative z-10 flex justify-between items-center group">
          <h3 className="text-xl sm:text-2xl font-mono tracking-[0.1em] text-white font-bold drop-shadow-lg">
            {showDetails ? formatCardNumber(cardNumber) : maskedCardNumber(cardNumber)}
          </h3>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            {showDetails ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-auto flex justify-between items-end relative z-10">
          <div className="flex flex-col">
            <span className="text-[8px] text-white/40 uppercase font-bold tracking-widest leading-none mb-1">Card Holder</span>
            <span className="text-xs text-white font-bold tracking-wider uppercase truncate max-w-[150px]">{cardHolder}</span>
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-white/40 uppercase font-bold tracking-widest leading-none mb-1">Expires</span>
              <span className="text-xs text-white font-bold font-mono tracking-widest">{expiry || "00/00"}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-white/40 uppercase font-bold tracking-widest leading-none mb-1">CVV</span>
              <span className="text-xs text-white font-bold font-mono tracking-widest">{showDetails ? cvv : '***'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualCard;
