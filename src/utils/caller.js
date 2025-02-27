/**
 * All API calls should be placed here for easy access throughout the bot
 */

const config = require("../config.js");
const logger = require("./logger.js");


const axios = require('axios');

const handleResponse = (response, successMessage) => {
    //console.log(response.data);

    // You can customize this part based on your needs
    if (successMessage) {
        console.log(successMessage);
    }

    return response;
};

const handleError = (error, errorMessage) => {
    console.error('Error in API call:', error);
    logger.log("Error", `error in API Call: ${error}`)

    // You can customize this part based on your needs
    throw new Error(errorMessage || 'An error occurred during the API call.');
};

/**
 * @deprecated We are moving to an MVC architecture which will replace the API entirely. This will be removed in the future.
 */
const Caller = {
    find: async (gameId, serverId, userId) => {
        try {
            const response = await axios.get(`${config.baseURL}/api/lfg/find?game_id=${gameId}&server=${serverId}&user_id=${userId}`);
            return handleResponse(response, null);
        } catch (error) {
            return handleError(error, 'Error in find API call');
        }
    },

    registerServer: async (id, name, imageURL) => {
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

    removeServer: async (serverId) => {
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

    setSharing: async (serverId, userId, state) => {
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
    registerUser: async (serverId, userId, name) => {
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
    },
    findGame: async (name) => {
        try {
            const response = await axios.get(`${config.baseURL}/api/lfg/find_game?name=${name}`);
            return handleResponse(response, null);
        } catch (error) {
            return handleError(error, 'Error in registerUser API call');
        }
    },
    getGame: async (id) => {
        try {
            const response = await axios.get(`${config.baseURL}/api/lfg/get_game?id=${id}`);
            return handleResponse(response, null);
        } catch (error) {
            return handleError(error, 'Error in registerUser API call');
        }
    },
    askForToken: async(id) => {
        try {
            const response = await axios.get(`${config.baseURL}/api/account/link_token?discord_id=${id}`);
            return handleResponse(response, null);
        } catch (error) {
            return handleError(error, 'Error in askForToken API call');
        }
    }
};

module.exports = Caller;