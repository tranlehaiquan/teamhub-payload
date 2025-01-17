'use client';

import { cn } from 'src/utilities/cn';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import * as React from 'react';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    className={cn(
      'peer h-4 w-4 shrink-0 rounded border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className,
    )}
    ref={ref}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

type PropsCheckBoxWithLabel = {
  label: string;
} & React.ComponentProps<typeof Checkbox>;

const CheckboxWithLabel: React.FC<PropsCheckBoxWithLabel> = ({ id, label }) => {
  return (
    <label
      key={id}
      className="inline-flex items-center rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
      htmlFor={String(id)}
    >
      <Checkbox className="mr-1" id={String(id)} />
      <span>{label}</span>
    </label>
  );
};

export { Checkbox, CheckboxWithLabel };
