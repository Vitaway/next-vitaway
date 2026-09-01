import { get } from '../client';
import { ReferralCoachListResponse } from '../types';

export const referralCoachService = {
    list: async (organizationId?: number | null): Promise<ReferralCoachListResponse> => {
        const params =
            organizationId != null && organizationId > 0
                ? { organization_id: organizationId }
                : undefined;

        return get<ReferralCoachListResponse>('/api/referral-coaches', { params });
    },
};
