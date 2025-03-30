import { render, screen } from '@testing-library/react';

import { TopProgressBar } from '../TopProgress';

describe('TopProgressBar', () => {
  it('should render with loading state', () => {
    render(<TopProgressBar loading={true} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('opacity-100');
  });

  it('should render without loading state', () => {
    render(<TopProgressBar loading={false} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('opacity-0');
  });

  it('should apply custom className', () => {
    const customClass = 'custom-class';
    render(<TopProgressBar loading={false} className={customClass} />);
    const container = screen.getByTestId('progress-container');
    expect(container).toHaveClass(customClass);
  });
});
