import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MainProvider, useMainContext } from '../mainContext';
import React from 'react';

const Consumer = () => {
  const { authLoaded, user } = useMainContext();
  return (
    <div>
      <span data-testid="authLoaded">{String(authLoaded)}</span>
      <span data-testid="user">{user ? user.name : 'null'}</span>
    </div>
  );
};

describe('MainProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('restores auth from localStorage and sets authLoaded', async () => {
    const fakeUser = { name: 'Test User', email: 't@example.com' };
    localStorage.setItem('user', JSON.stringify(fakeUser));
    localStorage.setItem('isAuthorized', 'true');
    localStorage.setItem('tokenType', 'user');

    render(
      <MainProvider>
        <Consumer />
      </MainProvider>
    );

    // authLoaded is set synchronously in the effect finally block, but the effect runs after mount.
    // Wait for the UI to update by querying the element text content.
    const authEl = await screen.findByTestId('authLoaded');
    const userEl = await screen.findByTestId('user');

    expect(authEl.textContent).toBe('true');
    expect(userEl.textContent).toBe('Test User');
  });
});
