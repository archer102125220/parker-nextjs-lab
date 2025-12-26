/**
 * Accessibility tests for key components using jest-axe
 * Tests WCAG 2.1 compliance
 */
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn()
  }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams()
}));

// Import components
import SwitchButton from '@/components/SwitchButton';
import LoadingBar from '@/components/LoadingBar';

describe('Accessibility Tests', () => {
  describe('SwitchButton', () => {
    it('should have no accessibility violations with aria-label', async () => {
      const { container } = render(
        <SwitchButton
          value={false}
          onChange={() => {}}
          onLabel="Turn On"
          offLabel="Turn Off"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible checkbox with role', () => {
      render(
        <SwitchButton
          value={true}
          onChange={() => {}}
          onLabel="Enabled"
          offLabel="Disabled"
        />
      );
      
      // Checkbox should be accessible via role
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('aria-label', 'Enabled');
    });

    it('should use offLabel when unchecked', () => {
      render(
        <SwitchButton
          value={false}
          onChange={() => {}}
          onLabel="On"
          offLabel="Off"
        />
      );
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Off');
    });

    it('should use explicit ariaLabel when provided', () => {
      render(
        <SwitchButton
          value={false}
          onChange={() => {}}
          ariaLabel="Toggle dark mode"
        />
      );
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Toggle dark mode');
    });
  });

  describe('LoadingBar', () => {
    it('should have no accessibility violations when loading', async () => {
      const { container } = render(<LoadingBar loading={true} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when not loading', async () => {
      const { container } = render(<LoadingBar loading={false} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
