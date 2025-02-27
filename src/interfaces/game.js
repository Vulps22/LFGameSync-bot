/**
 * @typedef {Object} Game
 * @property {string} [id] - The unique identifier for the game (optional).
 * @property {string} storeId - The ID of the game in the store.
 * @property {string} name - The name of the game.
 * @property {string} [image] - A URL to the game's image (optional).
 */

const Game = {
    id: undefined,
    storeId: "",
    name: "",
    image: undefined
};

module.exports = Game;
