import { render, screen, fireEvent, act } from '@testing-library/react';
import Banner from '@/components/Banner';

// Mock the SCSS file
jest.mock('@/components/Banner/index.scss', () => ({}));

const mockBanners = [
  { id: 1, image: '/image1.jpg', title: 'Banner 1', alt: 'Banner 1' },
  { id: 2, image: '/image2.jpg', title: 'Banner 2', alt: 'Banner 2' },
  { id: 3, image: '/image3.jpg', title: 'Banner 3', alt: 'Banner 3' }
];

describe('Banner Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders all banners', () => {
    render(<Banner banners={mockBanners} autoplay={false} />);

    expect(screen.getByAltText('Banner 1')).toBeInTheDocument();
    expect(screen.getByAltText('Banner 2')).toBeInTheDocument();
    expect(screen.getByAltText('Banner 3')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<Banner banners={mockBanners} className="custom-banner" autoplay={false} />);

    const banner = document.querySelector('.banner.custom-banner');
    expect(banner).toBeInTheDocument();
  });

  it('shows navigation buttons by default', () => {
    render(<Banner banners={mockBanners} autoplay={false} />);

    const prevButton = document.querySelector('.banner-nav-prev');
    const nextButton = document.querySelector('.banner-nav-next');
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('hides navigation when showNavigation is false', () => {
    render(<Banner banners={mockBanners} showNavigation={false} autoplay={false} />);

    const prevButton = document.querySelector('.banner-nav-prev');
    const nextButton = document.querySelector('.banner-nav-next');
    expect(prevButton).not.toBeInTheDocument();
    expect(nextButton).not.toBeInTheDocument();
  });

  it('shows indicators by default', () => {
    render(<Banner banners={mockBanners} autoplay={false} />);

    const indicators = document.querySelectorAll('.banner-indicator');
    expect(indicators.length).toBe(3);
  });

  it('hides indicators when showIndicators is false', () => {
    render(<Banner banners={mockBanners} showIndicators={false} autoplay={false} />);

    const indicators = document.querySelectorAll('.banner-indicator');
    expect(indicators.length).toBe(0);
  });

  it('calls onChange when navigating', () => {
    const handleChange = jest.fn();
    render(<Banner banners={mockBanners} onChange={handleChange} autoplay={false} />);

    const nextButton = document.querySelector('.banner-nav-next');
    fireEvent.click(nextButton!);

    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it('navigates to previous slide', () => {
    const handleChange = jest.fn();
    render(<Banner banners={mockBanners} value={2} onChange={handleChange} autoplay={false} />);

    const prevButton = document.querySelector('.banner-nav-prev');
    fireEvent.click(prevButton!);

    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it('navigates via indicator click', () => {
    const handleChange = jest.fn();
    render(<Banner banners={mockBanners} onChange={handleChange} autoplay={false} />);

    const indicators = document.querySelectorAll('.banner-indicator');
    fireEvent.click(indicators[2]);

    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it('autoplays by default', () => {
    const handleChange = jest.fn();
    render(<Banner banners={mockBanners} onChange={handleChange} interval={1000} />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(handleChange).toHaveBeenCalled();
  });

  it('does not autoplay when autoplay is false', () => {
    const handleChange = jest.fn();
    render(<Banner banners={mockBanners} onChange={handleChange} autoplay={false} interval={1000} />);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('handles keyboard navigation', () => {
    const handleChange = jest.fn();
    render(<Banner banners={mockBanners} onChange={handleChange} autoplay={false} />);

    const banner = document.querySelector('.banner');
    fireEvent.keyDown(banner!, { key: 'ArrowRight' });

    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it('applies 3D effect when 3 or more banners', () => {
    render(<Banner banners={mockBanners} autoplay={false} />);

    const banner = document.querySelector('.banner.banner-3d');
    expect(banner).toBeInTheDocument();
  });

  it('renders custom content via children render prop', () => {
    render(
      <Banner banners={mockBanners} autoplay={false}>
        {(banner) => <div data-testid="custom-content">{banner.title}</div>}
      </Banner>
    );

    const customContents = screen.getAllByTestId('custom-content');
    expect(customContents.length).toBe(3);
  });
});
