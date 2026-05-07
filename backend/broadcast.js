let io;

/**
 * Initialize Socket.io instance
 */
export const setIo = (ioInstance) => {
    io = ioInstance;
};

/**
 * Global broadcast for the Live Ticker
 */
export const broadcast = (event, data) => {
    if (io) {
        io.emit(event, data);
    } else {
        console.warn("Socket.io not initialized");
    }
};
