'use client';
import { useEffect } from 'react';
import { tokenManager } from '../../../utils/token';

export default function DebugToken() {
  useEffect(() => {
    console.log('=== TOKEN DEBUG INFO ===');
    console.log('Token exists:', !!tokenManager.getToken());
    console.log('Is authenticated:', tokenManager.isAuthenticated());
    console.log('Token value:', tokenManager.getToken());
    console.log('Token timestamp:', localStorage.getItem('adminTokenTimestamp'));
    console.log('=======================');
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Token Debug Info</h1>
      <div className="bg-gray-100 p-4 rounded">
        <p>Token exists: {!!tokenManager.getToken() ? 'Yes' : 'No'}</p>
        <p>Is authenticated: {tokenManager.isAuthenticated() ? 'Yes' : 'No'}</p>
        <p>Token: {tokenManager.getToken() || 'No token'}</p>
      </div>
    </div>
  );
}