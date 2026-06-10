import React from 'react';
import { ChildPopupProps } from './types';
import AlreadyRegisteredContent from './AlreadyRegisteredContent';
import SelfReferralContent from './SelfReferralContent';

const ExistingUserContent: React.FC<ChildPopupProps> = (props) => {
    if (props.status === 'self_referral') {
        return <SelfReferralContent {...props} />;
    }
    return <AlreadyRegisteredContent {...props} />;
};

export default ExistingUserContent;
