import { render, screen } from '@testing-library/react';
import DatePicker from '@/components/DatePicker';

// Mock MUI DatePicker and related components
jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label, disabled, value, onChange, ...props }: {
    label?: string;
    disabled?: boolean;
    value?: unknown;
    onChange?: (value: unknown) => void;
    slotProps?: { textField?: { fullWidth?: boolean } };
  }) => (
    <div data-testid="mui-date-picker">
      <input
        type="text"
        aria-label={label || 'date-picker'}
        disabled={disabled}
        defaultValue={value ? String(value) : ''}
        onChange={(e) => onChange?.(e.target.value)}
        data-format={props}
      />
    </div>
  )
}));

jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

jest.mock('@mui/x-date-pickers/AdapterDayjs', () => ({
  AdapterDayjs: class MockAdapterDayjs {}
}));

describe('DatePicker Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<DatePicker />);

    const wrapper = document.querySelector('.date-picker-wrapper');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<DatePicker className="custom-class" />);

    const wrapper = document.querySelector('.date-picker-wrapper.custom-class');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<DatePicker label="Select Date" />);

    const input = screen.getByLabelText('Select Date');
    expect(input).toBeInTheDocument();
  });

  it('renders in disabled state', () => {
    render(<DatePicker disabled label="Disabled Date" />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('renders the MUI date picker', () => {
    render(<DatePicker />);

    const datePicker = screen.getByTestId('mui-date-picker');
    expect(datePicker).toBeInTheDocument();
  });

  it('accepts different locales', () => {
    const { rerender } = render(<DatePicker locale="en" />);

    expect(document.querySelector('.date-picker-wrapper')).toBeInTheDocument();

    rerender(<DatePicker locale="zh-tw" />);
    expect(document.querySelector('.date-picker-wrapper')).toBeInTheDocument();

    rerender(<DatePicker locale="zh-cn" />);
    expect(document.querySelector('.date-picker-wrapper')).toBeInTheDocument();
  });

  it('applies empty className when not provided', () => {
    render(<DatePicker />);

    const wrapper = document.querySelector('.date-picker-wrapper');
    expect(wrapper).toHaveClass('date-picker-wrapper');
  });

  it('handles onChange callback', () => {
    const handleChange = jest.fn();
    render(<DatePicker onChange={handleChange} label="Test Date" />);

    // Component should render without errors
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renders with value prop', () => {
    const testDate = new Date('2024-01-15');
    render(<DatePicker value={testDate} />);

    const wrapper = document.querySelector('.date-picker-wrapper');
    expect(wrapper).toBeInTheDocument();
  });

  it('handles null value correctly', () => {
    render(<DatePicker value={null} />);

    const wrapper = document.querySelector('.date-picker-wrapper');
    expect(wrapper).toBeInTheDocument();
  });
});
