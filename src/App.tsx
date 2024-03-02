import { useState } from 'react';
import ProductsList from './Components/ProductsList';
import userService, { User } from './services/userService';
import useUsers from './hooks/useUsers';

function App() {
  const categories = ['Entertainment', 'Utilities', 'Household'] as const;
  const [category, setCategory] = useState('');

  const { users, isLoading, error, setError, setUsers } = useUsers();

  const deleteUser = (user: User) => {
    const originalUsers = [...users];
    const res = userService.drop(user.id);
    setUsers(users.filter((u) => u.id !== user.id));
    res.catch((err) => {
      setError(err.message);
      setUsers(originalUsers);
    });
  };

  const addUser = () => {
    const originalUsers = [...users];
    const newUser = { id: 0, name: 'Mosh Hamedani' };
    setUsers([...users, newUser]);
    const response = userService.create(newUser);
    response.catch((err) => {
      setError(err.message);
      setUsers(originalUsers);
    });
  };

  const updateUser = (user: User) => {
    const originalUsers = [...users];
    const updatedUser = { ...user, name: user.name + '!' };
    setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
    const response = userService.modify(updatedUser);
    response.catch((err) => {
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
            <option key={category}> {category}</option>
          ))}
        </select>
      </div>
      <ProductsList category={category}></ProductsList>
    </>
  );
}

export default App;
