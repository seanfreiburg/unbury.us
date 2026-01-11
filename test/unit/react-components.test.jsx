/**
 * Unit tests for React components
 * Tests cover the presentational components
 */
import { describe, test, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import components
import { Button } from '../../src/components/common/Button';
import { Input } from '../../src/components/common/Input';
import { PaymentTypeSelector } from '../../src/components/loan-calculator/PaymentTypeSelector';

describe('Button component', () => {
  test('renders with children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  test('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies primary variant by default', () => {
    render(<Button>Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });

  test('applies secondary variant when specified', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-secondary');
  });

  test('applies success variant when specified', () => {
    render(<Button variant="success">Success</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-success');
  });

  test('applies danger variant when specified', () => {
    render(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-danger');
  });

  test('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('applies active class when active prop is true', () => {
    render(<Button active>Active</Button>);
    expect(screen.getByRole('button')).toHaveClass('active');
  });

  test('applies small size class', () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-sm');
  });

  test('applies large size class', () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-lg');
  });
});

describe('Input component', () => {
  test('renders with label', () => {
    render(<Input label="Name" name="test-name" />);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  test('renders input element', () => {
    render(<Input label="Test" name="test-input" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('passes value to input', () => {
    render(<Input label="Test" name="test" value="Hello" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('Hello');
  });

  test('calls onChange when value changes', () => {
    const handleChange = vi.fn();
    render(<Input label="Test" name="test" value="" onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New value' } });
    expect(handleChange).toHaveBeenCalled();
  });

  test('renders placeholder', () => {
    render(<Input label="Test" name="test" placeholder="Enter value" />);
    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
  });

  test('shows error styling when error prop is true', () => {
    render(<Input label="Test" name="test" error />);
    expect(screen.getByRole('textbox')).toHaveClass('input-error');
  });

  test('shows success styling when success prop is true', () => {
    render(<Input label="Test" name="test" success />);
    expect(screen.getByRole('textbox')).toHaveClass('input-success');
  });

  test('renders help text when provided', () => {
    render(<Input label="Test" name="test" helpText="This is help text" />);
    expect(screen.getByText('This is help text')).toBeInTheDocument();
  });

  test('generates id automatically if not provided', () => {
    render(<Input label="Auto ID" name="auto" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id');
  });

  test('uses provided id', () => {
    render(<Input label="Custom ID" name="custom" id="my-custom-id" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'my-custom-id');
  });
});

describe('PaymentTypeSelector component', () => {
  test('renders avalanche and snowball buttons', () => {
    render(
      <PaymentTypeSelector
        value="avalanche"
        onChange={() => {}}
      />
    );
    expect(screen.getByText('Avalanche')).toBeInTheDocument();
    expect(screen.getByText('Snowball')).toBeInTheDocument();
  });

  test('avalanche button is primary when selected', () => {
    render(
      <PaymentTypeSelector
        value="avalanche"
        onChange={() => {}}
      />
    );
    expect(screen.getByText('Avalanche')).toHaveClass('btn-primary');
    expect(screen.getByText('Snowball')).toHaveClass('btn-secondary');
  });

  test('snowball button is primary when selected', () => {
    render(
      <PaymentTypeSelector
        value="snowball"
        onChange={() => {}}
      />
    );
    expect(screen.getByText('Snowball')).toHaveClass('btn-primary');
    expect(screen.getByText('Avalanche')).toHaveClass('btn-secondary');
  });

  test('calls onChange with avalanche when avalanche is clicked', () => {
    const handleChange = vi.fn();
    render(
      <PaymentTypeSelector
        value="snowball"
        onChange={handleChange}
      />
    );
    fireEvent.click(screen.getByText('Avalanche'));
    expect(handleChange).toHaveBeenCalledWith('avalanche');
  });

  test('calls onChange with snowball when snowball is clicked', () => {
    const handleChange = vi.fn();
    render(
      <PaymentTypeSelector
        value="avalanche"
        onChange={handleChange}
      />
    );
    fireEvent.click(screen.getByText('Snowball'));
    expect(handleChange).toHaveBeenCalledWith('snowball');
  });

  test('sets aria-pressed attribute correctly for avalanche', () => {
    render(
      <PaymentTypeSelector
        value="avalanche"
        onChange={() => {}}
      />
    );
    expect(screen.getByText('Avalanche')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Snowball')).toHaveAttribute('aria-pressed', 'false');
  });

  test('sets aria-pressed attribute correctly for snowball', () => {
    render(
      <PaymentTypeSelector
        value="snowball"
        onChange={() => {}}
      />
    );
    expect(screen.getByText('Snowball')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Avalanche')).toHaveAttribute('aria-pressed', 'false');
  });

  test('has accessible group role and label', () => {
    render(
      <PaymentTypeSelector
        value="avalanche"
        onChange={() => {}}
      />
    );
    expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'Payment strategy');
  });
});
