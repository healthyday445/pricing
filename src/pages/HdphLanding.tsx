import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import SharedFooter from '../components/SharedFooter';
import PhoneInputCustom from '../components/PhoneInputCustom';
import StudentDetailsModal from '../components/StudentDetailsModal';
import { validatePhone } from '../utils/phoneValidation';
import { cn } from '../lib/utils';

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

const PLANS = {
    new: { title: '12 Months Care Plan', amount: 4999, planName: 'women_hormonal_care_new' },
    upgrade: { title: '12 Months Care Plan (Upgrade)', amount: 2999, planName: 'women_hormonal_care_upgrade' },
} as const;

export type HdphVariant = keyof typeof PLANS;
type Plan = (typeof PLANS)[HdphVariant];

const LANGUAGE = 'Telugu';
const INDIA_DIAL_CODE = '+91';
const RAZORPAY_SCRIPT_ID = 'razorpay-script';
const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

const heroFeatureRows = [
    [
        { label: 'Blood Tests', icon: iconBloodSample, iconClass: 'size-[13px]' },
        { label: 'Individual Doctor Guidance', icon: iconDoctor, iconClass: 'size-[14px]' },
    ],
    [
        { label: 'Expert Diet Plan', icon: iconDiet, iconClass: 'size-[13.5px]' },
        { label: 'Daily Yoga', icon: iconYoga, iconClass: 'size-[18px]', gapClass: 'gap-[3px]' },
    ],
];

// Icon box size/offset and crop percentages come straight from the Figma layers.
const symptoms = [
    { label: 'Irregular Periods', img: symptomIrregularPeriods, boxClass: 'size-[45px] top-[15px]', cropClass: 'size-[128.57%] left-[-17.25%] top-[-12.84%]' },
    { label: 'PCOS / PCOD', img: symptomPcos, boxClass: 'size-[48px] top-[15px]' },
    { label: 'Weight Gain/Difficulty Losing Weight', img: symptomWeight, boxClass: 'size-[42px] top-[11px]', cropClass: 'size-[114.29%] left-[-10.49%] top-[-10.82%]', twoLine: true },
    { label: 'Acne / Skin Changes', img: symptomAcne, boxClass: 'size-[42px] top-[16px]' },
    { label: 'Unwanted Hair Growth', img: symptomHair, boxClass: 'size-[42px] top-[15px]' },
    { label: 'Low Energy', img: symptomEnergy, boxClass: 'size-[48px] top-[14px]' },
    { label: 'Poor Sleep', img: symptomSleep, boxClass: 'size-[45px] top-[16px]' },
    { label: 'Stress', img: symptomStress, boxClass: 'size-[42px] top-[17px]' },
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

const formatInr = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

function useRazorpayScript() {
    useEffect(() => {
        if (document.getElementById(RAZORPAY_SCRIPT_ID)) return;
        const script = document.createElement('script');
        script.id = RAZORPAY_SCRIPT_ID;
        script.src = RAZORPAY_SCRIPT_SRC;
        script.async = true;
        document.body.appendChild(script);
    }, []);
}

// Server-side order creation is best-effort; checkout still opens without an order id.
async function createOrder(plan: Plan, clientKeyId: string) {
    try {
        const res = await fetch('/.netlify/functions/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: plan.amount * 100,
                currency: 'INR',
                isDYJ: false,
                clientKeyId,
                notes: { language: LANGUAGE, plan_name: plan.planName },
            }),
        });
        if (!res.ok) {
            console.warn('create-order response not OK, proceeding with direct client checkout');
            return null;
        }
        const data: { id?: string; key_id?: string } = await res.json().catch(() => ({}));
        return data.id ? { orderId: data.id, keyId: data.key_id ?? clientKeyId } : null;
    } catch (err) {
        console.warn('Could not reach create-order endpoint, proceeding with direct client checkout:', err);
        return null;
    }
}

const SectionHeading = ({ className, children }: { className?: string; children: ReactNode }) => (
    <h2 className={cn('mx-auto max-w-[352px] text-center text-[25px] leading-[37.94px] font-bold text-hdph-navy', className)}>
        {children}
    </h2>
);

const Divider = () => <span className="h-0 w-[74px] border-t-2 border-hdph-amber" />;

