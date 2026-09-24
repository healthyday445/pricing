import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SharedFooter from '../components/SharedFooter';
import PhoneInputCustom from '../components/PhoneInputCustom';
import StudentDetailsModal from '../components/StudentDetailsModal';
import { validatePhone } from '../utils/phoneValidation';
import { Loader2 } from 'lucide-react';

import logo from '../assets/hdph-landing/logo.webp';
import heroImg from '../assets/hdph-landing/hero.webp';
import iconBloodSample from '../assets/hdph-landing/icon-blood-sample.webp';
import iconDoctor from '../assets/hdph-landing/icon-doctor.webp';
import iconDiet from '../assets/hdph-landing/icon-diet.webp';
import iconYoga from '../assets/hdph-landing/icon-yoga.webp';
import symptomIrregularPeriods from '../assets/hdph-landing/symptom-irregular-periods.webp';
import symptomPcos from '../assets/hdph-landing/symptom-pcos.webp';
import symptomWeight from '../assets/hdph-landing/symptom-weight.webp';
import symptomAcne from '../assets/hdph-landing/symptom-acne.webp';
import symptomHair from '../assets/hdph-landing/symptom-hair.webp';
import symptomEnergy from '../assets/hdph-landing/symptom-energy.webp';
import symptomSleep from '../assets/hdph-landing/symptom-sleep.webp';
import symptomStress from '../assets/hdph-landing/symptom-stress.webp';
import stepBloodTests from '../assets/hdph-landing/step-blood-tests.webp';
import stepDoctor from '../assets/hdph-landing/step-doctor.webp';
import stepNutrition from '../assets/hdph-landing/step-nutrition.webp';
import stepYoga from '../assets/hdph-landing/step-yoga.webp';
import stepCircle from '../assets/hdph-landing/step-circle.svg';
import stepLine from '../assets/hdph-landing/step-line.svg';

const plan = {
    title: "12 Months Care Plan",
    discountPrice: "4999",
    usdPrice: "49",
    inrPlanName: "12m_new_inr",
    usdPlanName: "12m_new_usd"
};

// Icon size/offset and crop values come straight from the Figma layers.
const symptoms = [
    { label: 'Irregular Periods', img: symptomIrregularPeriods, size: 45, top: 15, crop: { size: '128.57%', left: '-17.25%', top: '-12.84%' } },
    { label: 'PCOS / PCOD', img: symptomPcos, size: 48, top: 15 },
    { label: 'Weight Gain/Difficulty Losing Weight', img: symptomWeight, size: 42, top: 11, crop: { size: '114.29%', left: '-10.49%', top: '-10.82%' }, small: true },
    { label: 'Acne / Skin Changes', img: symptomAcne, size: 42, top: 16 },
    { label: 'Unwanted Hair Growth', img: symptomHair, size: 42, top: 15 },
    { label: 'Low Energy', img: symptomEnergy, size: 48, top: 14 },
    { label: 'Poor Sleep', img: symptomSleep, size: 45, top: 16 },
    { label: 'Stress', img: symptomStress, size: 42, top: 17 },
];

const steps = [
    { title: 'Blood tests & Assessment', desc: 'We collect your blood samples for assessment at your doorstep', img: stepBloodTests },
    { title: 'Individual Doctor Guidance', desc: "1:1 Consultation with an expert doctor in Women's Hormonal health.", img: stepDoctor },
    { title: '1:1 Guidance from Expert Nutritionist', desc: 'A diet plan that is designed for your recovery', img: stepNutrition, titleClass: 'text-[10px] whitespace-nowrap' },
    { title: 'Curated Yoga Programme', desc: "Join Yoga Sessions designed for women's health", img: stepYoga, descClass: 'text-[9px] max-w-[168px]' },
];

const included = [
    'Detailed Health Assessment',
    'Blood Tests',
    'Home Sample Collection',
    'Doctor Consultation',
    'Day-90 Doctor Review',
    'Personalised Nutrition Plan',
    '1:1 Nutrition Consultations',
    'PCOS/PCOD-focused Yoga',
    'Monthly Expert Sessions',
    'Priority Whatsapp Chat Support',
    'Daily Lifestyle Tracking',
    '12-Month Movement Programme',
];

