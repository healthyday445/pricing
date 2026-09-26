import { useEffect, useState } from 'react';
import {
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Flower2,
    HeartPulse,
    ListChecks,
    Loader2,
    Lock,
    MapPin,
    Ruler,
    Salad,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Upload,
    UserRound,
    type LucideIcon,
} from 'lucide-react';
import TwentyOneDaysHeader from '../components/TwentyOneDaysHeader';
import PhoneInputCustom from '../components/PhoneInputCustom';
import { validatePhone, formatPhone } from '../utils/phoneValidation';
import {
    FORM_TITLE,
    FORM_SUBTITLE,
    FORM_DESCRIPTION,
    SECTIONS,
    type Question,
} from '../utils/hormonalAssessmentQuestions';
import {
    fetchExistingSubmission,
    submitAssessment,
    type AssessmentAnswers,
} from '../utils/hormonalAssessmentApi';

const ACCENT = '#C34C7E';
const OTHER = 'Other';
const otherKey = (id: string) => `${id}_other`;

const SECTION_ICONS: Record<string, LucideIcon> = {
    user_details: UserRound,
    personal_details: MapPin,
    body_measurements: Ruler,
    weight_pattern: TrendingUp,
    hormonal_history: Flower2,
    health_lifestyle: HeartPulse,
    eating_pattern: Salad,
};

const isVisible = (q: Question, answers: AssessmentAnswers) => {
    if (!q.showIf) return true;
    const value = answers[q.showIf.questionId];
    return typeof value === 'string' && q.showIf.values.includes(value);
};

const isEmpty = (value: string | string[] | undefined) =>
    value === undefined || (Array.isArray(value) ? value.length === 0 : value.trim() === '');

const selectedOther = (q: Question, answers: AssessmentAnswers) => {
    const value = answers[q.id];
    return Array.isArray(value) ? value.includes(OTHER) : value === OTHER;
};

// Short text-like questions sit two per row on wider screens; everything else spans the full width.
const isCompact = (q: Question) => ['short', 'number', 'date'].includes(q.type) && q.label.length <= 32;

