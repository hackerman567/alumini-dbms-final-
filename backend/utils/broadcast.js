let io;

/**
 * Initialize the Socket.io instance for global broadcasting
 * @param {Object} ioInstance - The Socket.io server instance
 */
export const setIo = (ioInstance) => {
    io = ioInstance;
};

/**
 * Broadcast an event to all connected clients
 * @param {string} event - The event name
 * @param {Object} data - The data payload
 */
export const broadcast = (event, data) => {
    if (io) {
        io.emit(event, data);
    } else {
        console.warn("Attempted to broadcast before Socket.io was initialized");
    }
};

/**
 * Broadcast an event to a specific room
 * @param {string} room - The room ID
 * @param {string} event - The event name
 * @param {Object} data - The data payload
 */
export const broadcastToRoom = (room, event, data) => {
    if (io) {
        io.to(room).emit(event, data);
    } else {
        console.warn("Attempted to broadcast to room before Socket.io was initialized");
    }
};
