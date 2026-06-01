import { get } from '../client';
import { OrganizationListResponse } from '../types';

export const organizationService = {
    list: async (): Promise<OrganizationListResponse> => {
        return get<OrganizationListResponse>('/api/organizations');
    },
};
