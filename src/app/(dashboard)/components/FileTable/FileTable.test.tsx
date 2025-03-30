import { fireEvent, render, screen } from '@testing-library/react';

import { DriveFile } from '../../types';
import { FileTable } from './FileTable';

// Mock the child components
jest.mock('./components/FileRow', () => ({
  MemoizedFileRow: ({ file, onDelete }: { file: DriveFile; onDelete: (id: string) => void }) => (
    <tr data-testid={`file-row-${file.id}`}>
      <td>{file.name}</td>
      <td>
        <button onClick={() => onDelete(file.id)}>Delete</button>
      </td>
    </tr>
  ),
}));

jest.mock('./components/TableHeader', () => ({
  TableHeader: () => <thead data-testid="table-header" />,
}));

jest.mock('./components/LoadMoreRow', () => ({
  LoadMoreRow: ({
    onLoadMore,
    nextPageToken,
  }: {
    onLoadMore: (token: string) => void;
    nextPageToken: string;
  }) => (
    <tr>
      <td>
        <button data-testid="load-more" onClick={() => onLoadMore(nextPageToken)}>
          Load More
        </button>
      </td>
    </tr>
  ),
}));

describe('FileTable', () => {
  const mockFiles = [
    {
      id: '1',
      name: 'test1.pdf',
      modifiedTime: '2024-01-01T00:00:00Z',
      mimeType: 'application/pdf',
    },
    {
      id: '2',
      name: 'test2.pdf',
      modifiedTime: '2024-01-02T00:00:00Z',
      mimeType: 'application/pdf',
    },
  ];

  const mockProps = {
    files: mockFiles,
    onDelete: jest.fn(),
    loadingMore: false,
    onLoadMore: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table with header and file rows', () => {
    render(<FileTable {...mockProps} />);

    expect(screen.getByTestId('table-header')).toBeInTheDocument();
    expect(screen.getByTestId('file-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('file-row-2')).toBeInTheDocument();
  });

  it('sorts files by modified time in descending order', () => {
    render(<FileTable {...mockProps} />);

    const rows = screen.getAllByTestId(/file-row/);
    // Most recent file should be first
    expect(rows[0]).toHaveAttribute('data-testid', 'file-row-2');
    expect(rows[1]).toHaveAttribute('data-testid', 'file-row-1');
  });

  it('shows load more button when nextPageToken is provided', () => {
    render(<FileTable {...mockProps} nextPageToken="next-token" />);

    const loadMoreButton = screen.getByTestId('load-more');
    expect(loadMoreButton).toBeInTheDocument();

    fireEvent.click(loadMoreButton);
    expect(mockProps.onLoadMore).toHaveBeenCalledWith('next-token');
  });

  it('handles file deletion', () => {
    render(<FileTable {...mockProps} />);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockProps.onDelete).toHaveBeenCalledWith(mockFiles[1].id);
  });

  it('matches snapshot', () => {
    const { container } = render(<FileTable {...mockProps} />);
    expect(container).toMatchSnapshot();
  });
});
