/**
 * Integration Tests
 * Tests for component interactions and data flow between components
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

// Import components for integration testing
import SwitchButton from '@/components/SwitchButton';
import DialogModal from '@/components/DialogModal';

describe('Integration Tests', () => {
  describe('SwitchButton - State Management', () => {
    it('should toggle state correctly with onChange callback', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      
      render(
        <SwitchButton
          value={false}
          onChange={handleChange}
          onLabel="On"
          offLabel="Off"
        />
      );
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      
      await user.click(checkbox);
      
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should display correct label based on checked state', () => {
      const { rerender } = render(
        <SwitchButton
          value={false}
          onChange={() => {}}
          label="Disabled"
          checkedLabel="Enabled"
        />
      );
      
      // When unchecked, should show label
      expect(screen.getByText('Disabled')).toBeInTheDocument();
      
      // Rerender with checked state
      rerender(
        <SwitchButton
          value={true}
          onChange={() => {}}
          label="Disabled"
          checkedLabel="Enabled"
        />
      );
      
      // When checked, should show checkedLabel
      expect(screen.getByText('Enabled')).toBeInTheDocument();
    });

    it('should respect disabled state', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      
      render(
        <SwitchButton
          value={false}
          onChange={handleChange}
          disabled={true}
          onLabel="On"
          offLabel="Off"
        />
      );
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
      
      // Clicking disabled checkbox should not trigger onChange
      await user.click(checkbox);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should use ariaLabel prop for accessibility', () => {
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

    it('should work with custom colors', () => {
      render(
        <SwitchButton
          value={true}
          onChange={() => {}}
          color="#ffffff"
          bgColor="#000000"
          checkedColor="#000000"
          checkedBgColor="#00ff00"
          onLabel="On"
          offLabel="Off"
        />
      );
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });
  });

  describe('DialogModal - Open/Close Interaction', () => {
    it('should render content when open', () => {
      render(
        <DialogModal open={true} onClose={() => {}} title="Test Dialog">
          <p>Dialog content</p>
        </DialogModal>
      );
      
      expect(screen.getByText('Test Dialog')).toBeInTheDocument();
      expect(screen.getByText('Dialog content')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
      const handleClose = jest.fn();
      const user = userEvent.setup();
      
      render(
        <DialogModal
          open={true}
          onClose={handleClose}
          title="Test Dialog"
          showCloseButton={true}
        >
          <p>Content</p>
        </DialogModal>
      );
      
      // Find and click close button
      const closeButton = screen.getByRole('button');
      await user.click(closeButton);
      
      expect(handleClose).toHaveBeenCalled();
    });

    it('should not render content when closed', () => {
      render(
        <DialogModal open={false} onClose={() => {}} title="Hidden Dialog">
          <p>Hidden content</p>
        </DialogModal>
      );
      
      expect(screen.queryByText('Hidden Dialog')).not.toBeInTheDocument();
      expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
    });

    it('should render children correctly', () => {
      render(
        <DialogModal open={true} onClose={() => {}} title="Dialog">
          <button>Action Button</button>
          <p>Some text</p>
        </DialogModal>
      );
      
      expect(screen.getByText('Action Button')).toBeInTheDocument();
      expect(screen.getByText('Some text')).toBeInTheDocument();
    });
  });

  describe('Multiple SwitchButtons - Independent State', () => {
    it('should manage multiple switches independently', async () => {
      const handleChange1 = jest.fn();
      const handleChange2 = jest.fn();
      const user = userEvent.setup();
      
      render(
        <div>
          <SwitchButton
            value={false}
            onChange={handleChange1}
            ariaLabel="Switch 1"
          />
          <SwitchButton
            value={true}
            onChange={handleChange2}
            ariaLabel="Switch 2"
          />
        </div>
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(2);
      
      // First switch should be unchecked
      expect(checkboxes[0]).not.toBeChecked();
      // Second switch should be checked
      expect(checkboxes[1]).toBeChecked();
      
      // Click first switch
      await user.click(checkboxes[0]);
      expect(handleChange1).toHaveBeenCalledWith(true);
      expect(handleChange2).not.toHaveBeenCalled();
    });
  });

  describe('DialogModal with SwitchButton - Nested Components', () => {
    it('should interact with SwitchButton inside DialogModal', async () => {
      const handleSwitchChange = jest.fn();
      const user = userEvent.setup();
      
      render(
        <DialogModal open={true} onClose={() => {}} title="Settings">
          <SwitchButton
            value={false}
            onChange={handleSwitchChange}
            ariaLabel="Setting toggle"
          />
        </DialogModal>
      );
      
      expect(screen.getByText('Settings')).toBeInTheDocument();
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      expect(handleSwitchChange).toHaveBeenCalledWith(true);
    });
  });
});
