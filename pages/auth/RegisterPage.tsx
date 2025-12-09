import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Bot, CheckCircle2 } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      login(
        { 
            id: '1', 
            name: data.name, 
            email: data.email,
            role: 'user',
            status: 'active',
            joinedAt: Date.now()
        },
        'fake-jwt-token'
      );
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-brand-offWhite">
      {/* Visual Side Left */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden items-center justify-center">
         <div className="absolute inset-0 bg-gradient-to-bl from-brand-turquoise/20 via-slate-900 to-brand-purple/40"></div>
         <div className="relative z-10 p-12 max-w-lg">
             <div className="space-y-8">
                 <div className="flex items-center space-x-4">
                     <div className="flex-shrink-0 h-12 w-12 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold">1</div>
                     <div>
                         <h3 className="text-white font-bold text-lg">Create Account</h3>
                         <p className="text-slate-400">Enter your details to get started.</p>
                     </div>
                 </div>
                 <div className="w-0.5 h-12 bg-slate-700 ml-6"></div>
                 <div className="flex items-center space-x-4 opacity-50">
                     <div className="flex-shrink-0 h-12 w-12 rounded-full border-2 border-slate-600 flex items-center justify-center text-slate-400 font-bold">2</div>
                     <div>
                         <h3 className="text-white font-bold text-lg">Verify Email</h3>
                         <p className="text-slate-500">Check your inbox for the code.</p>
                     </div>
                 </div>
                 <div className="w-0.5 h-12 bg-slate-700 ml-6"></div>
                 <div className="flex items-center space-x-4 opacity-50">
                     <div className="flex-shrink-0 h-12 w-12 rounded-full border-2 border-slate-600 flex items-center justify-center text-slate-400 font-bold">3</div>
                     <div>
                         <h3 className="text-white font-bold text-lg">Start Learning</h3>
                         <p className="text-slate-500">Access your personalized dashboard.</p>
                     </div>
                 </div>
             </div>
         </div>
      </div>

      {/* Form Side Right */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <div className="h-12 w-12 bg-brand-lavender rounded-xl flex items-center justify-center mx-auto mb-4">
               <Bot className="h-7 w-7 text-brand-purple" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
            <p className="mt-2 text-sm text-slate-500">Start your journey with GeminiApp today.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="name@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
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
                Create Account
                </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand-purple hover:text-brand-darkPurple transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};