const Hero = ({ priceLabel }: { priceLabel: string }) => (
    <section className="bg-[linear-gradient(to_bottom,theme(colors.hdph.cream)_0,#fff_172px)] pt-[30px] pb-[13px]">
        <div className="mx-auto max-w-[430px]">
            <div className="flex h-[22px] items-center justify-center gap-[14px]">
                <Divider />
                <img src={logo} alt="Healthyday" className="h-[22px] w-[111px] object-cover" />
                <Divider />
            </div>

            <h1 className="mx-auto mt-2 max-w-[313px] px-1 text-center text-[28px] leading-[2.5rem] font-semibold">
                Women's Hormonal Health Programme
            </h1>
            <p className="mx-auto mt-3 max-w-[313px] text-center text-[9px] leading-[13.2px] font-medium">
                A Complete Care Programme for PCOS / PCOD &amp; Hormonal Health of Women
            </p>

            <ul className="mt-4 flex flex-col items-center whitespace-nowrap text-[14px] leading-[24.08px] font-semibold text-hdph-blue">
                {heroFeatureRows.map((row) => (
                    <li key={row[0].label} className="flex items-center gap-2">
                        {row.map((feature, i) => (
                            <span key={feature.label} className="contents">
                                {i > 0 && <span aria-hidden className="text-[15px] font-bold">•</span>}
                                <span className={cn('flex items-center gap-[5px]', feature.gapClass)}>
                                    <img src={feature.icon} alt="" className={cn('object-contain', feature.iconClass)} />
                                    {feature.label}
                                </span>
                            </span>
                        ))}
                    </li>
                ))}
            </ul>

            <img
                src={heroImg}
                alt="Doctor, nutrition, yoga and health tracking around a woman meditating"
                className="mt-px aspect-[2/1] w-full object-cover"
            />

            <div className="px-4">
                <div className="mx-auto mt-3 flex h-[86px] max-w-[345px] items-center justify-between rounded-t-xl rounded-b-2xl bg-hdph-navy pl-[17px] pr-[12.5px]">
                    <div className="leading-[1.45] font-medium text-white">
                        <p className="text-[25px]">12-Month</p>
                        <p className="-mt-1 text-[16px]">Care Programme</p>
                    </div>
                    <div className="flex h-[59px] w-[147px] items-center justify-center rounded-t-xl rounded-b-[15px] bg-white">
                        <span className="whitespace-nowrap text-[30px] font-extrabold text-hdph-navy">{priceLabel}/-</span>
                    </div>
                </div>
            </div>

            <p className="mt-[11px] px-2 text-center text-[10px] leading-[26.4px] font-semibold text-hdph-navy">
                Only 50 Women at a time. Click “Enroll now” to check availability
            </p>
        </div>
    </section>
);

const Symptoms = () => (
    <section className="mx-auto max-w-[430px] px-4">
        <SectionHeading className="max-w-none font-semibold">Are you facing any of these?</SectionHeading>
        <ul className="mt-[30px] grid grid-cols-2 gap-x-[15px] gap-y-3">
            {symptoms.map((s) => (
                <li key={s.label} className="relative h-[93px] rounded-2xl bg-hdph-navy">
                    <div className={cn('absolute left-1/2 -translate-x-1/2 overflow-hidden', s.boxClass)}>
                        <img
                            src={s.img}
                            alt=""
                            className={s.cropClass ? cn('absolute max-w-none', s.cropClass) : 'size-full object-cover'}
                        />
                    </div>
                    <p
                        className={cn(
                            'absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-semibold text-white',
                            s.twoLine
                                ? 'top-[70px] w-[142px] text-[11px] leading-[15px]'
                                : 'top-[74px] whitespace-nowrap text-[12px] leading-[17.51px]'
                        )}
                    >
                        {s.label}
                    </p>
                </li>
            ))}
        </ul>
        <p className="mt-[25px] text-center text-[13px] leading-5">
            Every woman's symptoms can be different.
            <br />
            So the approach shouldn't be the same for everyone.
        </p>
    </section>
);

const Journey = () => (
    <section className="mx-auto mt-[50px] max-w-[430px]">
        <SectionHeading>What happens after you join?</SectionHeading>
        <p className="mx-auto mt-2.5 max-w-[311px] text-center text-[12px] leading-5">
            A structured programme where multiple experts work together for your health journey
        </p>

        <ol className="mx-auto mt-10 flex w-fit flex-col gap-[25px]">
            {steps.map((step, i) => (
                <li key={step.title} className="flex items-stretch gap-7">
                    <div className="flex w-[60px] shrink-0 flex-col items-center">
                        <div className="relative size-[60px]">
                            <img src={stepCircle} alt="" width={60} height={60} className="block" />
                            <span className="absolute inset-0 flex items-center justify-center text-[26px] leading-[24.08px] font-bold text-white">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                        </div>
                        {/* Negative margin stretches the connector across the row gap to the next circle. */}
                        {i < steps.length - 1 && <div className="-mb-[25px] w-[3px] flex-1 bg-hdph-rose" />}
                    </div>
                    <div className="flex h-[215px] w-[224px] shrink-0 flex-col items-center rounded-[22px] bg-white px-[7px] pt-1.5 text-center shadow-[0_0_20px_rgba(0,0,0,0.1)]">
                        <div className="h-36 w-full overflow-hidden rounded-t-[18px] rounded-br-[85px]">
                            <img src={step.img} alt="" className="size-full object-cover" loading="lazy" />
                        </div>
                        {/* Size classes go first: tailwind-merge drops a leading-* that precedes a text-* size. */}
                        <h3 className={cn(step.titleClass ?? 'max-w-[181px] text-[11px]', 'mt-[9px] leading-[18.97px] font-semibold uppercase text-hdph-navy')}>
                            {step.title}
                        </h3>
                        <p className={cn(step.descClass ?? 'max-w-[190px] text-[10px]', 'mt-[3px] leading-3')}>
                            {step.desc}
                        </p>
                    </div>
                </li>
            ))}
        </ol>
    </section>
);

