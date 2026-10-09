import axios from 'axios';
import { publicConsumerBase } from '../public-consumer-base';
import { ReferralCoachListResponse } from '../types';

export const referralCoachService = {
    list: async (organizationId?: number | null): Promise<ReferralCoachListResponse> => {
        const params =
            organizationId != null && organizationId > 0
                ? { organization_id: organizationId }
                : undefined;

        const response = await axios.get<ReferralCoachListResponse>(
            `${publicConsumerBase()}/api/referral-coaches`,
            { params },
        );
        return response.data;
    },
};
