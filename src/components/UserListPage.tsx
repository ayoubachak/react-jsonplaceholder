// src/components/UserListPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  website: string;
  company: { name: string };
  nbtodos: number;
  nbalbums: number;
}

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersResponse = await axios.get('https://jsonplaceholder.typicode.com/users');
      const todosResponse = await axios.get('https://jsonplaceholder.typicode.com/todos');
      const albumsResponse = await axios.get('https://jsonplaceholder.typicode.com/albums');

      const usersData = usersResponse.data;
      const todosData = todosResponse.data;
      const albumsData = albumsResponse.data;

      const enrichedUsers = usersData.map((user: User) => ({
        ...user,
        nbtodos: todosData.filter((todo: any) => todo.userId === user.id).length,
        nbalbums: albumsData.filter((album: any) => album.userId === user.id).length,
      }));

      setUsers(enrichedUsers);
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Username</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Website</th>
            <th className="py-2 px-4 border">Company</th>
            <th className="py-2 px-4 border">Number of Todos</th>
            <th className="py-2 px-4 border">Number of Albums</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border">
                <Link to={`/user/${user.id}`} className="text-blue-500 hover:underline">{user.username}</Link>
              </td>
              <td className="py-2 px-4 border">{user.email}</td>
              <td className="py-2 px-4 border">
                <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {user.website}
                </a>
              </td>
              <td className="py-2 px-4 border">{user.company.name}</td>
              <td className="py-2 px-4 border">{user.nbtodos}</td>
              <td className="py-2 px-4 border">{user.nbalbums}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserListPage;
