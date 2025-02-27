// Environment Variables.
require('dotenv').config();

module.exports = {
	// Discord Bot Token
	clientToken : process.env.CLIENT_TOKEN ?? '',
	clientId : process.env.CLIENT_ID ?? '',
	baseURL: process.env.BASE_URL ?? '',
}