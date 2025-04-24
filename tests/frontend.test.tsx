/**
 * Frontend test suite for the DevOps Portfolio application
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../client/src/lib/queryClient';
import Contact from '../client/src/pages/Contact';
import { Toaster } from '../client/src/components/ui/toaster';
import { MemoryRouter } from 'react-router-dom';

// Mock the apiRequest function from queryClient
jest.mock('../client/src/lib/queryClient', () => {
  const originalModule = jest.requireActual('../client/src/lib/queryClient');
  return {
    ...originalModule,
    apiRequest: jest.fn().mockImplementation(() => Promise.resolve({ ok: true })),
    queryClient: {
      ...originalModule.queryClient
    }
  };
});

describe('Contact Page', () => {
  const renderContactPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <MemoryRouter>
          <Contact />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  test('renders contact form', () => {
    renderContactPage();
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByText(/send message/i)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    renderContactPage();
    
    // Try to submit empty form
    fireEvent.click(screen.getByText(/send message/i));
    
    // Check if fields are marked as required
    expect(screen.getByLabelText(/name/i)).toBeRequired();
    expect(screen.getByLabelText(/email/i)).toBeRequired();
    expect(screen.getByLabelText(/subject/i)).toBeRequired();
    expect(screen.getByLabelText(/message/i)).toBeRequired();
  });

  test('submits form successfully', async () => {
    const { apiRequest } = require('../client/src/lib/queryClient');
    renderContactPage();
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'This is a test message' } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/send message/i));
    
    // Check if apiRequest was called with correct parameters
    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith('POST', '/api/contact', {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a test message'
      });
    });
  });
});

// Add more tests for other components
