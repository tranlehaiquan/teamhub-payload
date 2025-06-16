'use client';

import type * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utilities/cn';

type Props = {
  selected?: Date | null;
  onSelect?: (date?: Date) => void;
  placeHolder?: string;
};

const DatePicker: React.FC<Props> = ({ selected, onSelect, placeHolder = 'Pick a date' }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'justify-start text-left font-normal flex w-full',
            !selected && 'text-muted-foreground',
          )}
        >
          <CalendarIcon />
          {selected ? format(selected, 'PPP') : <span>{placeHolder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode={'single'}
          initialFocus
          selected={selected ?? undefined}
          onSelect={(date) => onSelect?.(date)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