const Divider = () => <span className="h-0 w-[74px] border-t-2 border-[#feab27]" />;

const HdphLanding = () => {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dialCode, setDialCode] = useState('+91');
    const [phoneError, setPhoneError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [paymentId, setPaymentId] = useState('');
    const language = 'Telugu';
    const isUSD = dialCode !== '+91';

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!document.getElementById('razorpay-script')) {
            const script = document.createElement('script');
            script.id = 'razorpay-script';
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePhone(phoneNumber, dialCode)) {
            setPhoneError(true);
            return;
        }
        setPhoneError(false);

        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!razorpayKey) {
            alert("Razorpay Key is missing! Please check your environment variables.");
            return;
        }
        if (!window.Razorpay) {
            alert("Razorpay SDK failed to load. Please check your internet connection.");
            return;
        }

        const fullContact = `${dialCode}${phoneNumber}`;
        const currency = isUSD ? "USD" : "INR";
        const planNameId = isUSD ? plan.usdPlanName : plan.inrPlanName;
        const amountInPaisa = Number(isUSD ? plan.usdPrice : plan.discountPrice) * 100;

        setIsSubmitting(true);
        try {
            let orderId: string | undefined;
            let activeRazorpayKey = razorpayKey;
            try {
                const orderResponse = await fetch('/.netlify/functions/create-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: amountInPaisa,
                        currency,
                        isDYJ: false,
                        clientKeyId: razorpayKey,
                        notes: { language, plan_name: planNameId }
                    })
                });
                if (orderResponse.ok) {
                    const orderData = await orderResponse.json().catch(() => ({}));
                    if (orderData?.id) {
                        orderId = orderData.id;
                        if (orderData.key_id) activeRazorpayKey = orderData.key_id;
                    }
                } else {
                    console.warn("create-order response not OK, proceeding with direct client checkout");
                }
            } catch (err) {
                console.warn("Could not reach create-order endpoint, proceeding with direct client checkout:", err);
            }

            const options: Record<string, unknown> = {
                key: activeRazorpayKey,
                amount: amountInPaisa,
                currency,
                name: "Healthyday",
                description: `${plan.title} Subscription`,
                image: "/logo.webp",
                handler: (response: { razorpay_payment_id: string }) => {
                    setPaymentId(response.razorpay_payment_id);
                    setShowModal(true);
                },
                prefill: { name: "", email: "", contact: fullContact },
                notes: { language, plan_name: planNameId },
                theme: { color: "#004e8c" }
            };
            if (orderId) options.order_id = orderId;

            new window.Razorpay(options).open();
        } catch (error) {
            console.error("Razorpay Error:", error);
            alert("Something went wrong with the payment gateway.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-[#202020] overflow-x-hidden pb-[200px]">
            {/* Hero */}
            <section className="bg-[linear-gradient(to_bottom,#fff2dd_0,#fff_172px)] pt-[30px] pb-[13px]">
                <div className="mx-auto max-w-[430px]">
                    <div className="flex items-center justify-center gap-[14px] h-[22px]">
                        <Divider />
                        <img src={logo} alt="Healthyday" className="h-[22px] w-[111px] object-cover" />
                        <Divider />
                    </div>

                    <h1 className="mt-[8px] mx-auto max-w-[313px] px-1 text-center text-[28px] leading-[2.5rem] font-semibold text-[#202020]">
                        Women's Hormonal Health Programme
                    </h1>
                    <p className="mt-[12px] mx-auto max-w-[313px] text-center text-[9px] leading-[13.2px] font-medium text-[#202020]">
                        A Complete Care Programme for PCOS / PCOD &amp; Hormonal Health of Women
                    </p>

                    <div className="mt-[16px] flex flex-col items-center text-[14px] leading-[24.08px] font-semibold text-[#003a80] whitespace-nowrap">
                        <div className="flex items-center gap-[8px]">
                            <span className="flex items-center gap-[5px]">
                                <img src={iconBloodSample} alt="" className="size-[13px] object-contain" />
                                Blood Tests
                            </span>
                            <span className="text-[15px] font-bold">•</span>
                            <span className="flex items-center gap-[5px]">
                                <img src={iconDoctor} alt="" className="size-[14px] object-contain" />
                                Individual Doctor Guidance
                            </span>
                        </div>
                        <div className="flex items-center gap-[8px]">
                            <span className="flex items-center gap-[5px]">
                                <img src={iconDiet} alt="" className="size-[13.5px] object-contain" />
                                Expert Diet Plan
                            </span>
                            <span className="text-[15px] font-bold">•</span>
                            <span className="flex items-center gap-[3px]">
                                <img src={iconYoga} alt="" className="size-[18px] object-contain" />
                                Daily Yoga
                            </span>
                        </div>
                    </div>

                    <img
                        src={heroImg}
                        alt="Doctor, nutrition, yoga and health tracking around a woman meditating"
                        className="mt-[1px] w-full aspect-[2/1] object-cover"
                    />

                    <div className="px-4">
                        <div className="mt-[12px] mx-auto max-w-[345px] h-[86px] bg-[#0d468b] rounded-t-[12px] rounded-b-[16px] flex items-center justify-between pl-[17px] pr-[12.5px]">
                            <div className="text-white font-medium leading-[1.45]">
                                <p className="text-[25px]">12-Month</p>
                                <p className="text-[16px] -mt-[4px]">Care Programme</p>
                            </div>
                            <div className="w-[147px] h-[59px] bg-white rounded-t-[12px] rounded-b-[15px] flex items-center justify-center">
                                <span className="text-[30px] font-extrabold text-[#0d468b] whitespace-nowrap">₹4,999/-</span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-[11px] text-center text-[10px] leading-[26.4px] font-semibold text-[#0d468b] px-2">
                        Only 50 Women at a time. Click “Enroll now” to check availability
                    </p>
                </div>
            </section>

            {/* Symptoms */}
            <section className="mx-auto max-w-[430px] px-[16px]">
                <h2 className="text-center text-[25px] leading-[37.94px] font-semibold text-[#0d468b]">
                    Are you facing any of these?
                </h2>
                <div className="mt-[30px] grid grid-cols-2 gap-x-[15px] gap-y-[12px]">
                    {symptoms.map((s) => (
                        <div key={s.label} className="relative h-[93px] rounded-[16px] bg-[#0d468b]">
                            <div
                                className="absolute left-1/2 -translate-x-1/2 overflow-hidden"
                                style={{ width: s.size, height: s.size, top: s.top }}
                            >
                                {s.crop ? (
                                    <img
                                        src={s.img}
                                        alt=""
                                        className="absolute max-w-none"
                                        style={{ width: s.crop.size, height: s.crop.size, left: s.crop.left, top: s.crop.top }}
                                    />
                                ) : (
                                    <img src={s.img} alt="" className="size-full object-cover" />
                                )}
                            </div>
                            <p
                                className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-semibold text-white ${s.small
                                    ? 'top-[70px] w-[142px] text-[11px] leading-[15px]'
                                    : 'top-[74px] whitespace-nowrap text-[12px] leading-[17.51px]'
                                    }`}
                            >
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>
                <p className="mt-[25px] text-center text-[13px] leading-[20px] text-[#202020]">
                    Every woman's symptoms can be different.
                    <br />
                    So the approach shouldn't be the same for everyone.
                </p>
            </section>

            {/* Journey */}
            <section className="mx-auto max-w-[430px] mt-[50px]">
                <h2 className="mx-auto max-w-[352px] text-center text-[25px] leading-[37.94px] font-bold text-[#0d468b]">
                    What happens after you join?
                </h2>
                <p className="mt-[10px] mx-auto max-w-[311px] text-center text-[12px] leading-[20px] text-[#202020]">
                    A structured programme where multiple experts work together for your health journey
                </p>

                <div className="relative mt-[40px] pl-[42px] pr-[35px] flex flex-col gap-[25px]">
                    <div className="absolute left-[70.5px] top-[60px] h-[690px] w-[3px]">
                        <img
                            src={stepLine}
                            alt=""
                            width={690}
                            height={3}
                            className="block max-w-none origin-top-left translate-x-[3px] rotate-90"
                        />
                    </div>
                    {steps.map((step, i) => (
                        <div key={step.title} className="relative flex items-start justify-between gap-2">
                            <div className="relative size-[60px] shrink-0">
                                <img src={stepCircle} alt="" width={60} height={60} className="block" />
                                <span className="absolute inset-0 flex items-center justify-center text-[26px] leading-[24.08px] font-bold text-white">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                            </div>
                            <div className="w-full max-w-[224px] h-[215px] rounded-[22px] bg-white shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] pt-[6px] px-[7px] flex flex-col items-center text-center">
                                <div className="w-full h-[144px] overflow-hidden rounded-t-[18px] rounded-br-[85px]">
                                    <img src={step.img} alt="" className="size-full object-cover" loading="lazy" />
                                </div>
                                <p className={`mt-[9px] leading-[18.97px] font-semibold uppercase text-[#0d468b] ${step.titleClass ?? 'text-[11px] max-w-[181px]'}`}>
                                    {step.title}
                                </p>
                                <p className={`mt-[3px] leading-[12px] text-[#202020] ${step.descClass ?? 'text-[10px] max-w-[190px]'}`}>
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* What's included */}
            <section className="mt-[50px] bg-[#ffedf0]">
                <div className="mx-auto max-w-[430px] pt-[28px] pb-[40px]">
                    <h2 className="mx-auto max-w-[352px] text-center text-[25px] leading-[35px] font-bold text-[#0d468b]">
                        Everything Included in Your Programme
                    </h2>
                    <ul className="mt-[33px] px-[41px] flex flex-col gap-[19.6px]">
                        {included.map((item) => (
                            <li key={item} className="flex items-center gap-[18px]">
                                <span className="size-[22px] shrink-0 rounded-full bg-[#0e468a] flex items-center justify-center text-[12px] font-bold text-white">
                                    ✓
                                </span>
                                <span className="text-[16px] leading-[1.4] text-[#1c1c1c]">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <div className="mt-[50px]">
                <SharedFooter />
            </div>

            {/* Checkout form (sticky bottom sheet) */}
            <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px]">
                <form
                    onSubmit={handleCheckout}
                    className="bg-white border-[0.5px] border-[#d8d8d8] rounded-t-[22px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] p-[22px] flex flex-col gap-[16px]"
                >
                    <label className="flex gap-[4px] text-[16px]">
                        <span className="font-semibold text-[#202020]">Your WhatsApp Number</span>
                        <span className="font-bold text-[#e11d2e]">*</span>
                    </label>
                    <div>
                        <PhoneInputCustom
                            value={phoneNumber}
                            onChange={(phone, code) => {
                                setPhoneNumber(phone);
                                setDialCode(code);
                                setPhoneError(false);
                            }}
                            placeholder="Enter Your Whatsapp Number"
                            required
                            defaultCountry="in"
                            dropUp
                        />
                        {phoneError && (
                            <span className="text-red-500 text-[12px] font-medium mt-1 block">⚠ Please enter a valid mobile number.</span>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-[47px] w-full rounded-[30px] bg-[#feab27] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.2)] px-[20px] flex items-center justify-center gap-2 text-[17px] font-semibold tracking-[0.17px] text-[#202020] transition-opacity hover:opacity-90 disabled:opacity-60"
                    >
                        {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                        ENROLL NOW — {isUSD ? `$${plan.usdPrice}` : '₹4,999'}
                    </button>
                </form>
            </div>

            <StudentDetailsModal
                isOpen={showModal}
                paymentId={paymentId}
                mobile={`${dialCode}${phoneNumber}`}
                onClose={() => setShowModal(false)}
                onSuccess={() => {
                    setShowModal(false);
                    navigate('/thank-you', { state: { language } });
                }}
            />
        </div>
    );
};

export default HdphLanding;
