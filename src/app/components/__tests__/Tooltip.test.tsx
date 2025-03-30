import { render, screen } from '@testing-library/react';

import { Tooltip } from '../Tooltip';

describe('Tooltip', () => {
  it('renders children without tooltip when text is empty', () => {
    render(
      <Tooltip text="">
        <button>Hover me</button>
      </Tooltip>,
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('renders children with tooltip when text is provided', () => {
    render(
      <Tooltip text="Tooltip content">
        <button>Hover me</button>
      </Tooltip>,
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
    // Note: Radix UI tooltips are not immediately visible in the DOM
    // They become visible on hover, which would require userEvent testing
  });
});
