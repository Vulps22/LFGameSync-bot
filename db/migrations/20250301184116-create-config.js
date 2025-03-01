'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('configs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      client_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      base_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      link_base_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      steam_api_key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      discord_log_channel_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      discord_error_channel_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      discord_server_channel_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      discord_support_server_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      env: {
        type: Sequelize.ENUM('prod', 'dev', 'stage', 'test'),
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Configs');
  }
};
