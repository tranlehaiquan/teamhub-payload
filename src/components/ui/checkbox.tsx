'use client';

import { cn } from 'src/utilities/cn';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import type * as React from 'react';

const Checkbox = ({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) => (
  <CheckboxPrimitive.Root
    className={cn(
      'peer h-4 w-4 shrink-0 rounded border border-primary ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);

type PropsCheckBoxWithLabel = {
  label: string;
} & React.ComponentProps<typeof Checkbox>;

const CheckboxWithLabel: React.FC<PropsCheckBoxWithLabel> = ({ id, label, disabled, ...rest }) => {
  return (
    <label
      key={id}
      className={cn(
        'inline-flex items-center rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/20 transition-colors',
        disabled && 'cursor-not-allowed opacity-50',
      )}
      htmlFor={String(id)}
    >
      <Checkbox className="mr-1" id={String(id)} disabled={disabled} {...rest} />
      <span>{label}</span>
    </label>
  );
};

export { Checkbox, CheckboxWithLabel };
