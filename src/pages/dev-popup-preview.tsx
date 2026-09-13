import { useState } from 'react';
import RegistrationPopup from '../components/RegistrationPopup';
import { ApiStatus, PopupVariant } from '../components/registration-popups/types';

const CASES: { status: ApiStatus; label: string }[] = [
    { status: 'success', label: 'success / new_registration' },
    { status: 'free_eligible_again', label: 'free_eligible_again' },
    { status: 'already_registered', label: 'already_registered / free_ongoing' },
    { status: 'free_completed_recent', label: 'free_completed_recent (old user)' },
    { status: 'paid_user', label: 'paid_user (old user)' },
    { status: 'subscription_expired_recently', label: 'subscription_expired_recently (old user)' },
    { status: 'self_referral', label: 'self_referral' },
    { status: 'isReferral', label: 'isReferral' },
];

export default function DevPopupPreview() {
    const [active, setActive] = useState<ApiStatus | null>(null);
    const [language, setLanguage] = useState<'English' | 'Telugu'>('English');
    const [variant, setVariant] = useState<PopupVariant>('free');
    const [mobileNumber, setMobileNumber] = useState('9999999999');

    return (
        <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', maxWidth: 720, margin: '0 auto' }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Registration Popup Preview</h1>
            <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
                Click a case to open that popup exactly as it renders in production (RegistrationPopup + real content components).
            </p>

            <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <label>
                    Language:{' '}
                    <select value={language} onChange={(e) => setLanguage(e.target.value as 'English' | 'Telugu')}>
                        <option value="English">English</option>
                        <option value="Telugu">Telugu</option>
                    </select>
                </label>
                <label>
                    Variant:{' '}
                    <select value={variant} onChange={(e) => setVariant(e.target.value as PopupVariant)}>
                        <option value="free">free</option>
                        <option value="21days">21days</option>
                    </select>
                </label>
                <label>
                    Mobile #:{' '}
                    <input
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        style={{ border: '1px solid #ccc', borderRadius: 4, padding: '2px 6px' }}
                    />
                </label>
            </div>

            <div style={{ display: 'grid', gap: 8 }}>
                {CASES.map((c) => (
                    <button
                        key={c.status}
                        onClick={() => setActive(c.status)}
                        style={{
                            textAlign: 'left',
                            padding: '10px 14px',
                            borderRadius: 8,
                            border: '1px solid #ddd',
                            background: '#fafafa',
                            cursor: 'pointer',
                            fontSize: 14,
                        }}
                    >
                        {c.label}
                    </button>
                ))}
            </div>

            <RegistrationPopup
                isOpen={active !== null}
                onClose={() => setActive(null)}
                status={active}
                language={language}
                mobileNumber={mobileNumber}
                variant={variant}
            />
        </div>
    );
}
