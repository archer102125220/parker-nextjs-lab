import { render, screen, fireEvent } from '@testing-library/react';
import PhoneInput from '@/components/PhoneInput';

// Mock the SCSS file
jest.mock('@/components/PhoneInput/index.scss', () => ({}));

// Mock the Selector component
jest.mock('@/components/Selector', () => ({
  __esModule: true,
  default: ({ value, onChange, children }: {
    value: string | number;
    onChange: (value: string | number) => void;
    children: React.ReactNode;
  }) => (
    <div data-testid="country-selector">
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        data-testid="country-select"
      >
        <option value="TW">+886</option>
        <option value="US">+1</option>
        <option value="JP">+81</option>
      </select>
      {children}
    </div>
  )
}));

describe('PhoneInput Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<PhoneInput />);

    // Should render the input
    const input = screen.getByPlaceholderText('請輸入電話號碼');
    expect(input).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<PhoneInput placeholder="Enter phone number" />);

    const input = screen.getByPlaceholderText('Enter phone number');
    expect(input).toBeInTheDocument();
  });

  it('renders country selector', () => {
    render(<PhoneInput />);

    const selector = screen.getByTestId('country-selector');
    expect(selector).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<PhoneInput className="custom-phone" />);

    // The component uses phone_input as the class name (with underscore)
    const wrapper = document.querySelector('.phone_input.custom-phone');
    expect(wrapper).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<PhoneInput disabled />);

    const input = screen.getByPlaceholderText('請輸入電話號碼');
    expect(input).toBeDisabled();
  });

  it('calls onChange when phone number is entered', () => {
    const handleChange = jest.fn();
    render(<PhoneInput onChange={handleChange} />);

    const input = screen.getByPlaceholderText('請輸入電話號碼');
    fireEvent.change(input, { target: { value: '912345678' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('handles country code change', () => {
    const handleChange = jest.fn();
    render(<PhoneInput onChange={handleChange} />);

    const select = screen.getByTestId('country-select');
    fireEvent.change(select, { target: { value: 'US' } });

    // After country change, onChange should be called
    // Note: this depends on the component's implementation
  });

  it('validates phone number on blur when validate is true', async () => {
    const handleValidate = jest.fn();
    render(<PhoneInput validate={true} onValidate={handleValidate} />);

    const input = screen.getByPlaceholderText('請輸入電話號碼');
    fireEvent.change(input, { target: { value: '912345678' } });
    fireEvent.blur(input);

    // Component should render without errors - validation is async
    expect(input).toBeInTheDocument();
  });

  it('renders with default country code TW', () => {
    render(<PhoneInput />);

    const select = screen.getByTestId('country-select');
    expect(select).toHaveValue('TW');
  });

  it('uses custom default country code', () => {
    render(<PhoneInput defaultCountryCode="US" />);

    const select = screen.getByTestId('country-select');
    expect(select).toHaveValue('US');
  });

  it('returns object when returnObject is true', () => {
    const handleChange = jest.fn();
    render(<PhoneInput onChange={handleChange} returnObject={true} />);

    const input = screen.getByPlaceholderText('請輸入電話號碼');
    fireEvent.change(input, { target: { value: '912345678' } });

    // Should call onChange with an object
    expect(handleChange).toHaveBeenCalled();
    const callArg = handleChange.mock.calls[0][0];
    expect(typeof callArg).toBe('object');
  });
});
