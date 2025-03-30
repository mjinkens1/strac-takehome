import { fireEvent, render, screen } from '@testing-library/react';

import { LoadMoreRow } from '../LoadMoreRow';

describe('LoadMoreRow', () => {
  const mockProps = {
    nextPageToken: 'next-token',
    loadingMore: false,
    onLoadMore: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders load more button when not loading', () => {
    render(<LoadMoreRow {...mockProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Load More');
    expect(button).toHaveClass('text-blue-600', 'hover:text-blue-800');
  });

  it('shows loading spinner when loadingMore is true', () => {
    render(<LoadMoreRow {...mockProps} loadingMore={true} />);

    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });

  it('calls onLoadMore with nextPageToken when clicked', () => {
    render(<LoadMoreRow {...mockProps} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockProps.onLoadMore).toHaveBeenCalledWith(mockProps.nextPageToken);
  });

  it('matches snapshot in both states', () => {
    const { container: normalContainer } = render(<LoadMoreRow {...mockProps} />);
    expect(normalContainer).toMatchSnapshot('normal');

    const { container: loadingContainer } = render(
      <LoadMoreRow {...mockProps} loadingMore={true} />,
    );
    expect(loadingContainer).toMatchSnapshot('loading');
  });
});
