import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React from 'react';

// Move regex patterns to top-level scope for better performance
const NON_NUMERIC_REGEX = /[^0-9.]/g;
const NON_INTEGER_REGEX = /[^0-9]/g;
const NUMBER_KEY_REGEX = /[0-9]/;

interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'inputMode'
  > {
  allowDecimals?: boolean;
  maxDecimals?: number;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      onChange,
      onKeyDown,
      allowDecimals = true,
      maxDecimals = 2,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      // Remove all non-numeric characters except decimal point (if allowed)
      if (allowDecimals) {
        value = value.replace(NON_NUMERIC_REGEX, '');
        // Prevent multiple decimal points
        const parts = value.split('.');
        if (parts.length > 2) {
          value = `${parts[0]}.${parts.slice(1).join('')}`;
        }
        // Limit decimal places
        if (parts.length === 2 && parts[1].length > maxDecimals) {
          value = `${parts[0]}.${parts[1].substring(0, maxDecimals)}`;
        }
      } else {
        value = value.replace(NON_INTEGER_REGEX, '');
      }
      // Create a new event with the cleaned value
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value,
        },
      };
      onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Disable arrow keys to prevent spinner behavior
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
      }
      // Define allowed keys
      const allowedKeys = [
        'Backspace',
        'Delete',
        'Tab',
        'ArrowLeft',
        'ArrowRight',
        'Home',
        'End',
        'Escape',
      ];
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
        onKeyDown?.(e);
        return;
      }
      // Check if key is allowed
      const isNumberKey = NUMBER_KEY_REGEX.test(e.key);
      const isDecimalKey = allowDecimals && e.key === '.';
      const isAllowedKey = allowedKeys.includes(e.key);
      if (!(isNumberKey || isDecimalKey || isAllowedKey)) {
        e.preventDefault();
        return;
      }
      // Prevent multiple decimal points
      if (isDecimalKey) {
        const currentValue = (e.target as HTMLInputElement).value;
        if (currentValue.includes('.')) {
          e.preventDefault();
          return;
        }
      }
      onKeyDown?.(e);
    };
    return (
      <Input
        className={cn(className)}
        inputMode="numeric"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        ref={ref}
        type="text"
        {...props}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

export { NumberInput };
