/**
 * @typedef {Object} BotEvent
 * @property {string} name - The name of the event.
 * @property {boolean} once - Whether the event should only be executed once.
 * @property {function(...any[]): void} execute - The function to execute when the event is triggered.
 */

const BotEvent = {
	name: "",
	once: false,
	/**
	 * @param {...any} args - Arguments passed to the event handler
	 */
	execute: (...args) => { }
};

module.exports = BotEvent;
