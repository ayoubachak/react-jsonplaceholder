import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

interface User {
  id: number;
  username: string;
  email: string;
  website: string;
  company: { name: string };
  nbtodos: number;
  nbalbums: number;
}

const fetchUsers = async (): Promise<User[]> => {
  const usersResponse = await axios.get('https://jsonplaceholder.typicode.com/users');
  const todosResponse = await axios.get('https://jsonplaceholder.typicode.com/todos');
  const albumsResponse = await axios.get('https://jsonplaceholder.typicode.com/albums');

  const usersData = usersResponse.data;
  const todosData = todosResponse.data;
  const albumsData = albumsResponse.data;

  return usersData.map((user: User) => ({
    ...user,
    nbtodos: todosData.filter((todo: any) => todo.userId === user.id).length,
    nbalbums: albumsData.filter((album: any) => album.userId === user.id).length,
  }));
};

const UserListPage: React.FC = () => {
  const { data: users, isLoading, isError } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading users. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-gray-100">
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
            {users?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100 transition-colors">
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
      </motion.div>
    </div>
  );
};

export default UserListPage;