const HormonalCarePlanAssessment = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<AssessmentAnswers>({});
    const [phone, setPhone] = useState('');
    const [dialCode, setDialCode] = useState('+91');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [readOnly, setReadOnly] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const section = SECTIONS[step];
    const isLastStep = step === SECTIONS.length - 1;
    const locked = readOnly && step > 0;
    const SectionIcon = SECTION_ICONS[section.id];

    useEffect(() => {
        document.title = 'Health Assessment-Healthyday';
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [step, submitted]);

    const clearError = (id: string) =>
        setErrors(prev => {
            const rest = { ...prev };
            delete rest[id];
            return rest;
        });

    const setAnswer = (id: string, value: string | string[]) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
        clearError(id);
    };

    const toggleCheckbox = (q: Question, option: string) => {
        const current = (answers[q.id] as string[]) || [];
        let next: string[];
        if (current.includes(option)) next = current.filter(o => o !== option);
        else if (option === q.exclusiveOption) next = [option];
        else next = [...current.filter(o => o !== q.exclusiveOption), option];
        setAnswer(q.id, next);
    };

    const validateStep = () => {
        const stepErrors: Record<string, string> = {};
        section.questions.forEach(q => {
            if (q.disabled || !isVisible(q, answers)) return;
            if (q.type === 'phone') {
                if (!validatePhone(phone, dialCode)) {
                    stepErrors[q.id] = `Please enter a valid ${dialCode === '+91' ? '10-digit ' : ''}mobile number.`;
                }
                return;
            }
            if (q.required && isEmpty(answers[q.id])) stepErrors[q.id] = 'This question is required';
            else if (selectedOther(q, answers) && isEmpty(answers[otherKey(q.id)])) {
                stepErrors[q.id] = 'Please specify your "Other" answer';
            }
        });
        setErrors(stepErrors);
        const firstError = section.questions.find(q => stepErrors[q.id]);
        if (firstError) {
            requestAnimationFrame(() =>
                document.getElementById(`q-${firstError.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            );
        }
        return !firstError;
    };

    const checkExistingSubmission = async () => {
        const mobile = formatPhone(phone, dialCode);
        const userDetails = { full_name: answers.full_name, mobile };
        setLoading(true);
        try {
            const existing = await fetchExistingSubmission(mobile);
            if (existing) {
                setAnswers({ ...userDetails, ...existing });
                setReadOnly(true);
            } else {
                // Drop answers prefilled for a different number before continuing as a new submission.
                setAnswers(prev => (readOnly ? userDetails : { ...prev, ...userDetails }));
                setReadOnly(false);
            }
        } catch (error) {
            // Don't block the student if the lookup fails; let them fill the form.
            console.error('Failed to check existing submission:', error);
            setAnswers(prev => (readOnly ? userDetails : { ...prev, ...userDetails }));
            setReadOnly(false);
        } finally {
            setLoading(false);
        }
    };

    const buildAnswers = () => {
        const result: AssessmentAnswers = {};
        SECTIONS.flatMap(s => s.questions).forEach(q => {
            if (q.disabled || !isVisible(q, answers) || isEmpty(answers[q.id])) return;
            result[q.id] = answers[q.id];
            if (selectedOther(q, answers)) result[otherKey(q.id)] = answers[otherKey(q.id)];
        });
        return result;
    };

    const handleNext = async () => {
        // User details are always editable; later steps are only validated for new submissions.
        if ((step === 0 || !readOnly) && !validateStep()) return;
        if (step === 0) await checkExistingSubmission();
        setStep(s => s + 1);
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;
        setSubmitError('');
        setLoading(true);
        try {
            await submitAssessment({ mobile: formatPhone(phone, dialCode), answers: buildAnswers() });
            setSubmitted(true);
        } catch (error) {
            console.error('Failed to submit assessment:', error);
            setSubmitError('Something went wrong while submitting. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // text-[16px] on inputs stops iOS Safari from zooming in on focus.
    const fieldClass = (q: Question) =>
        `w-full h-12 rounded-xl border bg-[#FFFAFC] px-4 text-[16px] text-[#2B1D24] outline-none transition placeholder:text-[#B8A3AD] focus:bg-white focus:border-[#C34C7E] focus:ring-4 focus:ring-[#C34C7E]/10 disabled:bg-[#FAF5F7] disabled:text-[#5B4751] ${
            errors[q.id] ? 'border-[#E5484D]' : 'border-[#EBD9E1]'
        }`;

    const renderOptions = (q: Question) => {
        const value = answers[q.id];
        const options = q.allowOther ? [...q.options, OTHER] : q.options;
        const isChecked = (option: string) =>
            q.type === 'radio' ? value === option : ((value as string[]) || []).includes(option);
        const select = (option: string) => (q.type === 'radio' ? setAnswer(q.id, option) : toggleCheckbox(q, option));
        const pills = options.every(o => o.length <= 16);

        return (
            <div className="flex flex-col gap-3">
                <div className={pills ? 'flex flex-wrap gap-2' : 'flex flex-col gap-2'}>
                    {options.map(option => {
                        const checked = isChecked(option);
                        return (
                            <label
                                key={option}
                                className={`relative flex items-center cursor-pointer select-none border transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[#C34C7E]/20 has-[:disabled]:cursor-default ${
                                    pills
                                        ? `min-h-[44px] px-4 rounded-full text-[15px] ${
                                              checked
                                                  ? 'bg-[#C34C7E] border-[#C34C7E] text-white'
                                                  : 'bg-white border-[#EBD9E1] text-[#2B1D24]'
                                          }`
                                        : `min-h-[52px] gap-3 px-4 py-3 rounded-xl text-[15px] leading-snug ${
                                              checked
                                                  ? 'bg-[#FBEFF4] border-[#C34C7E] text-[#2B1D24]'
                                                  : 'bg-white border-[#EBD9E1] text-[#2B1D24]'
                                          }`
                                }`}
                            >
                                <input
                                    type={q.type}
                                    name={q.id}
                                    checked={checked}
                                    onChange={() => select(option)}
                                    className="sr-only"
                                />
                                {!pills && (
                                    <span
                                        className={`shrink-0 w-5 h-5 flex items-center justify-center border-2 transition ${
                                            q.type === 'radio' ? 'rounded-full' : 'rounded-md'
                                        } ${checked ? 'border-[#C34C7E] bg-[#C34C7E]' : 'border-[#D5BFC9] bg-white'}`}
                                    >
                                        {checked &&
                                            (q.type === 'radio' ? (
                                                <span className="w-2 h-2 rounded-full bg-white" />
                                            ) : (
                                                <Check size={14} strokeWidth={3} className="text-white" />
                                            ))}
                                    </span>
                                )}
                                {pills && checked && q.type === 'checkbox' && (
                                    <Check size={16} strokeWidth={3} className="mr-1.5 -ml-1" />
                                )}
                                <span>{option}</span>
                            </label>
                        );
                    })}
                </div>
                {selectedOther(q, answers) && (
                    <input
                        type="text"
                        value={(answers[otherKey(q.id)] as string) || ''}
                        onChange={e => setAnswer(otherKey(q.id), e.target.value)}
                        placeholder="Please specify"
                        className={fieldClass(q)}
                    />
                )}
            </div>
        );
    };

    const renderInput = (q: Question) => {
        const value = (answers[q.id] as string) || '';
        switch (q.type) {
            case 'short':
            case 'number':
                return (
                    <div className="relative">
                        <input
                            type="text"
                            inputMode={q.type === 'number' ? 'decimal' : undefined}
                            value={value}
                            onChange={e =>
                                setAnswer(q.id, q.type === 'number' ? e.target.value.replace(/[^0-9.]/g, '') : e.target.value)
                            }
                            placeholder="Your answer"
                            className={`${fieldClass(q)} ${q.unit ? 'pr-16' : ''}`}
                        />
                        {q.unit && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#9C8792] pointer-events-none">
                                {q.unit}
                            </span>
                        )}
                    </div>
                );
            case 'paragraph':
                return (
                    <textarea
                        value={value}
                        onChange={e => setAnswer(q.id, e.target.value)}
                        placeholder="Your answer"
                        rows={3}
                        className={`${fieldClass(q)} h-auto py-3 resize-y`}
                    />
                );
            case 'date':
                return (
                    <input
                        type="date"
                        value={value}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={e => setAnswer(q.id, e.target.value)}
                        className={`${fieldClass(q)} appearance-none`}
                    />
                );
            case 'phone':
                return (
                    <PhoneInputCustom
                        value={phone}
                        onChange={(p, code) => {
                            setPhone(p);
                            setDialCode(code);
                            clearError(q.id);
                        }}
                        placeholder="Mobile number"
                        defaultCountry="in"
                    />
                );
            case 'file':
                return (
                    <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-[#EBD9E1] bg-[#FFFAFC] px-4 py-6 text-center">
                        <Upload size={22} className="text-[#C9B3BD]" />
                        <span className="text-[14px] font-medium text-[#9C8792]">Upload prescriptions</span>
                        <span className="text-[12px] font-medium px-2.5 py-1 rounded-full bg-[#F4E6EC] text-[#9C4A6E]">
                            Coming soon
                        </span>
                    </div>
                );
            case 'radio':
            case 'checkbox':
                return renderOptions(q);
        }
    };

    const primaryButton = (label: string, onClick: () => void, loadingLabel: string) => (
        <button
            type="button"
            onClick={onClick}
            disabled={loading}
            className="flex-1 h-12 rounded-full text-white text-[16px] font-semibold flex items-center justify-center gap-1.5 shadow-[0_6px_20px_rgba(195,76,126,0.35)] active:scale-[0.98] transition disabled:opacity-70"
            style={{ backgroundColor: ACCENT }}
        >
            {loading ? (
                <>
                    <Loader2 size={18} className="animate-spin" /> {loadingLabel}
                </>
            ) : (
                <>
                    {label} {label !== 'Submit' && <ChevronRight size={18} />}
                </>
            )}
        </button>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FDF2F7] via-[#FBEFF4] to-[#F7E6ED] relative overflow-x-clip">
            <TwentyOneDaysHeader />

            <main
                className="max-w-[600px] mx-auto px-4 pt-[96px] flex flex-col gap-4"
                style={{ paddingBottom: submitted ? 40 : 'calc(120px + env(safe-area-inset-bottom))' }}
            >
                {/* Intro */}
                {step === 0 && !submitted && (
                    <div className="flex flex-col gap-3 pt-2">
                        <span className="self-start inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-[#F3D5E2] px-3 py-1 text-[12px] font-medium text-[#9C4A6E]">
                            <Sparkles size={14} /> Women's Hormonal Health Care Plan
                        </span>
                        <h1 className="text-[26px] sm:text-[32px] font-bold leading-tight text-[#2B1D24]">
                            {FORM_TITLE}
                            <span className="block text-[18px] sm:text-[22px] font-semibold mt-1" style={{ color: ACCENT }}>
                                {FORM_SUBTITLE}
                            </span>
                        </h1>
                        <p className="text-[14px] leading-relaxed text-[#6B5761]">{FORM_DESCRIPTION}</p>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {[
                                { icon: ListChecks, text: `${SECTIONS.length} short steps` },
                                { icon: ShieldCheck, text: 'Kept confidential' },
                            ].map(({ icon: Icon, text }) => (
                                <span
                                    key={text}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13px] text-[#5B4751] border border-[#F0E1E8]"
                                >
                                    <Icon size={15} style={{ color: ACCENT }} /> {text}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {submitted ? (
                    <div className="mt-6 bg-white rounded-3xl border border-[#F3E3EA] shadow-[0_8px_30px_rgba(195,76,126,0.08)] px-6 py-10 flex flex-col items-center text-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-[#FBEFF4] flex items-center justify-center">
                            <CheckCircle2 size={36} style={{ color: ACCENT }} />
                        </div>
                        <h2 className="text-[22px] font-bold text-[#2B1D24]">
                            Thank you{answers.full_name ? `, ${answers.full_name}` : ''}!
                        </h2>
                        <p className="text-[15px] leading-relaxed text-[#6B5761] max-w-[380px]">
                            Your assessment has been submitted. Our team will review your answers to prepare your
                            personalised health plan.
                        </p>
                    </div>
                ) : (
                    <>
                        {locked && (
                            <div className="flex gap-3 rounded-2xl bg-white border border-[#F3D5E2] p-4">
                                <div className="shrink-0 w-10 h-10 rounded-full bg-[#FBEFF4] flex items-center justify-center">
                                    <Lock size={18} style={{ color: ACCENT }} />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[15px] font-semibold text-[#2B1D24]">Already submitted</span>
                                    <span className="text-[13.5px] leading-relaxed text-[#6B5761]">
                                        These are the answers you shared earlier. If you want to alter anything, please
                                        contact support.
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Section */}
                        <section className="bg-white rounded-3xl border border-[#F3E3EA] shadow-[0_8px_30px_rgba(195,76,126,0.08)] p-5 sm:p-7">
                            <div className="flex items-start gap-3 pb-5 mb-5 border-b border-[#F5EAEF]">
                                <div className="shrink-0 w-11 h-11 rounded-2xl bg-[#FBEFF4] flex items-center justify-center">
                                    <SectionIcon size={22} style={{ color: ACCENT }} />
                                </div>
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: ACCENT }}>
                                        Step {step + 1} of {SECTIONS.length}
                                    </span>
                                    <h2 className="text-[18px] sm:text-[20px] font-semibold leading-snug text-[#2B1D24]">
                                        {section.title}
                                    </h2>
                                    <p className="text-[13.5px] leading-snug text-[#8A7480]">{section.subtitle}</p>
                                </div>
                            </div>

                            <fieldset disabled={locked} className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 min-w-0">
                                {section.questions
                                    .filter(q => isVisible(q, answers))
                                    .map(q => (
                                        <div
                                            key={q.id}
                                            id={`q-${q.id}`}
                                            className={`flex flex-col gap-2.5 min-w-0 scroll-mt-24 ${
                                                isCompact(q) ? '' : 'sm:col-span-2'
                                            }`}
                                        >
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[15px] font-medium leading-snug text-[#2B1D24]">
                                                    {q.label}
                                                    {q.required && <span style={{ color: ACCENT }}> *</span>}
                                                </span>
                                                {q.description && (
                                                    <span className="text-[13px] leading-snug text-[#8A7480]">
                                                        {q.description}
                                                    </span>
                                                )}
                                            </div>
                                            {renderInput(q)}
                                            {errors[q.id] && (
                                                <span className="text-[13px] font-medium text-[#E5484D]">{errors[q.id]}</span>
                                            )}
                                        </div>
                                    ))}
                            </fieldset>
                        </section>

                        {submitError && (
                            <p className="text-[14px] font-medium text-[#E5484D] text-center">{submitError}</p>
                        )}
                    </>
                )}
            </main>

            {/* Sticky actions */}
            {!submitted && (
                <div
                    className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F0E1E8]"
                    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
                >
                    {/* Body is a scroll container (overflow-x on html + body in index.css), so progress lives here instead of a sticky header. */}
                    <div className="max-w-[600px] mx-auto px-4 pt-3 flex gap-1.5" aria-hidden="true">
                        {SECTIONS.map((s, i) => (
                            <div
                                key={s.id}
                                className="h-1 flex-1 rounded-full transition-colors"
                                style={{ backgroundColor: i <= step ? ACCENT : '#EBD9E1', opacity: i < step ? 0.55 : 1 }}
                            />
                        ))}
                    </div>
                    <div className="max-w-[600px] mx-auto px-4 py-3 flex items-center gap-3">
                        {step > 0 && (
                            <button
                                type="button"
                                onClick={() => setStep(s => s - 1)}
                                disabled={loading}
                                aria-label="Back"
                                className={`h-12 rounded-full border border-[#EBD9E1] bg-white flex items-center justify-center gap-1 text-[16px] font-medium text-[#5B4751] active:scale-[0.98] transition disabled:opacity-60 ${
                                    locked && isLastStep ? 'flex-1' : 'w-12 shrink-0'
                                }`}
                            >
                                <ChevronLeft size={20} />
                                {locked && isLastStep && 'Back'}
                            </button>
                        )}
                        {!isLastStep && primaryButton('Continue', handleNext, step === 0 ? 'Checking…' : 'Loading…')}
                        {isLastStep && !readOnly && primaryButton('Submit', handleSubmit, 'Submitting…')}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HormonalCarePlanAssessment;
