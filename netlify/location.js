export const handler = async (event) => {
    // 1. Allow the frontend to talk to this function
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };

    // Handle preflight check
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // 2. Get the Key securely from Netlify
    const IPAPI_KEY = process.env.IPAPI_KEY;
    
    // 3. Get the User's IP address from the request headers
    // (Netlify automatically tells us the IP of the person visiting)
    const clientIp = event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'];

    if (!IPAPI_KEY) {
         return { 
             statusCode: 500, 
             headers, 
             body: JSON.stringify({ error: "Server Error: IPAPI_KEY not found." }) 
         };
    }

    try {
        // 4. Ask IPAPI for data securely (Server-to-Server)
        // We must pass the clientIp, otherwise IPAPI will return Netlify's server location!
        const response = await fetch(`https://ipapi.co/${clientIp}/json/?key=${IPAPI_KEY}`);
        const data = await response.json();

        // 5. Return the result to your frontend
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
        };

    } catch (error) {
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: "Failed to fetch location." }) 
        };
    }
};