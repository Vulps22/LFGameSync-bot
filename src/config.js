// Environment Variables.
require('dotenv').config();

module.exports = {
	// Discord Bot Token
	clientToken : process.env.CLIENT_TOKEN ?? '',
	clientId : process.env.CLIENT_ID ?? '',
	baseURL: process.env.BASE_URL ?? '',
	// Database
	database: process.env.DB_NAME ?? '',
	username: process.env.DB_USER ?? '',
	password: process.env.DB_PASS ?? '',
	host: process.env.DB_HOST ?? '',
	port: process.env.DB_PORT ?? '',
	dialect: process.env.DB_DIALECT ?? '',
}