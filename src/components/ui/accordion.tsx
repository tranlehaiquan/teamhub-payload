'use client';

import type * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/utilities/cn';

const Accordion = AccordionPrimitive.Root;

const AccordionItem: React.FC<AccordionPrimitive.AccordionItemProps> = ({
  className,
  ...props
}) => <AccordionPrimitive.Item className={cn('border-b', className)} {...props} />;

const AccordionTrigger: React.FC<AccordionPrimitive.AccordionTriggerProps> = ({
  className,
  children,
  ...props
}) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      className={cn(
        'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
);

const AccordionContent: React.FC<AccordionPrimitive.AccordionContentProps> = ({
  className,
  children,
  ...props
}) => (
  <AccordionPrimitive.Content
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
);

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
