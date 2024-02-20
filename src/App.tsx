import { useEffect, useRef, useState } from 'react';
import ProductsList from './Components/ProductsList';
import axios, { AxiosError } from 'axios';

interface User {
  id: number;
  name: string;
}

function App() {
  const categories = ['Entertainment', 'Utilities', 'Household'] as const;
  const [users, setUsers] = useState<User[]>([]);
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // * Side Effect
    const controller = new AbortController();
    setIsLoading(true);
    (async function () {
      try {
        const res = await axios.get<User[]>(
          'https://jsonplaceholder.typicode.com/users',
          { signal: controller.signal }
        );
        setUsers(res.data);
        setIsLoading(false);
      } catch (err) {
        setError((err as AxiosError).message);
        setIsLoading(false);
      }
      return () => controller.abort();
    })();
  }, []);

  return (
    <>
      {error && <p className="text-danger">{error}</p>}
      {isLoading && <div className="spinner-border"></div>}
      <ul className="list-group">
        {users.map((user) => (
          <li key={user.id} className="list-group-item">
            {user.name}{' '}
            <button className="btn btn-outline-danger">Delete</button>
          </li>
        ))}
      </ul>{' '}
      <div className="mb-3">
        <select
          className="form-select"
          onChange={(event) => {
            setCategory(event.target.value);
          }}
        >
          <option value=""></option>
          {categories.map((category) => (
            <option key="category"> {category}</option>
          ))}
        </select>
      </div>
      <ProductsList category={category}></ProductsList>
    </>
  );
}

export default App;
