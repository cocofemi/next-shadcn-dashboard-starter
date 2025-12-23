'use client';

import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReminderBannerProps {
  title?: string;
  message?: string;
  variant?: 'default' | 'warning' | 'info';
}

export function ReminderBanner({
  title = 'Upcoming System Maintenance',
  message = "We'll be performing scheduled maintenance on December 20th, 2025 from 2:00 AM - 4:00 AM UTC. Some features may be temporarily unavailable.",
  variant = 'info'
}: ReminderBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const variantStyles = {
    default: 'bg-card border-border text-foreground',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-500'
  };

  return (
    <div className={`rounded-lg border p-4 ${variantStyles[variant]} relative`}>
      <div className="flex items-start gap-3 pr-8">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="mb-1 text-sm font-semibold">{title}</h3>
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 hover:bg-white/10"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close banner</span>
        </Button>
      </div>
    </div>
  );
}
