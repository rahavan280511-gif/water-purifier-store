import { useState, useEffect } from 'react';
import axios from 'axios';

// Fetches the owner's WhatsApp number securely from the backend
// so it is never exposed in the frontend source code.
let cachedNumber = null;

export const useWhatsAppNumber = () => {
    const [number, setNumber] = useState(cachedNumber);

    useEffect(() => {
        if (cachedNumber) return; // already fetched
        axios.get('/api/config')
            .then(res => {
                cachedNumber = res.data.whatsappNumber;
                setNumber(cachedNumber);
            })
            .catch(err => console.error("Failed to load config:", err));
    }, []);

    return number;
};
