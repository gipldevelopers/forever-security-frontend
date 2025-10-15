'use client';

import { useState } from 'react';
import { apiService } from '@/app/lib/api';

export default function DebugTest() {
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const [data, setData] = useState(null);

    const testSimple = async () => {
        try {
            setStatus('testing');
            setMessage('Testing simple endpoint...');
            
            const result = await apiService.testSimpleConnection();
            
            if (result.success) {
                setStatus('success');
                setMessage('✅ Simple endpoint working!');
                setData(result);
            } else {
                setStatus('error');
                setMessage(`❌ Simple endpoint failed: ${result.message}`);
            }
        } catch (error) {
            setStatus('error');
            setMessage(`💥 Simple test failed: ${error.message}`);
            console.error('Simple test error:', error);
        }
    };

    const testBackendReachable = async () => {
        try {
            setStatus('testing');
            setMessage('Testing backend reachability...');
            
            const result = await apiService.testBackendReachable();
            
            if (result.success) {
                setStatus('success');
                setMessage('✅ Backend is reachable!');
                setData(result.data);
            } else {
                setStatus('error');
                setMessage(`❌ Backend not reachable: ${result.error}`);
            }
        } catch (error) {
            setStatus('error');
            setMessage(`💥 Reachability test failed: ${error.message}`);
            console.error('Reachability test error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Debug Test</h1>
                
                <div className={`p-4 rounded-lg mb-4 ${
                    status === 'testing' ? 'bg-blue-100 text-blue-800' :
                    status === 'success' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    <p className="font-medium">{message}</p>
                </div>

                {data && (
                    <div className="bg-gray-100 p-4 rounded-lg mb-4">
                        <h3 className="font-semibold mb-2">Response:</h3>
                        <pre className="text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
                    </div>
                )}

                <div className="space-y-2">
                    <button
                        onClick={testSimple}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Test Simple Endpoint
                    </button>
                    
                    <button
                        onClick={testBackendReachable}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Test Backend Reachability
                    </button>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">Troubleshooting Steps:</h3>
                    <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
                        <li>Check if Laragon is running (green icon)</li>
                        <li>Visit: http://localhost/forever-backend/api/test-simple.php</li>
                        <li>Check browser console for CORS errors</li>
                        <li>Verify folder: C:/laragon/www/forever-backend/</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}