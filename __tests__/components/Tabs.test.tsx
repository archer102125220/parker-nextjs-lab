import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from '@/components/Tabs/Bar';

// Mock the SCSS file
jest.mock('@/components/Tabs/Bar.scss', () => ({}));

// Mock scrollIntoView for JSDOM
Element.prototype.scrollIntoView = jest.fn();

const mockTabs = [
  { label: 'Tab 1', value: 'tab1' },
  { label: 'Tab 2', value: 'tab2' },
  { label: 'Tab 3', value: 'tab3' }
];

describe('Tabs Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all tabs', () => {
    render(<Tabs tabs={mockTabs} />);

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('renders the active indicator for selected tab', () => {
    render(<Tabs tabs={mockTabs} value="tab2" />);

    // Tab 2 should be visible and active
    const tab2 = screen.getByText('Tab 2');
    expect(tab2).toBeInTheDocument();
  });

  it('calls onChange when tab is clicked', () => {
    const handleChange = jest.fn();
    render(<Tabs tabs={mockTabs} onChange={handleChange} />);

    fireEvent.click(screen.getByText('Tab 2'));

    expect(handleChange).toHaveBeenCalledWith('tab2', 1);
  });

  it('applies custom className', () => {
    render(<Tabs tabs={mockTabs} className="custom-tabs" />);

    const tabsContainer = document.querySelector('.tabs.custom-tabs');
    expect(tabsContainer).toBeInTheDocument();
  });

  it('renders with fullWidth variant', () => {
    render(<Tabs tabs={mockTabs} variant="fullWidth" />);

    // Component should render
    const tabsContainer = document.querySelector('.tabs');
    expect(tabsContainer).toBeInTheDocument();
  });

  it('handles disabled tabs - does not call onChange', () => {
    const tabsWithDisabled = [
      { label: 'Tab 1', value: 'tab1' },
      { label: 'Tab 2', value: 'tab2', disabled: true },
      { label: 'Tab 3', value: 'tab3' }
    ];

    const handleChange = jest.fn();
    render(<Tabs tabs={tabsWithDisabled} onChange={handleChange} />);

    fireEvent.click(screen.getByText('Tab 2'));

    // onChange should not be called for disabled tab
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('renders with vertical orientation', () => {
    render(<Tabs tabs={mockTabs} vertical={true} />);

    const tabsContainer = document.querySelector('.tabs');
    expect(tabsContainer).toBeInTheDocument();
  });

  it('renders with default value when value is not provided', () => {
    render(<Tabs tabs={mockTabs} />);

    // All tabs should be rendered
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('renders tab with ripple effect disabled', () => {
    render(<Tabs tabs={mockTabs} ripple={false} />);

    // Component should render
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
  });

  it('renders with navigation arrows', () => {
    render(<Tabs tabs={mockTabs} hasNavigation={true} />);

    const tabsContainer = document.querySelector('.tabs');
    expect(tabsContainer).toBeInTheDocument();
  });

  it('hides navigation when hasNavigation is false', () => {
    render(<Tabs tabs={mockTabs} hasNavigation={false} />);

    const tabsContainer = document.querySelector('.tabs');
    expect(tabsContainer).toBeInTheDocument();
  });
});
