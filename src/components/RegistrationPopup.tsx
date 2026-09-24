import React, { useEffect } from 'react';
import { ApiStatus, PopupVariant } from './registration-popups/types';
import { pushDataLayer } from '../utils/pushDataLayer';
import SuccessContent from './registration-popups/SuccessContent';
import ExistingUserContent from './registration-popups/ExistingUserContent';

interface RegistrationPopupProps {
    isOpen: boolean;
    onClose: () => void;
    status: ApiStatus | string | null;
    language: 'Telugu' | 'English';
    mobileNumber?: string;
    variant?: PopupVariant;
    isPmax?: boolean;
}

function getPopupId(status: string, language: 'Telugu' | 'English', isPmax?: boolean): string {
    const isNewReg = status === 'success' || status === 'new_registration';
    const isFreeAgain = status === 'free_eligible_again';

    if (isPmax) {
        if (language === 'Telugu') {
            return isFreeAgain
                ? 'elementor-popup-modal-2330'
                : isNewReg
                ? 'elementor-popup-modal-2317'
                : 'elementor-popup-modal-2336';
        }
        return isFreeAgain
            ? 'elementor-popup-modal-2331'
            : isNewReg
            ? 'elementor-popup-modal-2589'
            : 'elementor-popup-modal-2592';
    }

    if (language === 'Telugu') {
        return isFreeAgain
            ? 'elementor-popup-modal-1330'
            : isNewReg
            ? 'elementor-popup-modal-1316'
            : 'elementor-popup-modal-1336';
    }
    return isFreeAgain
        ? 'elementor-popup-modal-1331'
        : isNewReg
        ? 'elementor-popup-modal-1589'
        : 'elementor-popup-modal-1592';
}

const RegistrationPopup: React.FC<RegistrationPopupProps> = ({
    isOpen,
    onClose,
    status,
    language,
    mobileNumber,
    variant = 'free',
    isPmax = false,
}) => {
    useEffect(() => {
        if (!isOpen || !status) return;
        pushDataLayer({
            'event': 'popup_viewed',
            'popup_status': status,
            'popup_id': parseInt(getPopupId(status, language, isPmax).replace('elementor-popup-modal-', ''), 10),
        });
    }, [isOpen, status, language, isPmax]);

    if (!isOpen || !status) return null;

    const childProps = { language, mobileNumber, onClose, variant, status };

    const isSuccess = status === 'success' || status === 'new_registration' || status === 'free_eligible_again';

    return (
        <div
            id={getPopupId(status, language, isPmax)}
            className="elementor-popup-modal fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            aria-modal="true"
            role="dialog"
        >
            {isSuccess
                ? <SuccessContent {...childProps} />
                : <ExistingUserContent {...childProps} />
            }
        </div>
    );
};

export default RegistrationPopup;
