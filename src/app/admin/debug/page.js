'use client';
import { useEffect, useState } from 'react';

export default function DebugPage() {
    const [tokenInfo, setTokenInfo] = useState({});
    const [apiTest, setApiTest] = useState('');

    useEffect(() => {
        // Check token info
        const token = localStorage.getItem('adminToken');
        const timestamp = localStorage.getItem('adminTokenTimestamp');
        
        setTokenInfo({
            tokenExists: !!token,
            tokenLength: token ? token.length : 0,
            tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
            timestamp: timestamp ? new Date(parseInt(timestamp)).toLocaleString() : 'No timestamp',
            isExpired: timestamp ? (Date.now() - parseInt(timestamp)) > (24 * 60 * 60 * 1000) : true
        });
    }, []);

    const testApiCall = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/services', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const result = await response.json();
            setApiTest(`Status: ${response.status}, OK: ${response.ok}, Data: ${JSON.stringify(result)}`);
        } catch (error) {
            setApiTest(`Error: ${error.message}`);
        }
    };

    const clearAndRedirect = () => {
        localStorage.clear();
        window.location.href = '/admin/login';
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Debug Information</h1>
            
            <div className="bg-gray-100 p-4 rounded">
                <h2 className="text-lg font-semibold mb-2">Token Information</h2>
                <pre>{JSON.stringify(tokenInfo, null, 2)}</pre>
            </div>

            <div className="bg-blue-100 p-4 rounded">
                <h2 className="text-lg font-semibold mb-2">API Test</h2>
                <button 
                    onClick={testApiCall}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
                >
                    Test API Call
                </button>
                <button 
                    onClick={clearAndRedirect}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Clear & Login Again
                </button>
                {apiTest && (
                    <div className="mt-2 p-2 bg-white rounded">
                        <pre>{apiTest}</pre>
                    </div>
                )}
            </div>

            <div className="bg-green-100 p-4 rounded">
                <h2 className="text-lg font-semibold mb-2">Quick Fixes</h2>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Go to <code>/admin/login</code> and login with admin/admin123</li>
                    <li>Check if backend is running on port 5000</li>
                    <li>Verify JWT_SECRET in backend .env file</li>
                    <li>Restart both frontend and backend servers</li>
                </ol>
            </div>
        </div>
    );
}