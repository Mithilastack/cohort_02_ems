'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { forgotPassword, resetPassword } from '@/lib/authApi';
import { Button } from '@/components/ui/Button';
import { FormField, FormFieldError } from '@/components/ui/FormField';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Mail, Lock, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp-password'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  const handleForgotPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');
    setLoading(true);

    try {
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      const response = await forgotPassword(email);

      if (response.success) {
        setSuccess('OTP sent to your email');
        setTimeout(() => {
          setStep('otp-password');
          setSuccess('');
        }, 1500);
      }
    } catch (err: any) {
      setErrors({ general: err.message || 'Failed to send OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');
    setLoading(true);

    try {
      const newErrors: Record<string, string> = {};

      if (!otp) {
        newErrors.otp = 'OTP is required';
      } else if (otp.length !== 6) {
        newErrors.otp = 'OTP must be 6 digits';
      }

      if (!newPassword) {
        newErrors.password = 'Password is required';
      } else if (newPassword.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      const response = await resetPassword(email, otp, newPassword);

      if (response.success) {
        setSuccess('Password reset successfully! Redirecting...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: any) {
      setErrors({ general: err.message || 'Failed to reset password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 mb-4">
            <KeyRound className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-slate-50 mb-2">
            {step === 'email' ? 'Reset Password' : 'Secure Account'}
          </h1>
          <p className="text-slate-400">
            {step === 'email'
              ? 'Enter your email to receive a recovery code'
              : 'Verify your identity and set a new password'}
          </p>
        </div>

        {/* Card */}
        <Card variant="gradient" className="p-8">
          {/* General Error/Success */}
          {errors.general && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {errors.general}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
              <FormField>
                <Label htmlFor="email" className="text-slate-200">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="pl-10"
                  />
                </div>
              </FormField>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 h-11"
              >
                {loading ? 'Sending Code...' : 'Send Recovery Code'}
              </Button>
            </form>
          )}

          {/* Step 2: OTP & Password */}
          {step === 'otp-password' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-5">
              {/* OTP */}
              <FormField>
                <Label htmlFor="otp" className="text-slate-200">
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  disabled={loading}
                  className="text-center text-2xl tracking-widest font-mono"
                />
                <FormFieldError message={errors.otp} />
              </FormField>

              {/* New Password */}
              <FormField>
                <Label htmlFor="newPassword" className="text-slate-200">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    className="pl-10"
                  />
                </div>
                <FormFieldError message={errors.password} />
              </FormField>

              {/* Confirm Password */}
              <FormField>
                <Label htmlFor="confirmPassword" className="text-slate-200">
                  Confirm Password
                </Label>
                <div className="relative">
                  <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="pl-10"
                  />
                </div>
                <FormFieldError message={errors.confirmPassword} />
              </FormField>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 h-11"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </Button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setOtp('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setErrors({});
                }}
                disabled={loading}
                className="w-full text-sm text-slate-400 hover:text-slate-300 font-medium py-2 flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to email
              </button>
            </form>
          )}

          {/* Sign In Link */}
          <div className="mt-6 text-center text-sm border-t border-slate-700 pt-6">
            <p className="text-slate-400">
              Remember your password?{' '}
              <Link
                href="/login"
                className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          By resetting your password, you agree to our{' '}
          <Link href="/terms" className="hover:text-slate-400">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="hover:text-slate-400">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
