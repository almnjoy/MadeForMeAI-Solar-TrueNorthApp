
import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { exchangeCode } from '@/lib/authClient.js';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleCallback } = useAuth();
  
  // Prevent double-execution in strict mode
  const processedRef = useRef(false);

  useEffect(() => {
    const processCallback = async () => {
      if (processedRef.current) return;
      
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Authentication failed', {
          description: searchParams.get('error_description') || 'An error occurred during login.'
        });
        navigate('/login', { replace: true });
        return;
      }

      if (!code) {
        toast.error('Invalid authentication response');
        navigate('/login', { replace: true });
        return;
      }

      try {
        processedRef.current = true;
        const tokenData = await exchangeCode(code, state);
        handleCallback(tokenData);
        toast.success('Successfully logged in');
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error('Callback error:', err);
        toast.error('Failed to complete login', {
          description: err.message || 'Please try logging in again.'
        });
        navigate('/login', { replace: true });
      }
    };

    processCallback();
  }, [searchParams, navigate, handleCallback]);

  return (
    <>
      <Helmet>
        <title>Authenticating... | TrueNorth Solar</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm mx-auto p-6">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <h2 className="text-xl font-semibold mt-2 text-foreground">Completing sign in</h2>
          <p className="text-sm text-muted-foreground">
            Please wait whil