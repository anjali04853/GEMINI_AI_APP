import React from 'react';
import { cn } from '../../lib/utils';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Heading: React.FC<HeadingProps> = ({ 
  level = 1, 
  className, 
  children, 
  ...props 
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const sizes = {
    1: 'text-4xl font-bold tracking-tight',
    2: 'text-3xl font-bold tracking-tight',
    3: 'text-2xl font-semibold',
    4: 'text-xl font-semibold',
    5: 'text-lg font-medium',
    6: 'text-base font-medium',
  };

  return (
    <Tag className={cn(sizes[level], 'text-slate-900', className)} {...props}>
      {children}
    </Tag>
  );
};

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  muted?: boolean;
}

export const Text: React.FC<TextProps> = ({ 
  size = 'base', 
  muted = false,
  className, 
  children, 
  ...props 
}) => {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <p className={cn(sizes[size], muted ? 'text-slate-500' : 'text-slate-700', className)} {...props}>
      {children}
    </p>
  );
};

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({ 
  required = false,
  className, 
  children, 
  ...props 
}) => {
  return (
    <label className={cn('text-sm font-medium text-slate-700', className)} {...props}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};