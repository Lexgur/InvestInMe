import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          navigate('/'); // or '/login' or whatever your landing page is
        }
      });
  }, [navigate]);

  return <p>Logging out...</p>;
}

export default LogoutPage;
