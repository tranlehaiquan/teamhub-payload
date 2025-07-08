import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from '../switch';

// Mock Radix UI Switch components
vi.mock('@radix-ui/react-switch', () => ({
  Root: ({ children, className, onClick, disabled, checked, ...props }: any) => (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      data-state={checked ? 'checked' : 'unchecked'}
      {...props}
    >
      {children}
    </button>
  ),
  Thumb: ({ className, ...props }: any) => (
    <div className={className} {...props} />
  ),
}));

describe('Switch Component', () => {
  it('renders correctly', () => {
    render(<Switch data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toBeInTheDocument();
    expect(switchElement.tagName).toBe('BUTTON');
  });

  it('applies default classes', () => {
    render(<Switch data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveAttribute('data-slot', 'switch');
    expect(switchElement).toHaveClass(
      'peer',
      'inline-flex',
      'h-5',
      'w-9',
      'shrink-0',
      'items-center',
      'rounded-full',
      'border-2',
      'border-transparent',
      'shadow-xs',
      'transition-all',
      'outline-none'
    );
  });

  it('applies custom className', () => {
    render(<Switch className="custom-switch" data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveClass('custom-switch');
  });

  it('renders the thumb element', () => {
    const { container } = render(<Switch data-testid="switch" />);
    
    const thumb = container.querySelector('[data-slot="switch-thumb"]');
    expect(thumb).toBeInTheDocument();
    expect(thumb).toHaveClass(
      'bg-background',
      'pointer-events-none',
      'block',
      'size-4',
      'rounded-full',
      'ring-0',
      'shadow-lg',
      'transition-transform'
    );
  });

  it('handles checked state correctly', () => {
    render(<Switch checked data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveAttribute('data-state', 'checked');
  });

  it('handles unchecked state correctly', () => {
    render(<Switch checked={false} data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveAttribute('data-state', 'unchecked');
  });

  it('handles disabled state correctly', () => {
    render(<Switch disabled data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toBeDisabled();
    expect(switchElement).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Switch onClick={handleClick} data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    fireEvent.click(switchElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not handle click when disabled', () => {
    const handleClick = vi.fn();
    render(<Switch onClick={handleClick} disabled data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    fireEvent.click(switchElement);
    
    // Click should not be handled when disabled
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('forwards name prop', () => {
    render(<Switch name="toggle" data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveAttribute('name', 'toggle');
  });

  it('forwards id prop', () => {
    render(<Switch id="switch-id" data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveAttribute('id', 'switch-id');
  });

  it('forwards value prop', () => {
    render(<Switch value="on" data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveAttribute('value', 'on');
  });

  it('forwards aria-label prop', () => {
    render(<Switch aria-label="toggle setting" data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveAttribute('aria-label', 'toggle setting');
  });

  it('applies focus styles', () => {
    render(<Switch data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveClass(
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'focus-visible:ring-[3px]'
    );
  });

  it('applies state-based styles', () => {
    render(<Switch data-testid="switch" />);
    
    const switchElement = screen.getByTestId('switch');
    expect(switchElement).toHaveClass(
      'data-[state=checked]:bg-primary',
      'data-[state=unchecked]:bg-input'
    );
  });

  it('thumb applies state-based transform styles', () => {
    const { container } = render(<Switch data-testid="switch" />);
    
    const thumb = container.querySelector('[data-slot="switch-thumb"]');
    expect(thumb).toHaveClass(
      'data-[state=checked]:translate-x-4',
      'data-[state=unchecked]:translate-x-0'
    );
  });
});