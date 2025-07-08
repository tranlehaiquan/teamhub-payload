import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableFooter, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableCaption 
} from '../table';

describe('Table Components', () => {
  describe('Table', () => {
    it('renders table correctly', () => {
      render(
        <Table data-testid="table">
          <tbody>
            <tr>
              <td>Cell content</td>
            </tr>
          </tbody>
        </Table>
      );
      
      const table = screen.getByTestId('table');
      expect(table).toBeInTheDocument();
      expect(table.tagName).toBe('TABLE');
    });

    it('applies default classes', () => {
      render(<Table data-testid="table" />);
      
      const table = screen.getByTestId('table');
      expect(table).toHaveClass('w-full', 'caption-bottom', 'text-sm');
    });

    it('applies custom className', () => {
      render(<Table className="custom-table" data-testid="table" />);
      
      const table = screen.getByTestId('table');
      expect(table).toHaveClass('custom-table');
    });

    it('is wrapped in a div with overflow classes', () => {
      const { container } = render(<Table data-testid="table" />);
      const wrapper = container.firstChild;
      
      expect(wrapper).toHaveClass('relative', 'w-full', 'overflow-auto');
    });
  });

  describe('TableHeader', () => {
    it('renders thead correctly', () => {
      render(
        <table>
          <TableHeader data-testid="table-header">
            <tr>
              <th>Header</th>
            </tr>
          </TableHeader>
        </table>
      );
      
      const header = screen.getByTestId('table-header');
      expect(header).toBeInTheDocument();
      expect(header.tagName).toBe('THEAD');
    });

    it('applies default classes', () => {
      render(
        <table>
          <TableHeader data-testid="table-header" />
        </table>
      );
      
      const header = screen.getByTestId('table-header');
      expect(header).toHaveClass('[&_tr]:border-b');
    });

    it('applies custom className', () => {
      render(
        <table>
          <TableHeader className="custom-header" data-testid="table-header" />
        </table>
      );
      
      const header = screen.getByTestId('table-header');
      expect(header).toHaveClass('custom-header');
    });
  });

  describe('TableBody', () => {
    it('renders tbody correctly', () => {
      render(
        <table>
          <TableBody data-testid="table-body">
            <tr>
              <td>Body content</td>
            </tr>
          </TableBody>
        </table>
      );
      
      const body = screen.getByTestId('table-body');
      expect(body).toBeInTheDocument();
      expect(body.tagName).toBe('TBODY');
    });

    it('applies default classes', () => {
      render(
        <table>
          <TableBody data-testid="table-body" />
        </table>
      );
      
      const body = screen.getByTestId('table-body');
      expect(body).toHaveClass('[&_tr:last-child]:border-0');
    });

    it('applies custom className', () => {
      render(
        <table>
          <TableBody className="custom-body" data-testid="table-body" />
        </table>
      );
      
      const body = screen.getByTestId('table-body');
      expect(body).toHaveClass('custom-body');
    });
  });

  describe('TableFooter', () => {
    it('renders tfoot correctly', () => {
      render(
        <table>
          <TableFooter data-testid="table-footer">
            <tr>
              <td>Footer content</td>
            </tr>
          </TableFooter>
        </table>
      );
      
      const footer = screen.getByTestId('table-footer');
      expect(footer).toBeInTheDocument();
      expect(footer.tagName).toBe('TFOOT');
    });

    it('applies default classes', () => {
      render(
        <table>
          <TableFooter data-testid="table-footer" />
        </table>
      );
      
      const footer = screen.getByTestId('table-footer');
      expect(footer).toHaveClass('border-t', 'bg-muted/50', 'font-medium', 'last:[&>tr]:border-b-0');
    });

    it('applies custom className', () => {
      render(
        <table>
          <TableFooter className="custom-footer" data-testid="table-footer" />
        </table>
      );
      
      const footer = screen.getByTestId('table-footer');
      expect(footer).toHaveClass('custom-footer');
    });
  });

  describe('TableRow', () => {
    it('renders tr correctly', () => {
      render(
        <table>
          <tbody>
            <TableRow data-testid="table-row">
              <td>Row content</td>
            </TableRow>
          </tbody>
        </table>
      );
      
      const row = screen.getByTestId('table-row');
      expect(row).toBeInTheDocument();
      expect(row.tagName).toBe('TR');
    });

    it('applies default classes', () => {
      render(
        <table>
          <tbody>
            <TableRow data-testid="table-row" />
          </tbody>
        </table>
      );
      
      const row = screen.getByTestId('table-row');
      expect(row).toHaveClass('border-b', 'transition-colors', 'hover:bg-muted/50', 'data-[state=selected]:bg-muted');
    });

    it('applies custom className', () => {
      render(
        <table>
          <tbody>
            <TableRow className="custom-row" data-testid="table-row" />
          </tbody>
        </table>
      );
      
      const row = screen.getByTestId('table-row');
      expect(row).toHaveClass('custom-row');
    });
  });

  describe('TableHead', () => {
    it('renders th correctly', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHead data-testid="table-head">Header Cell</TableHead>
            </tr>
          </thead>
        </table>
      );
      
      const head = screen.getByTestId('table-head');
      expect(head).toBeInTheDocument();
      expect(head.tagName).toBe('TH');
      expect(head).toHaveTextContent('Header Cell');
    });

    it('applies default classes', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHead data-testid="table-head">Header</TableHead>
            </tr>
          </thead>
        </table>
      );
      
      const head = screen.getByTestId('table-head');
      expect(head).toHaveClass('h-12', 'px-4', 'text-left', 'align-middle', 'font-medium', 'text-muted-foreground');
    });

    it('applies custom className', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHead className="custom-head" data-testid="table-head">Header</TableHead>
            </tr>
          </thead>
        </table>
      );
      
      const head = screen.getByTestId('table-head');
      expect(head).toHaveClass('custom-head');
    });
  });

  describe('TableCell', () => {
    it('renders td correctly', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell data-testid="table-cell">Cell content</TableCell>
            </tr>
          </tbody>
        </table>
      );
      
      const cell = screen.getByTestId('table-cell');
      expect(cell).toBeInTheDocument();
      expect(cell.tagName).toBe('TD');
      expect(cell).toHaveTextContent('Cell content');
    });

    it('applies default classes', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell data-testid="table-cell">Content</TableCell>
            </tr>
          </tbody>
        </table>
      );
      
      const cell = screen.getByTestId('table-cell');
      expect(cell).toHaveClass('p-4', 'align-middle', '[&:has([role=checkbox])]:pr-0');
    });

    it('applies custom className', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell className="custom-cell" data-testid="table-cell">Content</TableCell>
            </tr>
          </tbody>
        </table>
      );
      
      const cell = screen.getByTestId('table-cell');
      expect(cell).toHaveClass('custom-cell');
    });
  });

  describe('TableCaption', () => {
    it('renders caption correctly', () => {
      render(
        <table>
          <TableCaption data-testid="table-caption">Table Caption</TableCaption>
          <tbody>
            <tr>
              <td>Content</td>
            </tr>
          </tbody>
        </table>
      );
      
      const caption = screen.getByTestId('table-caption');
      expect(caption).toBeInTheDocument();
      expect(caption.tagName).toBe('CAPTION');
      expect(caption).toHaveTextContent('Table Caption');
    });

    it('applies default classes', () => {
      render(
        <table>
          <TableCaption data-testid="table-caption">Caption</TableCaption>
        </table>
      );
      
      const caption = screen.getByTestId('table-caption');
      expect(caption).toHaveClass('mt-4', 'text-sm', 'text-muted-foreground');
    });

    it('applies custom className', () => {
      render(
        <table>
          <TableCaption className="custom-caption" data-testid="table-caption">Caption</TableCaption>
        </table>
      );
      
      const caption = screen.getByTestId('table-caption');
      expect(caption).toHaveClass('custom-caption');
    });
  });

  describe('Complete Table Structure', () => {
    it('renders a complete table with all components', () => {
      render(
        <Table data-testid="complete-table">
          <TableCaption data-testid="caption">User Data</TableCaption>
          <TableHeader data-testid="header">
            <TableRow data-testid="header-row">
              <TableHead data-testid="header-name">Name</TableHead>
              <TableHead data-testid="header-email">Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody data-testid="body">
            <TableRow data-testid="data-row">
              <TableCell data-testid="cell-name">John Doe</TableCell>
              <TableCell data-testid="cell-email">john@example.com</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter data-testid="footer">
            <TableRow data-testid="footer-row">
              <TableCell data-testid="footer-cell" colSpan={2}>Total: 1 user</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      expect(screen.getByTestId('complete-table')).toBeInTheDocument();
      expect(screen.getByTestId('caption')).toHaveTextContent('User Data');
      expect(screen.getByTestId('header-name')).toHaveTextContent('Name');
      expect(screen.getByTestId('header-email')).toHaveTextContent('Email');
      expect(screen.getByTestId('cell-name')).toHaveTextContent('John Doe');
      expect(screen.getByTestId('cell-email')).toHaveTextContent('john@example.com');
      expect(screen.getByTestId('footer-cell')).toHaveTextContent('Total: 1 user');
    });
  });
});