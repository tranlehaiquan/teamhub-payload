import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs';

// Mock Radix UI Tabs components
vi.mock('@radix-ui/react-tabs', () => ({
  Root: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  List: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  Trigger: ({ children, className, ...props }: any) => (
    <button className={className} {...props}>
      {children}
    </button>
  ),
  Content: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
}));

describe('Tabs Components', () => {
  describe('Tabs', () => {
    it('renders children correctly', () => {
      render(
        <Tabs data-testid="tabs">
          <div>Tabs content</div>
        </Tabs>
      );
      
      const tabs = screen.getByTestId('tabs');
      expect(tabs).toBeInTheDocument();
      expect(tabs).toHaveTextContent('Tabs content');
    });

    it('applies default classes', () => {
      render(<Tabs data-testid="tabs">Content</Tabs>);
      
      const tabs = screen.getByTestId('tabs');
      expect(tabs).toHaveAttribute('data-slot', 'tabs');
      expect(tabs).toHaveClass('flex', 'flex-col', 'gap-2');
    });

    it('applies custom className', () => {
      render(<Tabs className="custom-tabs" data-testid="tabs">Content</Tabs>);
      
      const tabs = screen.getByTestId('tabs');
      expect(tabs).toHaveClass('custom-tabs');
    });

    it('forwards props correctly', () => {
      render(<Tabs defaultValue="tab1" data-testid="tabs" aria-label="test-tabs">Content</Tabs>);
      
      const tabs = screen.getByTestId('tabs');
      expect(tabs).toHaveAttribute('aria-label', 'test-tabs');
    });
  });

  describe('TabsList', () => {
    it('renders children correctly', () => {
      render(
        <TabsList data-testid="tabs-list">
          <div>List content</div>
        </TabsList>
      );
      
      const list = screen.getByTestId('tabs-list');
      expect(list).toBeInTheDocument();
      expect(list).toHaveTextContent('List content');
    });

    it('applies default classes', () => {
      render(<TabsList data-testid="tabs-list">Content</TabsList>);
      
      const list = screen.getByTestId('tabs-list');
      expect(list).toHaveAttribute('data-slot', 'tabs-list');
      expect(list).toHaveClass(
        'bg-muted', 
        'text-muted-foreground', 
        'inline-flex', 
        'h-9', 
        'w-fit', 
        'items-center', 
        'justify-center', 
        'rounded-lg', 
        'p-1'
      );
    });

    it('applies custom className', () => {
      render(<TabsList className="custom-list" data-testid="tabs-list">Content</TabsList>);
      
      const list = screen.getByTestId('tabs-list');
      expect(list).toHaveClass('custom-list');
    });
  });

  describe('TabsTrigger', () => {
    it('renders children correctly', () => {
      render(
        <TabsTrigger data-testid="tabs-trigger" value="tab1">
          Tab 1
        </TabsTrigger>
      );
      
      const trigger = screen.getByTestId('tabs-trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent('Tab 1');
      expect(trigger.tagName).toBe('BUTTON');
    });

    it('applies default classes', () => {
      render(<TabsTrigger data-testid="tabs-trigger" value="tab1">Tab</TabsTrigger>);
      
      const trigger = screen.getByTestId('tabs-trigger');
      expect(trigger).toHaveAttribute('data-slot', 'tabs-trigger');
      expect(trigger).toHaveClass(
        'inline-flex', 
        'items-center', 
        'justify-center', 
        'gap-2', 
        'rounded-md', 
        'px-2', 
        'py-1', 
        'text-sm', 
        'font-medium', 
        'whitespace-nowrap'
      );
    });

    it('applies custom className', () => {
      render(<TabsTrigger className="custom-trigger" data-testid="tabs-trigger" value="tab1">Tab</TabsTrigger>);
      
      const trigger = screen.getByTestId('tabs-trigger');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('forwards value prop', () => {
      render(<TabsTrigger data-testid="tabs-trigger" value="tab1">Tab</TabsTrigger>);
      
      const trigger = screen.getByTestId('tabs-trigger');
      expect(trigger).toHaveAttribute('value', 'tab1');
    });
  });

  describe('TabsContent', () => {
    it('renders children correctly', () => {
      render(
        <TabsContent data-testid="tabs-content" value="tab1">
          Content for tab 1
        </TabsContent>
      );
      
      const content = screen.getByTestId('tabs-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Content for tab 1');
    });

    it('applies default classes', () => {
      render(<TabsContent data-testid="tabs-content" value="tab1">Content</TabsContent>);
      
      const content = screen.getByTestId('tabs-content');
      expect(content).toHaveAttribute('data-slot', 'tabs-content');
      expect(content).toHaveClass('flex-1', 'outline-none');
    });

    it('applies custom className', () => {
      render(<TabsContent className="custom-content" data-testid="tabs-content" value="tab1">Content</TabsContent>);
      
      const content = screen.getByTestId('tabs-content');
      expect(content).toHaveClass('custom-content');
    });

    it('forwards value prop', () => {
      render(<TabsContent data-testid="tabs-content" value="tab1">Content</TabsContent>);
      
      const content = screen.getByTestId('tabs-content');
      expect(content).toHaveAttribute('value', 'tab1');
    });
  });

  describe('Complete Tabs Structure', () => {
    it('renders a complete tabs component', () => {
      render(
        <Tabs defaultValue="tab1" data-testid="complete-tabs">
          <TabsList data-testid="list">
            <TabsTrigger value="tab1" data-testid="trigger1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" data-testid="trigger2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" data-testid="content1">
            Content for Tab 1
          </TabsContent>
          <TabsContent value="tab2" data-testid="content2">
            Content for Tab 2
          </TabsContent>
        </Tabs>
      );

      expect(screen.getByTestId('complete-tabs')).toBeInTheDocument();
      expect(screen.getByTestId('list')).toBeInTheDocument();
      expect(screen.getByTestId('trigger1')).toHaveTextContent('Tab 1');
      expect(screen.getByTestId('trigger2')).toHaveTextContent('Tab 2');
      expect(screen.getByTestId('content1')).toHaveTextContent('Content for Tab 1');
      expect(screen.getByTestId('content2')).toHaveTextContent('Content for Tab 2');
    });
  });
});