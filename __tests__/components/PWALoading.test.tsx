import { render, screen } from '@testing-library/react';
import PWALoading from '@/components/PWALoading';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Mock the SCSS import
jest.mock('@/components/PWALoading/index.scss', () => ({}));

// Create mock store
const createMockStore = (pwaLoading: boolean) =>
  configureStore({
    reducer: {
      system: () => ({ pwaLoading })
    }
  });

describe('PWALoading Component', () => {
  it('renders nothing when pwaLoading is false', () => {
    const store = createMockStore(false);
    const { container } = render(
      <Provider store={store}>
        <PWALoading />
      </Provider>
    );
    expect(container.querySelector('.pwa_loading')).not.toBeInTheDocument();
  });

  it('renders loading UI when pwaLoading is true', () => {
    const store = createMockStore(true);
    const { container } = render(
      <Provider store={store}>
        <PWALoading />
      </Provider>
    );
    expect(container.querySelector('.pwa_loading')).toBeInTheDocument();
  });

  it('displays default message', () => {
    const store = createMockStore(true);
    render(
      <Provider store={store}>
        <PWALoading />
      </Provider>
    );
    expect(screen.getByText('PWA安裝/更新中...')).toBeInTheDocument();
  });

  it('displays custom message', () => {
    const store = createMockStore(true);
    render(
      <Provider store={store}>
        <PWALoading message="Installing..." />
      </Provider>
    );
    expect(screen.getByText('Installing...')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const store = createMockStore(true);
    const { container } = render(
      <Provider store={store}>
        <PWALoading className="custom-pwa" />
      </Provider>
    );
    expect(
      container.querySelector('.pwa_loading.custom-pwa')
    ).toBeInTheDocument();
  });

  it('renders spinner SVG', () => {
    const store = createMockStore(true);
    const { container } = render(
      <Provider store={store}>
        <PWALoading />
      </Provider>
    );
    expect(container.querySelector('.pwa_loading-spinner')).toBeInTheDocument();
    expect(container.querySelector('circle.path')).toBeInTheDocument();
  });
});
