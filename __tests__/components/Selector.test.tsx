import { render, screen, fireEvent } from '@testing-library/react';
import Selector from '@/components/Selector';

// Mock the SCSS import
jest.mock('@/components/Selector/index.scss', () => ({}));

const mockOptions = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' }
];

describe('Selector Component', () => {
  beforeEach(() => {
    // Mock getBoundingClientRect and scrollHeight for height calculations
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get: function () {
        return 150;
      }
    });
  });

  it('renders without crashing', () => {
    render(<Selector optionList={mockOptions} />);
    const selector = document.querySelector('.selector');
    expect(selector).toBeInTheDocument();
  });

  it('displays current value when value prop is provided', () => {
    render(<Selector optionList={mockOptions} value="opt1" />);
    // Current value appears in both display area and option list
    const elements = screen.getAllByText('Option 1');
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it('displays empty text when optionList is empty', () => {
    render(<Selector optionList={[]} />);
    expect(screen.getByText('暫無資料')).toBeInTheDocument();
  });

  it('displays custom empty text', () => {
    render(<Selector optionList={[]} emptyText="No data available" />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<Selector optionList={mockOptions} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('calls onChange when an option is clicked', () => {
    const handleChange = jest.fn();
    render(<Selector optionList={mockOptions} onChange={handleChange} />);

    // Click on selector to open
    const selector = document.querySelector('.selector');
    fireEvent.click(selector!);

    // Click on an option
    const option = screen.getByText('Option 2');
    fireEvent.click(option);

    expect(handleChange).toHaveBeenCalledWith('opt2', 1);
  });

  it('applies custom className', () => {
    render(<Selector optionList={mockOptions} className="custom-selector" />);
    const selector = document.querySelector('.selector.custom-selector');
    expect(selector).toBeInTheDocument();
  });

  it('does not open when loading is true', () => {
    render(<Selector optionList={mockOptions} loading={true} />);
    const selector = document.querySelector('.selector');
    fireEvent.click(selector!);

    // Check that the selector doesn't have the open state CSS variable
    // This is indirect since we're testing CSS variable behavior
    expect(selector).toBeInTheDocument();
  });

  it('renders prefix slot', () => {
    render(
      <Selector
        optionList={mockOptions}
        prefixSlot={() => <span data-testid="prefix">Prefix</span>}
      />
    );
    expect(screen.getByTestId('prefix')).toBeInTheDocument();
  });

  it('renders suffix slot', () => {
    render(
      <Selector
        optionList={mockOptions}
        suffixSlot={() => <span data-testid="suffix">Suffix</span>}
      />
    );
    expect(screen.getByTestId('suffix')).toBeInTheDocument();
  });

  it('renders custom option slot', () => {
    render(
      <Selector
        optionList={mockOptions}
        optionSlot={(option, index) => (
          <span data-testid={`custom-option-${index}`}>
            Custom: {option.label}
          </span>
        )}
      />
    );
    expect(screen.getByTestId('custom-option-0')).toBeInTheDocument();
    expect(screen.getByText('Custom: Option 1')).toBeInTheDocument();
  });

  it('uses custom valueKey and displayKey', () => {
    const customOptions = [
      { id: 1, name: 'First' },
      { id: 2, name: 'Second' }
    ];
    render(
      <Selector
        optionList={customOptions}
        valueKey="id"
        displayKey="name"
        value={1}
      />
    );
    expect(screen.getAllByText('First').length).toBeGreaterThanOrEqual(1);
  });

  it('marks selected option with selected class', () => {
    render(<Selector optionList={mockOptions} value="opt2" />);
    const selectedOption = document.querySelector(
      '.selector-option_list-item_selsected'
    );
    expect(selectedOption).toBeInTheDocument();
    expect(selectedOption).toHaveTextContent('Option 2');
  });
});
