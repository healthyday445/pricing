import React, { useState, useEffect } from 'react';
import RegistrationSuccessPopup21day from '../components/RegistrationSuccessPopup21day';
import TwentyOneDaysHeader from '../components/TwentyOneDaysHeader';

import PhoneInputCustom from '../components/PhoneInputCustom';
import { enforceReferralLimit, recordReferralUse } from '../utils/referralGuard';
interface FreeProgrammesProps {
    defaultLanguage?: 'Telugu' | 'English' | '';
}

const ReferralContestRegistration = ({ defaultLanguage = '' }: FreeProgrammesProps) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        dialCode: '+91',
        language: defaultLanguage
    });
    const [languageError, setLanguageError] = useState(false);
    const [popupStatus, setPopupStatus] = useState<string | null>(null);

    // Referral fraud guard: if this ?ref= has been used 5+ times, strip it and redirect
    useEffect(() => {
        enforceReferralLimit();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.language) {
            setLanguageError(true);
            return;
        }
        setLanguageError(false);

        try {
            const searchParams = new URLSearchParams(window.location.search);
            const source = searchParams.get('source') || searchParams.get('ref') || 'website_organic';

            const gclid = sessionStorage.getItem('gclid_persistent');
            const fbclid = sessionStorage.getItem('fbclid_persistent');

            let id_type = undefined;
            let id_value = undefined;

            if (gclid) {
                id_type = 'gclid';
                id_value = gclid;
            } else if (fbclid) {
                id_type = 'fbclid';
                id_value = fbclid;
            }

            const payload = {
                name: formData.name,
                mobile: formData.dialCode + formData.phone,
                source: source,
                language: formData.language,
                id_type,
                id_value,
                gclid,
                fbclid,
                ad_name: sessionStorage.getItem('ad_name_persistent')
            };

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok || response.status === 409) {
                const resolvedStatus = data.status || 'success';

                // --- GTM Data Layer Push ---
                // Format phone number: strip spaces/dashes, ensure +91 prefix
                let rawPhone = formData.dialCode + formData.phone;
                let formattedPhone = rawPhone.replace(/\s+/g, '').replace(/-/g, '');
                if (!formattedPhone.startsWith('+')) {
                    formattedPhone = '+91' + formattedPhone;
                }

                // Determine popup_id based on status and language
                const isNewReg = resolvedStatus === 'success' || resolvedStatus === 'new_registration';
                const isFreeAgain = resolvedStatus === 'free_eligible_again';
                let currentPopupId: number;
                if (formData.language === 'Telugu') {
                    currentPopupId = isFreeAgain ? 1330 : isNewReg ? 1316 : 1316;
                } else {
                    currentPopupId = isFreeAgain ? 1331 : isNewReg ? 1589 : 1589;
                }

                (window as any).dataLayer = (window as any).dataLayer || [];
                (window as any).dataLayer.push({
                    'user_data': {
                        'phone_number': formattedPhone,
                        'first_name': formData.name,
                        'page_language': formData.language === 'English' ? 'English' : 'Telugu'
                    },
                    'attribution_data': {
                        'gclid': sessionStorage.getItem('gclid_persistent'),
                        'fbclid': sessionStorage.getItem('fbclid_persistent'),
                        'ad_name': sessionStorage.getItem('ad_name_persistent')
                    },
                    'popup_id': currentPopupId
                });
                // --- End GTM Data Layer Push ---

                // Track this referral usage in localStorage
                recordReferralUse();
                setPopupStatus(resolvedStatus);
            } else {
                console.error('Registration failed');
                alert(`Registration failed: ${data.message || 'Please try again.'}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col overflow-x-hidden max-w-[520px] mx-auto relative">
            <TwentyOneDaysHeader />
            <main className="flex-grow flex flex-col items-center justify-start px-4 pt-[120px] pb-8">
                <div className="w-full flex flex-col gap-6">
                    {/* Heading */}
                    <div className="flex flex-col items-center gap-2 text-center px-2">
                        <span className="font-semibold text-[28px] text-[#0d468b] leading-tight">Register for</span>
                        <span className="font-semibold text-[28px] text-[#0d468b] leading-tight">Yoga-Day Give Away</span>
                        <span className="font-medium text-[16px] text-[#202020]">500 Winners - 500 Kits</span>
                    </div>

                    {/* Card */}
                    <div className="w-full flex flex-col items-center">
                        <div className="w-full max-w-[460px] flex flex-col gap-4 bg-white p-5 rounded-2xl shadow-[0px_8px_32px_rgba(0,0,0,0.12)] border border-slate-100">
                            {/* Registration Form Inside Card */}
                            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
                                <div className="w-full flex flex-col gap-3">
                                    <div className="w-full h-[55px] flex items-center gap-2.5 bg-white px-5 py-4 rounded-lg border-[1.2px] border-solid border-[#b4b4b4]">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Full name"
                                            className="w-full outline-none font-normal text-[16px] text-[#202020] placeholder:text-[#8e8e8e]"
                                            required
                                        />
                                    </div>
                                    <div className="w-full">
                                        <PhoneInputCustom
                                            value={formData.phone}
                                            onChange={(phone, dialCode) => setFormData(prev => ({ ...prev, phone, dialCode }))}
                                            placeholder="Enter Your Whatsapp Number"
                                            required
                                            defaultCountry="in"
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex flex-col gap-1.5">
                                    <div className="w-full flex items-center gap-4">
                                        <span className={`font-medium text-[14px] whitespace-nowrap ${languageError ? 'text-red-500' : 'text-[#202020]'}`}>Language: <span className="text-red-500">*</span></span>
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="language"
                                                value="Telugu"
                                                checked={formData.language === 'Telugu'}
                                                onChange={(e) => { handleInputChange(e); setLanguageError(false); }}
                                                className="w-4 h-4 accent-[#0d468b]"
                                            />
                                            <span className="text-[14px] text-[#202020] font-medium">తెలుగు</span>
                                        </label>
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="language"
                                                value="English"
                                                checked={formData.language === 'English'}
                                                onChange={(e) => { handleInputChange(e); setLanguageError(false); }}
                                                className="w-4 h-4 accent-[#0d468b]"
                                            />
                                            <span className="text-[14px] text-[#202020] font-medium">English</span>
                                        </label>
                                    </div>
                                    {languageError && (
                                        <span className="text-red-500 text-[12px] font-medium">⚠ Please select a class language to continue.</span>
                                    )}
                                </div>
                                <button type="submit" className="w-full h-[52px] bg-[#feab27] border-[2px] border-transparent hover:bg-white hover:border-[#feab27] transition-colors rounded-full flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg active:scale-95 duration-200 group mt-1">
                                    <span className="font-bold text-[17px] text-[#202020] uppercase tracking-wide">Register</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <RegistrationSuccessPopup21day
                isOpen={popupStatus !== null}
                onClose={() => setPopupStatus(null)}
                status={popupStatus}
                language={(formData.language || 'Telugu') as 'Telugu' | 'English'}
            />
        </div>
    );
};

export default ReferralContestRegistration;
