/**
 * All API calls should be placed here for easy access throughout the bot
 */

import config from "../config";

const axios = require('axios');

const handleResponse = (response: any, successMessage: any) => {
    console.log(response.data);

    // You can customize this part based on your needs
    if (successMessage) {
        console.log(successMessage);
    }

    return response;
};

const handleError = (error: any, errorMessage: any) => {
    console.error('Error in API call:', error);

    // You can customize this part based on your needs
    throw new Error(errorMessage || 'An error occurred during the API call.');
};

const Caller = {
    find: async (gameName: string, serverId: string, userId: string) => {
        try {
            const response = await axios.get(`${config.baseURL}/api/lfg/find?game=${gameName}&server=${serverId}&user_id=${userId}`);
            return handleResponse(response, null);
        } catch (error) {
            return handleError(error, 'Error in find API call');
        }
    },

    registerServer: async (id: string, name: string, imageURL: string) => {
        const data = {
            server_id: id,
            server_name: name,
            server_image: imageURL
        };

        try {
            const response = await axios.post(`${config.baseURL}/api/lfg/register_server`, data);
            return handleResponse(response, 'Server registered successfully');
        } catch (error) {
            return handleError(error, 'Error in registerServer API call');
        }
    },

    removeServer: async (serverId: string) => {
        const data = {
            server_id: serverId
        };

        try {
            const response = await axios.post(`${config.baseURL}/api/lfg/remove_server`, data);
            return handleResponse(response, 'Server removed successfully');
        } catch (error) {
            return handleError(error, 'Error in removeServer API call');
        }
    },

    setSharing: async (serverId: string, userId: string, state: boolean) => {
        const data = {
            server_id: serverId,
            user_id: userId,
            state: state
        };

        try {
            const response = await axios.post(`${config.baseURL}/api/server/set_sharing`, data);
            return handleResponse(response, 'Sharing state updated successfully');
        } catch (error) {
            return handleError(error, 'Error in setSharing API call');
        }
    },
    registerUser: async (serverId: string, userId: string, name: string) => {
        const data = {
            server_id: serverId,
            user_id: userId,
            name: name
        };

        try {
            const response = await axios.post(`${config.baseURL}/api/server/register_user`, data);
            return handleResponse(response, 'Sharing state updated successfully');
        } catch (error) {
            return handleError(error, 'Error in registerUser API call');
        }
    }
};

export default Caller;