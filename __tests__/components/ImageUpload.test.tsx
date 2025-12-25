import { render, screen, fireEvent } from '@testing-library/react';
import ImageUpload from '@/components/ImageUpload';

// Mock the SCSS file
jest.mock('@/components/ImageUpload/index.scss', () => ({}));

// Mock FileReader
const mockFileReaderResult = 'data:image/png;base64,mockImageData';
class MockFileReader {
  onload: ((e: ProgressEvent<FileReader>) => void) | null = null;
  result: string | null = mockFileReaderResult;
  
  readAsDataURL() {
    setTimeout(() => {
      if (this.onload) {
        this.onload({ target: { result: this.result } } as ProgressEvent<FileReader>);
      }
    }, 0);
  }
}

// @ts-expect-error - mocking FileReader
global.FileReader = MockFileReader;

describe('ImageUpload Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<ImageUpload />);

    // Should render the upload button
    expect(screen.getByText('上傳圖片')).toBeInTheDocument();
    expect(screen.getByText('點擊或拖拉圖片到此區塊上傳')).toBeInTheDocument();
  });

  it('renders with custom button label', () => {
    render(<ImageUpload btnLabel="Upload Image" />);

    expect(screen.getByText('Upload Image')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<ImageUpload label="Drag and drop image here" />);

    expect(screen.getByText('Drag and drop image here')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ImageUpload className="custom-uploader" />);

    const wrapper = document.querySelector('.image_upload_wrapper.custom-uploader');
    expect(wrapper).toBeInTheDocument();
  });

  it('has hidden file input', () => {
    render(<ImageUpload />);

    const input = document.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('image_upload_input_hidden');
  });

  it('accepts only images by default', () => {
    render(<ImageUpload />);

    const input = document.querySelector('input[type="file"]');
    expect(input).toHaveAttribute('accept', 'image/*');
  });

  it('accepts custom file types', () => {
    render(<ImageUpload accept=".png,.jpg" />);

    const input = document.querySelector('input[type="file"]');
    expect(input).toHaveAttribute('accept', '.png,.jpg');
  });

  it('handles disabled state', () => {
    render(<ImageUpload disabled />);

    const input = document.querySelector('input[type="file"]');
    expect(input).toBeDisabled();

    const button = screen.getByText('上傳圖片');
    expect(button).toBeDisabled();
  });

  it('renders mask label for drag and drop', () => {
    render(<ImageUpload />);

    expect(screen.getByText('拖拉圖片到此區塊上傳')).toBeInTheDocument();
  });

  it('renders with custom mask label', () => {
    render(<ImageUpload maskLabel="Drop files here" />);

    expect(screen.getByText('Drop files here')).toBeInTheDocument();
  });

  it('calls onChange when file is selected', () => {
    const handleChange = jest.fn();
    render(<ImageUpload onChange={handleChange} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(handleChange).toHaveBeenCalledWith(file);
  });

  it('calls onError when non-image file is selected', () => {
    const handleError = jest.fn();
    render(<ImageUpload onError={handleError} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(handleError).toHaveBeenCalledWith('請選擇圖片檔案');
  });

  it('calls onError when file exceeds maxSize', () => {
    const handleError = jest.fn();
    render(<ImageUpload onError={handleError} maxSize={1024} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const largeFile = new File(['x'.repeat(2048)], 'large.png', { type: 'image/png' });
    Object.defineProperty(largeFile, 'size', { value: 2048 });

    fireEvent.change(input, { target: { files: [largeFile] } });

    expect(handleError).toHaveBeenCalled();
  });
});
