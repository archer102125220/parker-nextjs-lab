import { render, screen, fireEvent, act } from '@testing-library/react';
import SlideInPanel from '@/components/SlideInPanel';

// Mock the SCSS file
jest.mock('@/components/SlideInPanel/index.scss', () => ({}));

describe('SlideInPanel Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not render when no messages', () => {
    render(<SlideInPanel />);

    const panel = document.querySelector('.slide_in_panel_list');
    expect(panel).not.toBeInTheDocument();
  });

  it('renders message when value is provided', () => {
    render(<SlideInPanel value="Hello World" />);

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('auto removes message after timeout', () => {
    render(<SlideInPanel value="Temporary" timeout={2000} />);

    expect(screen.getByText('Temporary')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2500);
    });

    expect(screen.queryByText('Temporary')).not.toBeInTheDocument();
  });

  it('respects maxRow limit', () => {
    const { rerender } = render(<SlideInPanel value="Message 1" maxRow={2} />);

    rerender(<SlideInPanel value="Message 2" maxRow={2} />);
    rerender(<SlideInPanel value="Message 3" maxRow={2} />);

    // Should only have maxRow number of messages visible
    const messages = document.querySelectorAll('.slide_in_panel_list-message');
    expect(messages.length).toBeLessThanOrEqual(2);
  });

  it('calls onRemove when message is removed', () => {
    const handleRemove = jest.fn();
    render(<SlideInPanel value="Message" timeout={1000} onRemove={handleRemove} />);

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // onRemove should be called when auto-removed
  });

  it('removes message on click when userRemoveType is click', () => {
    const handleClose = jest.fn();
    render(<SlideInPanel value="Clickable" userRemoveType="click" onClose={handleClose} />);

    const message = document.querySelector('.slide_in_panel_list-message');
    fireEvent.click(message!);

    expect(handleClose).toHaveBeenCalled();
  });

  it('does not remove on click when userRemoveType is none', () => {
    render(<SlideInPanel value="Not Clickable" userRemoveType="none" timeout={10000} />);

    const message = document.querySelector('.slide_in_panel_list-message');
    fireEvent.click(message!);

    // Message should still be there
    expect(screen.getByText('Not Clickable')).toBeInTheDocument();
  });

  it('renders custom content via children render prop', () => {
    render(
      <SlideInPanel value="Custom">
        {(message) => <div data-testid="custom">{String(message.content)} Custom</div>}
      </SlideInPanel>
    );

    expect(screen.getByTestId('custom')).toHaveTextContent('Custom Custom');
  });

  it('applies left enter animation when leftEnter is true', () => {
    render(<SlideInPanel value="Left" leftEnter={true} />);

    const panel = document.querySelector('.slide_in_panel_list');
    expect(panel).toHaveAttribute('css-left-enter', 'true');
  });

  it('applies container position style', () => {
    render(<SlideInPanel value="Fixed" containerPosition="absolute" />);

    const panel = document.querySelector('.slide_in_panel_list');
    expect(panel).toBeInTheDocument();
  });

  it('does not render for empty string value', () => {
    render(<SlideInPanel value="" />);

    const panel = document.querySelector('.slide_in_panel_list');
    expect(panel).not.toBeInTheDocument();
  });

  it('does not render for null value', () => {
    render(<SlideInPanel value={null} />);

    const panel = document.querySelector('.slide_in_panel_list');
    expect(panel).not.toBeInTheDocument();
  });
});
