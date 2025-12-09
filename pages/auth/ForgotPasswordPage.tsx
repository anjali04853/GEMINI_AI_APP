import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Bot, CheckCircle2, Mail, ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-lavender to-white p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 relative overflow-hidden">
        {/* Decorative Top Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-purple to-brand-turquoise"></div>
        
        <div className="text-center mb-8">
            <Link to="/login" className="absolute top-8 left-8 text-slate-400 hover:text-slate-600">
                <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="h-16 w-16 bg-brand-offWhite rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                <Bot className="h-8 w-8 text-brand-purple" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
        </div>

        {isSubmitted ? (
        <div className="flex flex-col items-center justify-center space-y-6 py-4 animate-in fade-in zoom-in duration-300">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">Check your email</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                    We've sent password reset instructions to your email address.
                </p>
            </div>
            <Button onClick={() => setIsSubmitted(false)} variant="outline" className="w-full">
                Try another email
            </Button>
            <Link to="/login" className="text-sm font-medium text-brand-purple hover:underline">
                Return to Login
            </Link>
        </div>
        ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="text-center mb-6">
                <p className="text-slate-500 text-sm">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <div className="relative">
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    error={errors.email?.message}
                    {...register('email')}
                    className="pl-10"
                />
                <Mail className="absolute left-3 top-[34px] h-5 w-5 text-slate-400 pointer-events-none" />
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Send Reset Link
            </Button>
            
            <div className="text-center mt-4">
                 <Link to="/login" className="text-sm text-slate-500 hover:text-slate-800 font-medium">
                    Back to login
                 </Link>
            </div>
        </form>
        )}
      </div>
    </div>
  );
};