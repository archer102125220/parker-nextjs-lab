import { render, screen, waitFor } from '@testing-library/react';
import QRCodeComponent from '@/components/QRCode';

// Mock the qrcode library
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mockQRCode')
}));

describe('QRCode Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders QR code image when qrCodeValue is provided', async () => {
    render(<QRCodeComponent qrCodeValue="https://example.com" />);

    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
    });
  });

  it('uses qrCodeValue as alt text when alt prop is not provided', async () => {
    render(<QRCodeComponent qrCodeValue="test-value" />);

    await waitFor(() => {
      const img = screen.getByAltText('test-value');
      expect(img).toBeInTheDocument();
    });
  });

  it('uses custom alt text when provided', async () => {
    render(<QRCodeComponent qrCodeValue="test-value" alt="Custom Alt Text" />);

    await waitFor(() => {
      const img = screen.getByAltText('Custom Alt Text');
      expect(img).toBeInTheDocument();
    });
  });

  it('applies custom width and height', async () => {
    render(<QRCodeComponent qrCodeValue="test" width={300} height={300} />);

    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('width', '300');
      expect(img).toHaveAttribute('height', '300');
    });
  });

  it('applies default width and height when not provided', async () => {
    render(<QRCodeComponent qrCodeValue="test" />);

    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('width', '200');
      expect(img).toHaveAttribute('height', '200');
    });
  });

  it('applies custom className', async () => {
    render(<QRCodeComponent qrCodeValue="test" className="custom-class" />);

    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toHaveClass('qr-code', 'custom-class');
    });
  });

  it('calls onSuccess callback with qrCodeValue and dataUrl', async () => {
    const onSuccess = jest.fn();
    render(<QRCodeComponent qrCodeValue="test-value" onSuccess={onSuccess} />);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({
        qrCodeValue: 'test-value',
        dataUrl: 'data:image/png;base64,mockQRCode'
      });
    });
  });

  it('calls onLoading callback with loading state', async () => {
    const onLoading = jest.fn();
    render(<QRCodeComponent qrCodeValue="test" onLoading={onLoading} />);

    await waitFor(() => {
      expect(onLoading).toHaveBeenCalledWith(true);
      expect(onLoading).toHaveBeenCalledWith(false);
    });
  });

  it('calls onBeforeCreate callback before generating QR code', async () => {
    const onBeforeCreate = jest.fn();
    render(
      <QRCodeComponent qrCodeValue="test" onBeforeCreate={onBeforeCreate} />
    );

    await waitFor(() => {
      expect(onBeforeCreate).toHaveBeenCalled();
    });
  });

  it('does not render when qrCodeValue is empty', () => {
    const { container } = render(<QRCodeComponent qrCodeValue="" />);
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });
});
