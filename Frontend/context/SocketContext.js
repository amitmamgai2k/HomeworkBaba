import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { BASE_URL } from '@env';

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        console.log('🔌 Initializing socket connection to:', BASE_URL);

        const newSocket = io(BASE_URL, {
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            timeout: 10000, // 10 second timeout

            transports: ['websocket', 'polling'], // Allow fallback to polling
            forceNew: true, // Force new connection

            upgrade: true,
            rememberUpgrade: false
        });

        // Connection events with better logging
        newSocket.on('connect', () => {
            console.log('✅ Connected to server with ID:', newSocket.id);
            setIsConnected(true);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('❌ Disconnected from server. Reason:', reason);
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('💥 Connection error:', error.message);
            setIsConnected(false);
        });

        newSocket.on('reconnect', (attemptNumber) => {
            console.log('🔄 Reconnected after', attemptNumber, 'attempts');
            setIsConnected(true);
        });

        newSocket.on('reconnect_attempt', (attemptNumber) => {
            console.log('🔄 Reconnection attempt', attemptNumber);
        });

        newSocket.on('reconnect_error', (error) => {
            console.error('💥 Reconnection error:', error.message);
        });

        newSocket.on('reconnect_failed', () => {
            console.error('💥 Reconnection failed after all attempts');
            setIsConnected(false);
        });

        setSocket(newSocket);

        // Cleanup function
        return () => {
            console.log('🧹 Cleaning up socket connection');
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);


    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;


export const useSocket = () => {
    const context = React.useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};