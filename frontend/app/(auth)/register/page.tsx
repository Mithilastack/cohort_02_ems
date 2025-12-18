'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { FormField, FormFieldError } from '@/components/ui/FormField'
import { Card } from '@/components/ui/Card'

export default function RegisterPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [agreeTerms, setAgreeTerms] = useState(false)

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!name.trim()) {
            newErrors.name = 'Full name is required'
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters'
        }

        if (!email) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email'
        }

        if (!password) {
            newErrors.password = 'Password is required'
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        if (!agreeTerms) {
            newErrors.terms = 'You must agree to the Terms of Service'
        }

        return newErrors
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrors({})
        setIsLoading(true)

        const newErrors = validateForm()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setIsLoading(false)
            return
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
            
            const response = await fetch(`${apiUrl}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.toLowerCase(),
                    password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed')
            }

            if (data.success) {
                alert('Account created successfully! Please login.')
                router.push('/login')
            }
        } catch (error) {
            setErrors({ submit: error instanceof Error ? error.message : 'Registration failed. Please try again.' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-slate-50 mb-2">Create Account</h1>
                    <p className="text-slate-400">Join us to book amazing events</p>
                </div>

                {/* Registration Card */}
                <Card variant="gradient" className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                {errors.submit}
                            </div>
                        )}

                        {/* Name Field */}
                        <FormField>
                            <Label htmlFor="name" className="text-slate-200">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                            />
                            <FormFieldError message={errors.name} />
                        </FormField>

                        {/* Email Field */}
                        <FormField>
                            <Label htmlFor="email" className="text-slate-200">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                            <FormFieldError message={errors.email} />
                        </FormField>

                        {/* Password Field */}
                        <FormField>
                            <Label htmlFor="password" className="text-slate-200">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            <FormFieldError message={errors.password} />
                        </FormField>

                        {/* Confirm Password Field */}
                        <FormField>
                            <Label htmlFor="confirmPassword" className="text-slate-200">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            <FormFieldError message={errors.confirmPassword} />
                        </FormField>

                        {/* Terms Checkbox */}
                        <FormField>
                            <div className="flex items-center gap-2">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    disabled={isLoading}
                                    className="w-4 h-4 rounded border-slate-600 text-purple-600 focus:ring-purple-500"
                                />
                                <Label htmlFor="terms" className="text-sm text-slate-300 cursor-pointer">
                                    I agree to the{' '}
                                    <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                                        Terms & Conditions
                                    </Link>
                                </Label>
                            </div>
                            <FormFieldError message={errors.terms} />
                        </FormField>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 h-11"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>

                    {/* Sign In Link */}
                    <div className="mt-6 text-center text-sm">
                        <p className="text-slate-400">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </Card>

                {/* Footer Note */}
                <p className="text-center text-xs text-slate-500 mt-6">
                    By creating an account, you agree to our{' '}
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
    )
}
