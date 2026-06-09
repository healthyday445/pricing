import React from 'react';
import { ChildPopupProps } from './types';
import AlreadyRegisteredContent from './AlreadyRegisteredContent';
import SelfReferralContent from './SelfReferralContent';

// Handles: free_eligible_again, already_registered, free_ongoing,
//          free_completed_recent, paid_user, subscription_expired_recently, self_referral
const ExistingUserContent: React.FC<ChildPopupProps> = (props) => {
    switch (props.status) {
        case 'already_registered':
            return <AlreadyRegisteredContent {...props} />;
        case 'self_referral':
            return <SelfReferralContent {...props} />;

        // Designs for the cases below are coming soon
        case 'free_eligible_again':
        case 'free_ongoing':
        case 'free_completed_recent':
        case 'paid_user':
        case 'subscription_expired_recently':
        default:
            return null;
    }
};

export default ExistingUserContent;
