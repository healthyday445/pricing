import React, { useState } from 'react';
import TwentyOneDaysHeader from '../components/TwentyOneDaysHeader';
import PhoneInputCustom from '../components/PhoneInputCustom';
import { validatePhone } from '../utils/phoneValidation';

// TODO: Replace demo questions with the final assessment questions.
type Question =
    | { id: string; label: string; type: 'text' | 'number'; placeholder?: string; required?: boolean }
    | { id: string; label: string; type: 'radio' | 'checkbox'; options: string[]; required?: boolean }
    | { id: string; label: string; type: 'textarea'; placeholder?: string; required?: boolean };

const QUESTIONS: Question[] = [
    { id: 'age', label: 'Age', type: 'number', placeholder: 'Enter your age', required: true },
    {
        id: 'cycle',
        label: 'How regular is your menstrual cycle?',
        type: 'radio',
        options: ['Regular', 'Irregular', 'Missed periods', 'Menopause'],
        required: true,
    },
    {
        id: 'concerns',
        label: 'Which concerns are you facing? (select all that apply)',
        type: 'checkbox',
        options: ['PCOS / PCOD', 'Thyroid', 'Weight gain', 'Hair fall', 'Mood swings', 'Low energy'],
    },
    {
        id: 'sleep',
        label: 'How many hours do you sleep on average?',
        type: 'radio',
        options: ['Less than 5', '5 - 7', 'More than 7'],
        required: true,
    },
    { id: 'notes', label: 'Anything else you would like us to know?', type: 'textarea', placeholder: 'Optional' },
];

type Answers = Record<string, string | string[]>;

const HormonalCarePlanAssessment = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [dialCode, setDialCode] = useState('+91');
    const [answers, setAnswers] = useState<Answers>({});
    const [phoneError, setPhoneError] = useState(false);
    const [missing, setMissing] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState(false);

    const setAnswer = (id: string, value: string | string[]) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
        setMissing(prev => prev.filter(m => m !== id));
    };

    const toggleOption = (id: string, option: string) => {
        const current = (answers[id] as string[]) || [];
        setAnswer(id, current.includes(option) ? current.filter(o => o !== option) : [...current, option]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePhone(phone, dialCode)) {
            setPhoneError(true);
            return;
        }
        setPhoneError(false);

        const unanswered = QUESTIONS.filter(q => {
            const value = answers[q.id];
            return q.required && (!value || (Array.isArray(value) && value.length === 0));
        }).map(q => q.id);
        if (unanswered.length) {
            setMissing(unanswered);
            return;
        }

        // TODO: Send to backend once the API is ready.
        const payload = { name, mobile: dialCode + phone, answers };
        console.log('Hormonal care plan assessment:', payload);
        setSubmitted(true);
    };

    const inputClass =
        'w-full h-[55px] bg-white px-5 rounded-lg border-[1.2px] border-solid border-[#b4b4b4] outline-none text-[16px] text-[#202020] placeholder:text-[#8e8e8e]';

    const renderQuestion = (q: Question) => {
        switch (q.type) {
            case 'text':
            case 'number':
                return (
                    <input
                        type={q.type}
                        value={(answers[q.id] as string) || ''}
                        onChange={e => setAnswer(q.id, e.target.value)}
                        placeholder={q.placeholder}
                        className={inputClass}
                    />
                );
            case 'textarea':
                return (
                    <textarea
                        value={(answers[q.id] as string) || ''}
                        onChange={e => setAnswer(q.id, e.target.value)}
                        placeholder={q.placeholder}
                        rows={3}
                        className="w-full bg-white px-5 py-3 rounded-lg border-[1.2px] border-solid border-[#b4b4b4] outline-none text-[16px] text-[#202020] placeholder:text-[#8e8e8e]"
                    />
                );
            case 'radio':
            case 'checkbox':
                return (
                    <div className="flex flex-col gap-2">
                        {q.options.map(option => (
                            <label key={option} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type={q.type}
                                    name={q.id}
                                    value={option}
                                    checked={
                                        q.type === 'radio'
                                            ? answers[q.id] === option
                                            : ((answers[q.id] as string[]) || []).includes(option)
                                    }
                                    onChange={() => (q.type === 'radio' ? setAnswer(q.id, option) : toggleOption(q.id, option))}
                                    className="w-4 h-4 accent-[#0d468b]"
                                />
                                <span className="text-[15px] text-[#202020]">{option}</span>
                            </label>
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col overflow-x-hidden max-w-[520px] mx-auto relative">
            <TwentyOneDaysHeader />
            <main className="flex-grow flex flex-col items-center pt-[100px] pb-8 px-4">
                <h1 className="text-[24px] font-bold text-[#0D468B] text-center">Hormonal Care Plan Assessment</h1>
                <p className="text-[14px] text-[#555] text-center mt-2 mb-6">
                    Answer a few quick questions so we can personalise your care plan.
                </p>

                {submitted ? (
                    <div className="w-full bg-white p-6 rounded-[30px] shadow-[0px_10px_40px_rgba(0,0,0,0.15)] border border-slate-100 text-center">
                        <p className="text-[20px] font-bold text-[#0D468B]">Thank you, {name || 'there'}!</p>
                        <p className="text-[15px] text-[#555] mt-2">Our team will review your answers and reach out on WhatsApp.</p>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="w-full flex flex-col gap-5 bg-white p-4 md:p-6 rounded-[30px] shadow-[0px_10px_40px_rgba(0,0,0,0.15)] border border-slate-100"
                    >
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Full name"
                            className={inputClass}
                            required
                        />
                        <div>
                            <PhoneInputCustom
                                value={phone}
                                onChange={(p, code) => { setPhone(p); setDialCode(code); setPhoneError(false); }}
                                placeholder="Enter Your Whatsapp Number"
                                required
                                defaultCountry="in"
                            />
                            {phoneError && (
                                <span className="text-red-500 text-[12px] font-medium mt-1 block">⚠ Please enter a valid {dialCode === '+91' ? '10-digit' : ''} mobile number.</span>
                            )}
                        </div>

                        {QUESTIONS.map(q => (
                            <div key={q.id} className="flex flex-col gap-2">
                                <span className={`font-medium text-[15px] ${missing.includes(q.id) ? 'text-red-500' : 'text-[#202020]'}`}>
                                    {q.label} {q.required && <span className="text-red-500">*</span>}
                                </span>
                                {renderQuestion(q)}
                                {missing.includes(q.id) && (
                                    <span className="text-red-500 text-[12px] font-medium">⚠ This question is required.</span>
                                )}
                            </div>
                        ))}

                        <button type="submit" className="w-full h-[52px] bg-[#feab27] border-[2px] border-transparent hover:bg-white hover:border-[#feab27] transition-colors rounded-full flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg active:scale-95 duration-200 mt-1">
                            <span className="font-bold text-[17px] text-[#202020] uppercase tracking-wide">Submit</span>
                        </button>
                    </form>
                )}
            </main>
        </div>
    );
};

export default HormonalCarePlanAssessment;
