import { act, render, screen } from '@testing-library/react';
import EnterLabel from '@/components/Animation/EnterLabel';

jest.mock('@/components/Animation/EnterLabel/index.scss', () => ({}));

describe('EnterLabel Component', () => {
  const originalRequestAnimationFrame = window.requestAnimationFrame;
  const originalCancelAnimationFrame = window.cancelAnimationFrame;

  beforeEach(() => {
    jest.useFakeTimers();
    window.requestAnimationFrame = ((callback: FrameRequestCallback) => {
      return window.setTimeout(() => callback(performance.now()), 0);
    }) as typeof window.requestAnimationFrame;
    window.cancelAnimationFrame = ((handle: number) => {
      window.clearTimeout(handle);
    }) as typeof window.cancelAnimationFrame;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    window.requestAnimationFrame = originalRequestAnimationFrame;
    window.cancelAnimationFrame = originalCancelAnimationFrame;
  });

  it('renders the full label after auto start animation finishes', () => {
    render(<EnterLabel label="Hi" speed={10} />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByText('Hi')).toBeInTheDocument();
  });

  it('starts animation when controlled value becomes true', () => {
    const { container, rerender } = render(
      <EnterLabel label="Go" autoStart={false} value={false} />
    );

    expect(container.querySelector('.animation_enter_label')).toHaveTextContent(
      ''
    );

    rerender(<EnterLabel label="Go" autoStart={false} value={true} />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByText('Go')).toBeInTheDocument();
  });

  it('notifies when animation ends', () => {
    const handleAnimationEndChange = jest.fn();

    render(
      <EnterLabel
        label="OK"
        speed={10}
        onAnimationEndChange={handleAnimationEndChange}
      />
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(handleAnimationEndChange).toHaveBeenCalledWith(false);
    expect(handleAnimationEndChange).toHaveBeenCalledWith(true);
  });
});
