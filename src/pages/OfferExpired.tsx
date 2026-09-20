import React, { useEffect } from 'react';
import SharedHeader from '../components/SharedHeader';
import SharedFooter from '../components/SharedFooter';
import OfferExpiredModal from '../components/OfferExpiredModal';

interface OfferExpiredProps {
    title?: string;
    subtitle?: string;
    redirectUrl?: string;
}

const OfferExpired: React.FC<OfferExpiredProps> = ({
    title,
    subtitle,
    redirectUrl = 'https://yoga.healthyday.co.in/plans'
}) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-x-hidden">
            <SharedHeader />

            <main className="flex-grow pt-24 md:pt-32 pb-16 px-4 flex items-center justify-center min-h-[60vh]">
                <div className="text-center text-slate-400 py-12">
                    <p className="text-sm">Loading pricing options...</p>
                </div>
            </main>

            <SharedFooter />

            <OfferExpiredModal
                title={title}
                subtitle={subtitle}
                redirectUrl={redirectUrl}
                autoRedirectSeconds={10}
            />
        </div>
    );
};

export default OfferExpired;
