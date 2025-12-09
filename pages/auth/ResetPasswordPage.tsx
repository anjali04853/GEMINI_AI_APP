import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Bot, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    // Simulate API call to update password
    setTimeout(() => {
      setIsSuccess(true);
      setIsLoading(false);
      // Redirect to login after a delay
      setTimeout(() => navigate('/login'), 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-lavender to-white p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-purple to-brand-turquoise"></div>
        
        <div className="text-center mb-8">
            <div className="h-16 w-16 bg-brand-offWhite rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                <Bot className="h-8 w-8 text-brand-purple" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Set New Password</h1>
            <p className="text-slate-500 text-sm mt-2">Create a strong password for your account.</p>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8 animate-in fade-in zoom-in duration-300">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Password Reset!</h3>
            <p className="text-slate-500 text-center">
                Your password has been successfully updated. Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="pt-2">
                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                    Reset Password
                </Button>
            </div>
            
            <div className="text-center mt-4">
                 <Link to="/login" className="text-sm text-slate-500 hover:text-slate-800 font-medium inline-flex items-center">
                    <ArrowLeft className="h-3 w-3 mr-1" /> Back to Login
                 </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};