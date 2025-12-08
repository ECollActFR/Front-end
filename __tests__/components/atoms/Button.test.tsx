/**
 * Tests for Button component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '@/components/atoms/Button';

describe('Button', () => {
  it('should render with title', () => {
    const { getByText } = render(<Button title="Test Button" onPress={() => {}} />);
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const mockOnPress = vi.fn();
    const { getByText } = render(<Button title="Test Button" onPress={mockOnPress} />);
    
    fireEvent.press(getByText('Test Button'));
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should apply custom styles when provided', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} style={customStyle} />
    );
    
    const button = getByText('Test Button');
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customStyle)
      ])
    );
  });
});