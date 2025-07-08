import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';

// Mock Radix UI Slot component
vi.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
}));

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button data-testid="button">Click me</Button>);
    
    const button = screen.getByTestId('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    expect(button.tagName).toBe('BUTTON');
  });

  it('applies default variant and size classes', () => {
    render(<Button data-testid="button">Default Button</Button>);
    
    const button = screen.getByTestId('button');
    expect(button).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'gap-2',
      'whitespace-nowrap',
      'rounded-md',
      'text-sm',
      'font-medium',
      'bg-primary',
      'text-primary-foreground',
      'h-10',
      'px-4',
      'py-2'
    );
  });

  it('applies destructive variant correctly', () => {
    render(<Button variant="destructive" data-testid="button">Delete</Button>);
    
    const button = screen.getByTestId('button');
    expect(button).toHaveClass(
      'bg-destructive',
      'text-white',
      'shadow-xs'
    );
  });

  it('applies outline variant correctly', () => {
    render(<Button variant="outline" data-testid="button">Outline</Button>);
    
    const button = screen.getByTestId('button');
    expect(button).toHaveClass(
      'border',
      'border-input',
      'bg-background',
      'shadow-xs'
    );
  });

  it('applies secondary variant correctly', () => {
    render(<Button variant="secondary" data-testid="button">Secondary</Button>);
    
    const button = screen.getByTestId('button');
    expect(button).toHaveClass(
      'bg-secondary',
      'text-secondary-foreground',
      'shadow-xs'
    );
  });

  it('applies ghost variant correctly', () => {
    render(<Button variant="ghost" data-testid="button">Ghost</Button>);
    
    const button = screen.getByTestId('button');
    expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground');
    expect(button).not.toHaveClass('bg-primary', 'shadow-xs');
  });

  it('applies link variant correctly', () => {
    render(<Button variant="link" data-testid="button">Link</Button>);
    
    const button = screen.getByTestId('button');
    expect(button).toHaveClass(
      'text-primary',
      'underline-offset-4',
      'hover:underline'
    );
  });

  it('applies small size correctly', () => {
    render(<Button size="sm" data-testid="button">Small</Button>);
    
    const button = screen.getByTestId('button');
    expect(button).toHaveClass('h-9', 'rounded-md', 'px-3');
    expect(button).not.toHaveClass('h-10', 'px-4', 'py-2');
  });

  it('applies large size correctly', () => {
    render(<Button size="lg" data-testid="button">Large</Button>);
    
    const button = screen.getByTestId('button');
    expect(button).toHaveClass('h-11', 'rounded-md', 'px-8');
  });

  it('applies icon size correctly', () => {
    render(<Button size="icon" data-testid="button">🔥</Button>);
    
    const button = screen.getByTestId('button');
    expect(button).toHaveClass('h-10', 'w-10');
  });

  it('applies clear size correctly', () => {
    render(<Button size="clear" data-testid="button">Clear</Button>);
    
    const button = screen.getByTestId('button');
    // Clear size has empty classes, so we check it doesn't have default size classes
    expect(button).not.toHaveClass('h-10', 'px-4', 'py-2');
  });

  it('applies custom className', () => {
    render(<Button className="custom-button" data-testid="button">Custom</Button>);
    
    const button = screen.getByTestId('button');
    expect(button).toHaveClass('custom-button');
  });

  it('forwards button attributes correctly', () => {
    render(
      <Button 
        type="submit"
        id="button-id"
        aria-label="submit form"
        data-testid="button"
        disabled
      >
        Submit
      </Button>
    );
    
    const button = screen.getByTestId('button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('id', 'button-id');
    expect(button).toHaveAttribute('aria-label', 'submit form');
    expect(button).toBeDisabled();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} data-testid="button">Click me</Button>);
    
    const button = screen.getByTestId('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not handle click when disabled', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled data-testid="button">Disabled</Button>);
    
    const button = screen.getByTestId('button');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies disabled styles', () => {
    render(<Button disabled data-testid="button">Disabled</Button>);
    
    const button = screen.getByTestId('button');
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
  });

  it('applies focus styles', () => {
    render(<Button data-testid="button">Focus me</Button>);
    
    const button = screen.getByTestId('button');
    expect(button).toHaveClass(
      'focus-visible:outline-hidden',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2'
    );
  });

  it('renders as child when asChild is true', () => {
    render(
      <Button asChild data-testid="button">
        <a href="/test">Link Button</a>
      </Button>
    );
    
    const button = screen.getByTestId('button');
    expect(button.tagName).toBe('DIV'); // Mocked Slot renders as div
    expect(button).toHaveTextContent('Link Button');
  });

  it('renders as button when asChild is false', () => {
    render(<Button asChild={false} data-testid="button">Regular Button</Button>);
    
    const button = screen.getByTestId('button');
    expect(button.tagName).toBe('BUTTON');
  });

  it('supports all variant and size combinations', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
    const sizes = ['default', 'sm', 'lg', 'icon', 'clear'] as const;
    
    variants.forEach((variant) => {
      sizes.forEach((size) => {
        const { unmount } = render(
          <Button 
            variant={variant} 
            size={size} 
            data-testid={`button-${variant}-${size}`}
          >
            {variant} {size}
          </Button>
        );
        
        const button = screen.getByTestId(`button-${variant}-${size}`);
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(`${variant} ${size}`);
        
        unmount();
      });
    });
  });

  it('handles form submission', () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());
    render(
      <form onSubmit={handleSubmit}>
        <Button type="submit" data-testid="submit-button">Submit Form</Button>
      </form>
    );
    
    const button = screen.getByTestId('submit-button');
    fireEvent.click(button);
    
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders with icons correctly', () => {
    render(
      <Button data-testid="button">
        <span data-testid="icon">🔥</span>
        Button with Icon
      </Button>
    );
    
    const button = screen.getByTestId('button');
    const icon = screen.getByTestId('icon');
    
    expect(button).toHaveTextContent('🔥Button with Icon');
    expect(icon).toBeInTheDocument();
  });
});