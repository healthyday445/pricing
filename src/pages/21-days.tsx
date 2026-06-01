import React, { useState, useEffect } from 'react';
import TwentyOneDaysHeader from '../components/TwentyOneDaysHeader';
import TwentyOneDaysFooter from '../components/TwentyOneDaysFooter';
import TwentyOneDaysTestimonials from '../components/TwentyOneDaysTestimonials';
import RegistrationSuccessPopup21day from '../components/RegistrationSuccessPopup21day';

import smileySick from '../assets/streamline-freehand_smiley-sick-contageous.png';
import PhoneInputCustom from '../components/PhoneInputCustom';
import { enforceReferralLimit, recordReferralUse } from '../utils/referralGuard';
interface FreeProgrammesProps {
    defaultLanguage?: 'Telugu' | 'English' | '';
}

const TwentyOneDays = ({ defaultLanguage = '' }: FreeProgrammesProps) => {
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

            <main className="flex-grow flex flex-col items-center justify-start pt-[80px] pb-4 px-0">
                <div className="w-full flex flex-col">
                    {/* Hero Image */}
                    <div className="w-full">
                        <img src="/src/assets/IYD-reg-page-hero.png" alt="21 Days FREE Yoga" className="w-full" />
                    </div>

                    {/* Card Column */}
                    <div className="w-full flex flex-col items-center bg-[#EEF4FF] pb-6">
                        {/* Unified Card Container */}
                        <div className="w-[90%] max-w-[500px] flex flex-col items-center gap-8 bg-white p-5 md:p-8 rounded-[30px] shadow-[0px_10px_40px_rgba(0,0,0,0.25)] border border-slate-100 relative z-10 -mt-12">
                            {/* Registration Form Inside Card */}
                            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-5">
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
                                <div className="w-full flex flex-col gap-1">
                                    <div className="w-full flex items-center gap-3 py-1">
                                        <span className={`font-medium text-[14px] whitespace-nowrap ${languageError ? 'text-red-500' : 'text-[#202020]'}`}>Select Class Language: <span className="text-red-500">*</span></span>
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
                                        <span className="text-red-500 text-[12px] font-medium pl-1">⚠ Please select a class language to continue.</span>
                                    )}
                                </div>
                                <button type="submit" className="w-full h-[56px] bg-[#feab27] border-[2px] border-transparent hover:bg-white hover:border-[#feab27] transition-colors rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transform active:scale-95 duration-200 group">
                                    <span className="font-bold text-[18px] text-[#202020] uppercase tracking-wide group-hover:text-[#202020]">Register For Free</span>
                                </button>
                                <span className="font-semibold text-[16px] text-center text-[#0d468b]">6,04,017+ members participated</span>
                            </form>

                            {/* Benefits Inside Card */}
                            <div className="flex flex-col items-center gap-5 w-full">
                                <span className="font-semibold text-[18px] text-center text-[#feab27]">Benefits</span>
                                <div className="flex flex-wrap justify-between items-start w-full px-2">
                                    <div className="w-[30%] flex flex-col items-center gap-[6px]">
                                        <div className="w-8 h-8 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M2.03401 20.305C3.16301 21.92 8.07501 23.187 10.396 20.165C12.906 21.365 17.045 20.993 20.416 19.113C20.884 18.853 21.327 18.523 21.599 18.059C22.212 17.014 22.226 15.564 21.108 13.425C19.243 8.77099 15.89 4.68499 14.536 3.04199C14.258 2.78899 12.485 2.42899 11.403 2.08199C10.925 1.93499 10.036 1.83699 8.97301 3.23899C8.46801 3.90299 6.17701 5.53599 9.08301 6.63299C9.53401 6.74799 9.86501 6.95899 11.92 6.58399C12.187 6.53799 12.855 6.58399 13.326 7.40999L14.31 8.81699C14.402 8.94733 14.4601 9.09856 14.479 9.25699C14.651 10.756 14.645 12.632 15.481 13.583C14.191 12.649 10.817 11.541 8.27501 14.695M2.01801 12.94C3.16235 11.92 4.62125 11.3224 6.15228 11.2463C7.6833 11.1703 9.19424 11.6204 10.434 12.522" stroke="#0D468B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <span className="font-medium text-[14px] text-center text-[#202020] leading-tight">Strength and Flexibility</span>
                                    </div>
                                    <div className="w-[30%] flex flex-col items-center gap-[6px]">
                                        <div className="w-8 h-8 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M6.5 11C7.067 11.63 7.756 12 8.5 12C9.244 12 9.933 11.63 10.5 11M13.5 11C14.067 11.63 14.756 12 15.5 12C16.244 12 16.933 11.63 17.5 11" stroke="#0D468B" strokeWidth="1.5" strokeLinecap="round" />
                                                <path d="M13 16C13 16.2652 12.8946 16.5196 12.7071 16.7071C12.5196 16.8946 12.2652 17 12 17C11.7348 17 11.4804 16.8946 11.2929 16.7071C11.1054 16.5196 11 16.2652 11 16C11 15.7348 11.1054 15.4804 11.2929 15.2929C11.4804 15.1054 11.7348 15 12 15C12.2652 15 12.5196 15.1054 12.7071 15.2929C12.8946 15.4804 13 15.7348 13 16Z" fill="#0D468B" />
                                                <path d="M17 4L20.464 2L19 7.464L22.464 5.464M14.048 5.5L15.78 6.5L13.048 7.232L14.78 8.232" stroke="#0D468B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M22 12C22 17.523 17.523 22 12 22C10.2445 22.0024 8.51963 21.5408 7 20.662M12 2C6.477 2 2 6.477 2 12C2 13.821 2.487 15.53 3.338 17" stroke="#0D468B" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                        <span className="font-medium text-[14px] text-center text-[#202020] leading-tight">Eat, Sleep and Breath Well</span>
                                    </div>
                                    <div className="w-[30%] flex flex-col items-center gap-[6px]">
                                        <div className="w-8 h-8 flex items-center justify-center">
                                            <img src={smileySick} alt="Eat, Sleep and Breath Well" className="w-[24px] h-[24px]" />
                                        </div>
                                        <span className="font-medium text-[14px] text-center text-[#202020] leading-tight">Recover from Lifestyle diseases</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <TwentyOneDaysTestimonials />
            </main>

            <TwentyOneDaysFooter />
            <RegistrationSuccessPopup21day
                isOpen={popupStatus !== null}
                onClose={() => setPopupStatus(null)}
                status={popupStatus}
                language={(formData.language || 'Telugu') as 'Telugu' | 'English'}
            />
        </div>
    );
};

export default TwentyOneDays;
