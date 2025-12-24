import { render } from '@testing-library/react';
import LoadingBar from '@/components/LoadingBar';

// Mock the SCSS import
jest.mock('@/components/LoadingBar/index.scss', () => ({}));

describe('LoadingBar Component', () => {
  it('renders nothing when loading is false', () => {
    const { container } = render(<LoadingBar loading={false} />);
    expect(container.querySelector('.loading_bar')).not.toBeInTheDocument();
  });

  it('renders loading bar when loading is true', () => {
    const { container } = render(<LoadingBar loading={true} />);
    expect(container.querySelector('.loading_bar')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <LoadingBar loading={true} className="custom-loading" />
    );
    const loadingBar = container.querySelector('.loading_bar');
    expect(loadingBar).toHaveClass('loading_bar', 'custom-loading');
  });

  it('applies default position as absolute', () => {
    const { container } = render(<LoadingBar loading={true} />);
    const loadingBar = container.querySelector('.loading_bar');
    expect(loadingBar).toHaveStyle('--loading_position: absolute');
  });

  it('applies custom position', () => {
    const { container } = render(
      <LoadingBar loading={true} position="fixed" />
    );
    const loadingBar = container.querySelector('.loading_bar');
    expect(loadingBar).toHaveStyle('--loading_position: fixed');
  });

  it('applies default height of 6px', () => {
    const { container } = render(<LoadingBar loading={true} />);
    const loadingBar = container.querySelector('.loading_bar');
    expect(loadingBar).toHaveStyle('--loading_height: 6px');
  });

  it('applies custom height', () => {
    const { container } = render(<LoadingBar loading={true} height={10} />);
    const loadingBar = container.querySelector('.loading_bar');
    expect(loadingBar).toHaveStyle('--loading_height: 10px');
  });

  it('applies default width of 100%', () => {
    const { container } = render(<LoadingBar loading={true} />);
    const loadingBar = container.querySelector('.loading_bar');
    expect(loadingBar).toHaveStyle('--loading_width: 100%');
  });

  it('applies custom width', () => {
    const { container } = render(<LoadingBar loading={true} width="50%" />);
    const loadingBar = container.querySelector('.loading_bar');
    expect(loadingBar).toHaveStyle('--loading_width: 50%');
  });

  it('applies custom color when provided', () => {
    const { container } = render(<LoadingBar loading={true} color="#ff0000" />);
    const loadingBar = container.querySelector('.loading_bar');
    expect(loadingBar).toHaveStyle('--loading_color: #ff0000');
  });

  it('does not apply color when not provided', () => {
    const { container } = render(<LoadingBar loading={true} />);
    const loadingBar = container.querySelector('.loading_bar');
    // Check that the style attribute doesn't contain --loading_color
    const style = loadingBar?.getAttribute('style') || '';
    expect(style).not.toContain('--loading_color');
  });
});
