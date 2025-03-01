'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('discord_servers', 'icon_hash');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('discord_servers', 'icon_hash', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
