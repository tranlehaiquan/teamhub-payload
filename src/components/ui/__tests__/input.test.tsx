import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../input';

describe('Input Component', () => {
  it('renders correctly', () => {
    render(<Input data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
    expect(input).toBeInstanceOf(HTMLInputElement);
  });

  it('applies default classes', () => {
    render(<Input data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveClass(
      'flex', 'h-10', 'w-full', 'rounded-md', 'border', 'border-input', 
      'bg-background', 'px-3', 'py-2', 'text-base', 'ring-offset-background'
    );
  });

  it('applies custom className', () => {
    render(<Input className="custom-input" data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('custom-input');
  });

  it('forwards input type prop', () => {
    render(<Input type="password" data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('forwards placeholder prop', () => {
    render(<Input placeholder="Enter your name" data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('placeholder', 'Enter your name');
  });

  it('forwards value prop', () => {
    render(<Input value="test value" data-testid="input" readOnly />);
    
    const input = screen.getByTestId('input') as HTMLInputElement;
    expect(input.value).toBe('test value');
  });

  it('forwards disabled prop', () => {
    render(<Input disabled data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toBeDisabled();
  });

  it('forwards required prop', () => {
    render(<Input required data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toBeRequired();
  });

  it('forwards name prop', () => {
    render(<Input name="username" data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('name', 'username');
  });

  it('forwards id prop', () => {
    render(<Input id="input-id" data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('id', 'input-id');
  });

  it('handles onChange events', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} data-testid="input" />);
    
    const input = screen.getByTestId('input');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('handles onFocus events', () => {
    const handleFocus = vi.fn();
    render(<Input onFocus={handleFocus} data-testid="input" />);
    
    const input = screen.getByTestId('input');
    fireEvent.focus(input);
    
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it('handles onBlur events', () => {
    const handleBlur = vi.fn();
    render(<Input onBlur={handleBlur} data-testid="input" />);
    
    const input = screen.getByTestId('input');
    fireEvent.blur(input);
    
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('handles different input types correctly', () => {
    const types = ['text', 'email', 'password', 'number', 'tel', 'url'];
    
    types.forEach((type) => {
      const { unmount } = render(<Input type={type as any} data-testid={`input-${type}`} />);
      
      const input = screen.getByTestId(`input-${type}`);
      expect(input).toHaveAttribute('type', type);
      
      unmount();
    });
  });

  it('applies focus styles correctly', () => {
    render(<Input data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('focus-visible:outline-hidden', 'focus-visible:ring-2');
  });

  it('applies disabled styles correctly', () => {
    render(<Input disabled data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
  });
});