import React from 'react';
import { render, screen } from '@testing-library/react';
import Landingpage from '../../src/components/users/Landingpage';

describe('Landingpage', () => {
  it('should render the component with correct content', () => {
    render(<Landingpage />);
    
    // Add assertions based on component behavior
    expect(screen.getByText("Welcome to the really amazing CSC 351 Social Media App")).toBeTruthy();
    expect(screen.getByText("Social media as you've never seen it before.")).toBeTruthy();
    expect(screen.getByText("Sign Up")).toBeTruthy();
    expect(screen.getByText("Login")).toBeTruthy();
    // Add more assertions for other elements as needed
  });

  // Add more test cases
});
