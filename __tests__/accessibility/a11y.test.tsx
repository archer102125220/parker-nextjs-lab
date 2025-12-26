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

// Import components individually with error handling
import SwitchButton from '@/components/SwitchButton';
import LoadingBar from '@/components/LoadingBar';

describe('Accessibility Tests', () => {
  describe('SwitchButton', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <SwitchButton
          value={false}
          onChange={() => {}}
          onLabel="On"
          offLabel="Off"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should display correct label based on value', () => {
      render(
        <SwitchButton
          value={true}
          onChange={() => {}}
          onLabel="Enabled"
          offLabel="Disabled"
        />
      );
      
      expect(screen.getByText('Enabled')).toBeInTheDocument();
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
