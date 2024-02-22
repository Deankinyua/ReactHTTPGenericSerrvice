import { useEffect, useRef, useState } from 'react';
import ProductsList from './Components/ProductsList';
import apiClient, { CanceledError, AxiosError } from './services/api-client';

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
        const res = await apiClient.get<User[]>('/users', {
          signal: controller.signal,
        });
        setUsers(res.data);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof CanceledError) return;
        setError((err as AxiosError).message);
        setIsLoading(false);
      }

      return () => controller.abort();
    })();
  }, []);

  const deleteUser = (user: User) => {
    const originalUsers = [...users];
    setUsers(users.filter((u) => u.id !== user.id));
    apiClient.delete(`/users/${user}`).catch((err) => {
      setError(err.message);
      setUsers(originalUsers);
    });
  };

  const addUser = () => {
    const originalUsers = [...users];
    const newUser = { id: 0, name: 'Mosh' };
    setUsers([...users, newUser]);
    apiClient
      .post(`/users`, newUser)
      .then((res) => setUsers([res.data, ...users]))
      .catch((err) => {
        setError(err.message);
        setUsers(originalUsers);
      });
  };

  const updateUser = (user: User) => {
    const originalUsers = [...users];
    const updatedUser = { ...user, name: user.name + '!' };
    setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));

    apiClient.patch(`/users/${user.id}`, updatedUser).catch((err) => {
      setError(err.message);
      setUsers(originalUsers);
    });
  };

  return (
    <>
      {error && <p className="text-danger">{error}</p>}
      {isLoading && <div className="spinner-border"></div>}
      <button className="btn btn-primary mb-3" onClick={addUser}>
        Add User
      </button>
      <ul className="list-group">
        {users.map((user) => (
          <li
            key={user.id}
            className="list-group-item d-flex justify-content-between"
          >
            {user.name}{' '}
            <div>
              <button
                onClick={() => updateUser(user)}
                className="btn btn-outline-secondary mx-1"
              >
                Update
              </button>
              <button
                onClick={() => deleteUser(user)}
                className="btn btn-outline-danger"
              >
                Delete
              </button>
            </div>
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
