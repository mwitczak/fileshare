import React from 'react';
import { render } from '@testing-library/react';
import { LoginBox } from './LoginBox';
import { UserContext } from '../contexts/UserContext';
import { BrowserRouter } from 'react-router-dom';

test('Shows login link when there is no user in context', () => {
  const { getByText } = render(<LoginBox/>);
  const linkElement = getByText(/login/i);
  expect(linkElement).toBeInTheDocument();
});

test('Shows username when there is user in context', () => {
  const { Provider } = UserContext;

  const { getByText } = render(
    <BrowserRouter>
      <Provider value={{user: {name: 'Firstname Lastname'}}}>
        <LoginBox/>
      </Provider>
    </BrowserRouter>);

  const logoutText = getByText(/logout/i);
  expect(logoutText).toBeInTheDocument();

  const nameText = getByText(/Firstname Lastname/i);
  expect(nameText).toBeInTheDocument();
});
