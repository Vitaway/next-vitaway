import axios from 'axios';
import { publicConsumerBase } from '../public-consumer-base';
import { OrganizationListResponse } from '../types';

export const organizationService = {
    list: async (): Promise<OrganizationListResponse> => {
        const response = await axios.get<OrganizationListResponse>(`${publicConsumerBase()}/api/organizations`);
        return response.data;
    },
};
