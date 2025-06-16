import type React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CertificateForm } from '../CertificateForm';

vi.mock('@/components/ui/form', () => ({
  Form: ({ children }: { children: React.ReactNode }) => <div data-testid="form">{children}</div>,
  FormField: ({ render }: any) => render({ field: { value: '', onChange: vi.fn() } }),
  FormItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-item">{children}</div>
  ),
  FormLabel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-label">{children}</div>
  ),
  FormControl: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-control">{children}</div>
  ),
  FormMessage: () => <div data-testid="form-message"></div>,
}));

vi.mock('@/components/ui/datepicker', () => ({
  __esModule: true,
  default: ({ selected, onSelect, placeHolder }: any) => (
    <input
      data-testid="datepicker"
      placeholder={placeHolder}
      value={selected ? selected.toISOString() : ''}
      onChange={(e) => onSelect(e.target.value ? new Date(e.target.value) : null)}
    />
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, disabled, type }: any) => (
    <button data-testid="submit-button" disabled={disabled} type={type}>
      {children}
    </button>
  ),
}));

// Mock useForm hook
vi.mock('react-hook-form', () => ({
  useForm: vi.fn().mockImplementation((options) => ({
    control: {},
    handleSubmit: vi.fn(),
    formState: { isSubmitting: false },
    setValue: vi.fn(),
    getValues: vi.fn(),
    reset: vi.fn(),
    defaultValues: options?.defaultValues,
  })),
}));

describe('CertificateForm', () => {
  const mockOnSubmit = vi.fn();

  const mockUserSkills = [
    { id: 1, skill: { name: 'JavaScript' } },
    { id: 2, skill: { name: 'React' } },
    { id: 3, skill: { name: 'TypeScript' } },
  ];

  it('renders all form fields correctly', () => {
    const mockForm = {
      control: {},
      formState: { isSubmitting: false },
      defaultValues: {
        name: '',
        deliveryDate: null,
        expiryDate: null,
        issuingOrganization: '',
        skill: 0,
      },
    };

    render(
      <CertificateForm
        form={mockForm as any}
        userSkills={mockUserSkills}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />,
    );

    // Check for form labels
    const formLabels = screen.getAllByTestId('form-label');
    expect(formLabels.length).toBe(5); // 5 fields: name, issuingOrganization, deliveryDate, expiryDate, skill

    // Check for specific labels
    const labelTexts = formLabels.map((label) => label.textContent);
    expect(labelTexts).toContain('Name');
    expect(labelTexts).toContain('Issuing Organization');
    expect(labelTexts).toContain('Delivery Date');
    expect(labelTexts).toContain('Expiry Date');
    expect(labelTexts).toContain('Skill');

    // Check for submit button
    const submitButton = screen.getByTestId('submit-button') as HTMLButtonElement;
    expect(submitButton).toBeDefined();
    expect(submitButton.textContent).toBe('Save');
    expect(submitButton.disabled).toBe(false);
  });

  it('displays the submit button as disabled when isSubmitting is true', () => {
    const mockForm = {
      control: {},
      formState: { isSubmitting: false },
    };

    render(
      <CertificateForm
        form={mockForm as any}
        userSkills={mockUserSkills}
        onSubmit={mockOnSubmit}
        isSubmitting={true}
      />,
    );

    const submitButton = screen.getByTestId('submit-button') as HTMLButtonElement;
    expect(submitButton).toBeDefined();
    expect(submitButton.textContent).toBe('Saving...');
    expect(submitButton.disabled).toBe(true);
  });

  it('calls onSubmit when the form is submitted', () => {
    const mockForm = {
      control: {},
      formState: { isSubmitting: false },
    };

    render(
      <CertificateForm
        form={mockForm as any}
        userSkills={mockUserSkills}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />,
    );

    const formElement = screen.getByTestId('form').querySelector('form');
    fireEvent.submit(formElement!);

    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
