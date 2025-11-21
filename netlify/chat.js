// netlify/functions/chat.js

export const handler = async (event) => {
    // 1. Handle CORS (Allows your frontend to talk to this backend)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // 2. Check for API Key in Server Environment
    const API_KEY = process.env.GROQ_API_KEY;
    if (!API_KEY) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Server Error: API Key not configured in Netlify." })
        };
    }

    try {
        // 3. Parse the incoming message
        const { messages } = JSON.parse(event.body);

        // 4. Call Groq API (Server-to-Server)
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: messages,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        const data = await response.json();

        // 5. Return the result to the frontend
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Failed to connect to AI provider." })
        };
    }
};