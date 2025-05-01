import { useEffect } from 'react';
import { useAuth } from './useAuth';

function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return <p></p>;
}

export default LogoutPage;
