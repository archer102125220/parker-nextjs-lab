import { render, screen, fireEvent } from '@testing-library/react';
import SwitchButton from '@/components/SwitchButton';

// Mock the SCSS import
jest.mock('@/components/SwitchButton/index.scss', () => ({}));

describe('SwitchButton Component', () => {
  it('renders without crashing', () => {
    render(<SwitchButton />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('renders with default unchecked state', () => {
    render(<SwitchButton />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('renders with checked state when value is true', () => {
    render(<SwitchButton value={true} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('displays label text', () => {
    render(<SwitchButton label="Toggle me" />);
    expect(screen.getByText('Toggle me')).toBeInTheDocument();
  });

  it('displays checkedLabel when checked', () => {
    render(<SwitchButton value={true} label="Off" checkedLabel="On" />);
    expect(screen.getByText('On')).toBeInTheDocument();
    expect(screen.queryByText('Off')).not.toBeInTheDocument();
  });

  it('displays label when unchecked', () => {
    render(<SwitchButton value={false} label="Off" checkedLabel="On" />);
    expect(screen.getByText('Off')).toBeInTheDocument();
    expect(screen.queryByText('On')).not.toBeInTheDocument();
  });

  it('calls onChange callback when clicked', () => {
    const handleChange = jest.fn();
    render(<SwitchButton onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('toggles value on click', () => {
    const handleChange = jest.fn();
    render(<SwitchButton value={true} onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('does not call onChange when disabled', () => {
    const handleChange = jest.fn();
    render(<SwitchButton disabled={true} onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('applies disabled attribute when disabled prop is true', () => {
    render(<SwitchButton disabled={true} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<SwitchButton className="custom-switch" />);
    const container = document.querySelector('.switch_button.custom-switch');
    expect(container).toBeInTheDocument();
  });

  it('renders children as icon content', () => {
    render(
      <SwitchButton>
        <span data-testid="custom-icon">★</span>
      </SwitchButton>
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders React node icon', () => {
    render(<SwitchButton icon={<span data-testid="node-icon">🔘</span>} />);
    expect(screen.getByTestId('node-icon')).toBeInTheDocument();
  });

  it('renders checkedIcon when checked', () => {
    render(
      <SwitchButton
        value={true}
        icon={<span data-testid="unchecked-icon">○</span>}
        checkedIcon={<span data-testid="checked-icon">●</span>}
      />
    );
    expect(screen.getByTestId('checked-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('unchecked-icon')).not.toBeInTheDocument();
  });
});
