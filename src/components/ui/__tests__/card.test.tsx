import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders children correctly', () => {
      render(<Card data-testid="card">Card Content</Card>);
      
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveTextContent('Card Content');
    });

    it('applies default classes', () => {
      render(<Card data-testid="card">Content</Card>);
      
      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('data-slot', 'card');
      expect(card).toHaveClass('bg-card', 'text-card-foreground', 'rounded-xl', 'border', 'shadow-sm');
    });

    it('applies custom className', () => {
      render(<Card className="custom-class" data-testid="card">Content</Card>);
      
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-class');
    });

    it('forwards other props', () => {
      render(<Card id="custom-id" data-testid="card">Content</Card>);
      
      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('CardHeader', () => {
    it('renders children correctly', () => {
      render(<CardHeader data-testid="card-header">Header Content</CardHeader>);
      
      const header = screen.getByTestId('card-header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('Header Content');
    });

    it('applies default classes', () => {
      render(<CardHeader data-testid="card-header">Content</CardHeader>);
      
      const header = screen.getByTestId('card-header');
      expect(header).toHaveAttribute('data-slot', 'card-header');
      expect(header).toHaveClass('flex', 'flex-col', 'gap-1.5', 'p-6');
    });

    it('applies custom className', () => {
      render(<CardHeader className="custom-header" data-testid="card-header">Content</CardHeader>);
      
      const header = screen.getByTestId('card-header');
      expect(header).toHaveClass('custom-header');
    });
  });

  describe('CardTitle', () => {
    it('renders children correctly', () => {
      render(<CardTitle data-testid="card-title">Title Content</CardTitle>);
      
      const title = screen.getByTestId('card-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Title Content');
    });

    it('applies default classes', () => {
      render(<CardTitle data-testid="card-title">Content</CardTitle>);
      
      const title = screen.getByTestId('card-title');
      expect(title).toHaveAttribute('data-slot', 'card-title');
      expect(title).toHaveClass('leading-none', 'font-semibold', 'tracking-tight');
    });

    it('applies custom className', () => {
      render(<CardTitle className="custom-title" data-testid="card-title">Content</CardTitle>);
      
      const title = screen.getByTestId('card-title');
      expect(title).toHaveClass('custom-title');
    });
  });

  describe('CardDescription', () => {
    it('renders children correctly', () => {
      render(<CardDescription data-testid="card-description">Description Content</CardDescription>);
      
      const description = screen.getByTestId('card-description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent('Description Content');
    });

    it('applies default classes', () => {
      render(<CardDescription data-testid="card-description">Content</CardDescription>);
      
      const description = screen.getByTestId('card-description');
      expect(description).toHaveAttribute('data-slot', 'card-description');
      expect(description).toHaveClass('text-muted-foreground', 'text-sm');
    });

    it('applies custom className', () => {
      render(<CardDescription className="custom-desc" data-testid="card-description">Content</CardDescription>);
      
      const description = screen.getByTestId('card-description');
      expect(description).toHaveClass('custom-desc');
    });
  });

  describe('CardContent', () => {
    it('renders children correctly', () => {
      render(<CardContent data-testid="card-content">Content Area</CardContent>);
      
      const content = screen.getByTestId('card-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Content Area');
    });

    it('applies default classes', () => {
      render(<CardContent data-testid="card-content">Content</CardContent>);
      
      const content = screen.getByTestId('card-content');
      expect(content).toHaveAttribute('data-slot', 'card-content');
      expect(content).toHaveClass('p-6', 'pt-0');
    });

    it('applies custom className', () => {
      render(<CardContent className="custom-content" data-testid="card-content">Content</CardContent>);
      
      const content = screen.getByTestId('card-content');
      expect(content).toHaveClass('custom-content');
    });
  });

  describe('CardFooter', () => {
    it('renders children correctly', () => {
      render(<CardFooter data-testid="card-footer">Footer Content</CardFooter>);
      
      const footer = screen.getByTestId('card-footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveTextContent('Footer Content');
    });

    it('applies default classes', () => {
      render(<CardFooter data-testid="card-footer">Content</CardFooter>);
      
      const footer = screen.getByTestId('card-footer');
      expect(footer).toHaveAttribute('data-slot', 'card-footer');
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
    });

    it('applies custom className', () => {
      render(<CardFooter className="custom-footer" data-testid="card-footer">Content</CardFooter>);
      
      const footer = screen.getByTestId('card-footer');
      expect(footer).toHaveClass('custom-footer');
    });
  });

  describe('Complete Card Structure', () => {
    it('renders a complete card with all components', () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader data-testid="header">
            <CardTitle data-testid="title">Card Title</CardTitle>
            <CardDescription data-testid="description">Card Description</CardDescription>
          </CardHeader>
          <CardContent data-testid="content">
            Card content goes here
          </CardContent>
          <CardFooter data-testid="footer">
            Card footer
          </CardFooter>
        </Card>
      );

      expect(screen.getByTestId('complete-card')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toHaveTextContent('Card Title');
      expect(screen.getByTestId('description')).toHaveTextContent('Card Description');
      expect(screen.getByTestId('content')).toHaveTextContent('Card content goes here');
      expect(screen.getByTestId('footer')).toHaveTextContent('Card footer');
    });
  });
});