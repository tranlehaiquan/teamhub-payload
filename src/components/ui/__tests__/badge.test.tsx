import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../badge';

describe('Badge Component', () => {
  it('renders children correctly', () => {
    render(<Badge data-testid="badge">Badge Text</Badge>);
    
    const badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Badge Text');
    expect(badge.tagName).toBe('DIV');
  });

  it('applies default variant classes', () => {
    render(<Badge data-testid="badge">Default Badge</Badge>);
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'rounded-full',
      'border',
      'px-2.5',
      'py-0.5',
      'text-xs',
      'font-semibold',
      'transition-colors',
      'border-transparent',
      'bg-primary',
      'text-primary-foreground'
    );
  });

  it('applies secondary variant correctly', () => {
    render(<Badge variant="secondary" data-testid="badge">Secondary Badge</Badge>);
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass(
      'border-transparent',
      'bg-secondary',
      'text-secondary-foreground'
    );
  });

  it('applies destructive variant correctly', () => {
    render(<Badge variant="destructive" data-testid="badge">Destructive Badge</Badge>);
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass(
      'border-transparent',
      'bg-destructive',
      'text-destructive-foreground'
    );
  });

  it('applies outline variant correctly', () => {
    render(<Badge variant="outline" data-testid="badge">Outline Badge</Badge>);
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('text-foreground');
    // Note: outline variant doesn't include bg- classes
    expect(badge).not.toHaveClass('bg-primary', 'bg-secondary', 'bg-destructive');
  });

  it('applies custom className', () => {
    render(<Badge className="custom-badge" data-testid="badge">Custom Badge</Badge>);
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('custom-badge');
  });

  it('forwards HTML attributes correctly', () => {
    render(
      <Badge 
        id="badge-id" 
        aria-label="test badge" 
        data-testid="badge"
        title="Badge title"
      >
        Badge
      </Badge>
    );
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('id', 'badge-id');
    expect(badge).toHaveAttribute('aria-label', 'test badge');
    expect(badge).toHaveAttribute('title', 'Badge title');
  });

  it('applies focus styles', () => {
    render(<Badge data-testid="badge">Focusable Badge</Badge>);
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass(
      'focus:outline-hidden',
      'focus:ring-2',
      'focus:ring-ring',
      'focus:ring-offset-2'
    );
  });

  it('applies hover styles for default variant', () => {
    render(<Badge data-testid="badge">Hoverable Badge</Badge>);
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('hover:bg-primary/80');
  });

  it('applies hover styles for secondary variant', () => {
    render(<Badge variant="secondary" data-testid="badge">Secondary Badge</Badge>);
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('hover:bg-secondary/80');
  });

  it('applies hover styles for destructive variant', () => {
    render(<Badge variant="destructive" data-testid="badge">Destructive Badge</Badge>);
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('hover:bg-destructive/80');
  });

  it('can render with JSX children', () => {
    render(
      <Badge data-testid="badge">
        <span>Icon</span> Badge with Icon
      </Badge>
    );
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('Icon Badge with Icon');
    expect(badge.querySelector('span')).toBeInTheDocument();
  });

  it('handles empty content', () => {
    render(<Badge data-testid="badge"></Badge>);
    
    const badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    expect(badge.textContent).toBe('');
  });

  it('supports all variant types', () => {
    const variants = ['default', 'secondary', 'destructive', 'outline'] as const;
    
    variants.forEach((variant) => {
      const { unmount } = render(
        <Badge variant={variant} data-testid={`badge-${variant}`}>
          {variant} Badge
        </Badge>
      );
      
      const badge = screen.getByTestId(`badge-${variant}`);
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent(`${variant} Badge`);
      
      unmount();
    });
  });
});