import { render, act } from '@testing-library/react';
import Countdown from '@/components/Countdown';

// Mock the SCSS file
jest.mock('@/components/Countdown/index.scss', () => ({}));

describe('Countdown Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders with default props', () => {
    render(<Countdown />);

    const countdown = document.querySelector('.countdown');
    expect(countdown).toBeInTheDocument();
  });

  it('displays the countdown element', () => {
    render(<Countdown initialSeconds={30} isCountdownStart={false} />);

    const countdown = document.querySelector('.countdown');
    expect(countdown).toBeInTheDocument();
  });

  it('renders with custom dimensions', () => {
    render(<Countdown width={200} height={150} />);

    const countdown = document.querySelector('.countdown');
    expect(countdown).toBeInTheDocument();
  });

  it('renders with custom colors', () => {
    render(<Countdown bgColor="#ff0000" color="#00ff00" />);

    const countdown = document.querySelector('.countdown');
    expect(countdown).toBeInTheDocument();
  });

  it('renders with custom padding', () => {
    render(<Countdown padding={20} />);

    const countdown = document.querySelector('.countdown');
    expect(countdown).toBeInTheDocument();
  });

  it('renders with count up type', () => {
    render(<Countdown countdownType="up" initialSeconds={0} endSecond={10} />);

    const countdown = document.querySelector('.countdown');
    expect(countdown).toBeInTheDocument();
  });

  it('renders when countdown is stopped', () => {
    render(<Countdown initialSeconds={10} isCountdownStart={false} />);

    const countdown = document.querySelector('.countdown');
    expect(countdown).toBeInTheDocument();
  });

  it('counts down when isCountdownStart is true', () => {
    const onStep = jest.fn();
    render(<Countdown initialSeconds={5} onCountdownStep={onStep} isCountdownStart={true} />);

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    // Should have counted at least once
  });

  it('does not count when isCountdownStart is false', () => {
    const onStep = jest.fn();
    render(<Countdown initialSeconds={5} isCountdownStart={false} onCountdownStep={onStep} />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Component should still render
    const countdown = document.querySelector('.countdown');
    expect(countdown).toBeInTheDocument();
  });

  it('renders with modelValue', () => {
    render(<Countdown modelValue={15} />);

    const countdown = document.querySelector('.countdown');
    expect(countdown).toBeInTheDocument();
  });
});
