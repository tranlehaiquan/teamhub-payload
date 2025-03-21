import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { logout } from '@/services/users';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import LogoutPage from '../Logout';
import { Mock } from 'vitest';

// src/app/(frontend)/(auth)/logout/Logout.test.tsx

// Mock dependencies
vi.mock('@/services/users', () => ({
  logout: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('LogoutPage', () => {
  const mockPush = vi.fn();
  const mockClear = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    (useRouter as Mock).mockReturnValue({
      push: mockPush,
    });

    (useQueryClient as Mock).mockReturnValue({
      clear: mockClear,
    });

    (logout as Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders logout page with correct elements', () => {
    render(<LogoutPage />);

    expect(screen.getByTestId('logout-page')).toBeInTheDocument();
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('logout-heading')).toBeInTheDocument();
    expect(screen.getByTestId('logout-message')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByTestId('redirect-message')).toBeInTheDocument();
  });

  it('calls logout function on mount', () => {
    render(<LogoutPage />);
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('clears query client after successful logout', async () => {
    render(<LogoutPage />);

    // Wait for the useEffect to complete
    await act(async () => {
      await Promise.resolve();
    });

    expect(mockClear).toHaveBeenCalledTimes(1);
  });

  it('redirects to login page on logout error', async () => {
    const mockError = new Error('Logout failed');
    (logout as Mock).mockRejectedValueOnce(mockError);

    // Spy on console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<LogoutPage />);

    // Wait for the error to be handled
    await act(async () => {
      await Promise.resolve();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Logout failed:', mockError);
    expect(mockPush).toHaveBeenCalledWith('/login');

    consoleSpy.mockRestore();
  });

  it('animates dots correctly', async () => {
    render(<LogoutPage />);

    // Initial state
    const message = screen.getByTestId('logout-message');
    expect(message.textContent).toContain("We're securely logging you out");

    // After first interval
    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    expect(message.textContent).toContain("We're securely logging you out.");

    // After second interval
    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    expect(message.textContent).toContain("We're securely logging you out..");

    // After third interval
    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    expect(message.textContent).toContain("We're securely logging you out...");

    // After fourth interval (reset)
    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    expect(message.textContent).toContain("We're securely logging you out");
  });
});
