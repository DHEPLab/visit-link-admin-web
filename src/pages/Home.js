import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios.get('/api/user').then((response) => {
      setUsers(response.data.content);
    });
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      {JSON.stringify(users)}
    </div>
  );
}

export default Home;
