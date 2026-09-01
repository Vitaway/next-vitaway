import { get } from '../client';
import { ReferralResolveResponse } from '../types';

export const referralCodeService = {
    resolve: async (code: string): Promise<ReferralResolveResponse> => {
        return get<ReferralResolveResponse>('/api/referral-codes/resolve', {
            params: { code: code.trim() },
        });
    },
};
