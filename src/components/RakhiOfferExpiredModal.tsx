import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowRight, Clock } from 'lucide-react';

interface RakhiOfferExpiredModalProps {
    redirectUrl?: string;
    autoRedirectSeconds?: number;
}

const RakhiOfferExpiredModal: React.FC<RakhiOfferExpiredModalProps> = ({
    redirectUrl = 'https://yoga.healthyday.co.in/pricing',
    autoRedirectSeconds = 10
}) => {
    const [timeLeft, setTimeLeft] = useState(autoRedirectSeconds);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    window.location.href = redirectUrl;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [redirectUrl]);

    const handleRedirect = () => {
        window.location.href = redirectUrl;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden text-center p-8 transform transition-all duration-300 scale-100 animate-scaleUp">
                {/* Expired Icon Badge */}
                <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-amber-50 border-4 border-amber-100 flex items-center justify-center shadow-inner">
                    <AlertCircle className="w-10 h-10 text-amber-600" strokeWidth={2.2} />
                </div>

                {/* Main Heading */}
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-3 tracking-tight leading-snug">
                    This offer has been expired!
                </h2>

                {/* Subtitle */}
                <p className="text-slate-600 text-base md:text-lg mb-6 font-medium">
                    You can check our regular plans.
                </p>

                {/* Countdown Progress Banner */}
                <div className="mb-6 py-2.5 px-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-center gap-2 text-slate-700 text-sm font-semibold">
                    <Clock className="w-4 h-4 text-[#0D468B] animate-spin" style={{ animationDuration: '3s' }} />
                    <span>
                        Redirecting automatically in{' '}
                        <strong className="text-[#0D468B] font-bold text-base px-1">{timeLeft}</strong>{' '}
                        seconds...
                    </span>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleRedirect}
                    className="w-full py-4 px-6 rounded-full font-bold text-white text-base bg-gradient-to-r from-[#0D468B] to-[#1C7EB3] hover:from-[#0a376f] hover:to-[#176a97] shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                >
                    <span>Check Regular Plans</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default RakhiOfferExpiredModal;
