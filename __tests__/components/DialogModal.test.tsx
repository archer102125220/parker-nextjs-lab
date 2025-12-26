import { render, screen, fireEvent } from '@testing-library/react';
import DialogModal from '@/components/DialogModal';

// Mock the SCSS file
jest.mock('@/components/DialogModal/index.scss', () => ({}));

describe('DialogModal Component', () => {
  afterEach(() => {
    // Reset body overflow
    document.body.style.overflow = '';
  });

  it('does not render when closed', () => {
    render(<DialogModal open={false}>Content</DialogModal>);

    const modal = document.querySelector('.dialog-modal');
    expect(modal).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(<DialogModal open={true}>Content</DialogModal>);

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<DialogModal open={true} title="Test Title">Content</DialogModal>);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('shows close button by default', () => {
    render(<DialogModal open={true}>Content</DialogModal>);

    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    render(<DialogModal open={true} showCloseButton={false}>Content</DialogModal>);

    const closeButton = screen.queryByLabelText('Close');
    expect(closeButton).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<DialogModal open={true} onClose={handleClose}>Content</DialogModal>);

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalled();
  });

  it('closes on backdrop click by default', () => {
    const handleClose = jest.fn();
    render(<DialogModal open={true} onClose={handleClose}>Content</DialogModal>);

    const modal = document.querySelector('.dialog-modal');
    fireEvent.click(modal!);

    expect(handleClose).toHaveBeenCalled();
  });

  it('does not close on backdrop click when closeOnBackdrop is false', () => {
    const handleClose = jest.fn();
    render(<DialogModal open={true} onClose={handleClose} closeOnBackdrop={false}>Content</DialogModal>);

    const modal = document.querySelector('.dialog-modal');
    fireEvent.click(modal!);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('does not close when clicking on content', () => {
    const handleClose = jest.fn();
    render(<DialogModal open={true} onClose={handleClose}>Content</DialogModal>);

    const content = document.querySelector('.dialog-modal-content');
    fireEvent.click(content!);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('closes on Escape key press', () => {
    const handleClose = jest.fn();
    render(<DialogModal open={true} onClose={handleClose}>Content</DialogModal>);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(handleClose).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<DialogModal open={true} className="custom-modal">Content</DialogModal>);

    const content = document.querySelector('.dialog-modal-content.custom-modal');
    expect(content).toBeInTheDocument();
  });

  it('applies maxWidth class', () => {
    render(<DialogModal open={true} maxWidth="lg">Content</DialogModal>);

    const content = document.querySelector('.dialog-modal-content--lg');
    expect(content).toBeInTheDocument();
  });

  it('applies fullWidth class', () => {
    render(<DialogModal open={true} fullWidth>Content</DialogModal>);

    const content = document.querySelector('.dialog-modal-content--full_width');
    expect(content).toBeInTheDocument();
  });

  it('sets body overflow to hidden when open', () => {
    render(<DialogModal open={true}>Content</DialogModal>);

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('resets body overflow when closed', () => {
    const { rerender } = render(<DialogModal open={true}>Content</DialogModal>);

    expect(document.body.style.overflow).toBe('hidden');

    rerender(<DialogModal open={false}>Content</DialogModal>);

    expect(document.body.style.overflow).toBe('');
  });
});