const Included = () => (
    <section className="mt-[50px] bg-hdph-blush">
        <div className="mx-auto max-w-[430px] pt-7 pb-10">
            <SectionHeading className="leading-[35px]">Everything Included in Your Programme</SectionHeading>
            <ul className="mt-[33px] flex flex-col gap-[19.6px] px-[41px]">
                {included.map((item) => (
                    <li key={item} className="flex items-center gap-[18px]">
                        <span aria-hidden className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-hdph-navy text-[12px] font-bold text-white">
                            ✓
                        </span>
                        <span className="text-[16px] leading-[1.4] text-[#1c1c1c]">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    </section>
);

type CheckoutSheetProps = {
    phoneNumber: string;
    error: string | null;
    isSubmitting: boolean;
    priceLabel: string;
    onPhoneChange: (phone: string, dialCode: string) => void;
    onSubmit: (e: FormEvent) => void;
};

const CheckoutSheet = ({ phoneNumber, error, isSubmitting, priceLabel, onPhoneChange, onSubmit }: CheckoutSheetProps) => (
    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px]">
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4 rounded-t-[22px] border-[0.5px] border-[#d8d8d8] bg-white p-[22px] shadow-[0_0_20px_rgba(0,0,0,0.1)]"
        >
            <label className="flex gap-1 text-[16px]">
                <span className="font-semibold">Your WhatsApp Number</span>
                <span className="font-bold text-hdph-error">*</span>
            </label>
            <div>
                <PhoneInputCustom
                    value={phoneNumber}
                    onChange={onPhoneChange}
                    placeholder="Enter Your Whatsapp Number"
                    required
                    defaultCountry="in"
                    dropUp
                />
                {error && (
                    <span role="alert" className="mt-1 block text-[12px] font-medium text-red-500">⚠ {error}</span>
                )}
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-[47px] w-full items-center justify-center gap-2 rounded-[30px] bg-hdph-amber px-5 text-[17px] font-semibold tracking-[0.17px] shadow-[0_0_10px_rgba(0,0,0,0.2)] transition-opacity hover:opacity-90 disabled:opacity-60"
            >
                {isSubmitting && <Loader2 className="size-5 animate-spin" />}
                ENROLL NOW — {priceLabel}
            </button>
        </form>
    </div>
);

const HdphLanding = ({ variant }: { variant: HdphVariant }) => {
    const plan = PLANS[variant];
    const priceLabel = formatInr(plan.amount);
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dialCode, setDialCode] = useState(INDIA_DIAL_CODE);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentId, setPaymentId] = useState<string | null>(null);

    useRazorpayScript();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handlePhoneChange = (phone: string, code: string) => {
        setPhoneNumber(phone);
        setDialCode(code);
        setError(null);
    };

    const handleCheckout = async (e: FormEvent) => {
        e.preventDefault();
        if (dialCode !== INDIA_DIAL_CODE) {
            setError('This programme is available for Indian (+91) mobile numbers only.');
            return;
        }
        if (!validatePhone(phoneNumber, dialCode)) {
            setError('Please enter a valid mobile number.');
            return;
        }
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!razorpayKey) {
            setError('Payments are not configured. Please try again later.');
            console.error('VITE_RAZORPAY_KEY_ID is missing');
            return;
        }
        if (!window.Razorpay) {
            setError('Payment gateway failed to load. Please check your internet connection.');
            return;
        }
        setError(null);
        setIsSubmitting(true);
        try {
            const order = await createOrder(plan, razorpayKey);
            new window.Razorpay({
                key: order?.keyId ?? razorpayKey,
                ...(order && { order_id: order.orderId }),
                amount: plan.amount * 100,
                currency: 'INR',
                name: 'Healthyday',
                description: `${plan.title} Subscription`,
                image: '/logo.webp',
                handler: (response: { razorpay_payment_id: string }) => setPaymentId(response.razorpay_payment_id),
                prefill: { name: '', email: '', contact: `${dialCode}${phoneNumber}` },
                notes: { language: LANGUAGE, plan_name: plan.planName },
                theme: { color: '#004e8c' },
            }).open();
        } catch (err) {
            console.error('Razorpay Error:', err);
            setError('Something went wrong with the payment gateway.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen overflow-x-hidden bg-white pb-[200px] font-sans text-hdph-ink">
            <Hero priceLabel={priceLabel} />
            <Symptoms />
            <Journey />
            <Included />
            <div className="mt-[50px]">
                <SharedFooter />
            </div>

            <CheckoutSheet
                phoneNumber={phoneNumber}
                error={error}
                isSubmitting={isSubmitting}
                priceLabel={priceLabel}
                onPhoneChange={handlePhoneChange}
                onSubmit={handleCheckout}
            />

            <StudentDetailsModal
                isOpen={paymentId !== null}
                paymentId={paymentId ?? ''}
                mobile={`${dialCode}${phoneNumber}`}
                onClose={() => setPaymentId(null)}
                onSuccess={() => {
                    setPaymentId(null);
                    navigate('/thank-you', { state: { language: LANGUAGE } });
                }}
            />
        </div>
    );
};

export default HdphLanding;
