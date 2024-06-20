import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import {  Todo } from '../types/Todo';
import { Album } from '../types/Album';

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
    nbtodos: todosData.filter((todo: Todo) => todo.userId === user.id).length,
    nbalbums: albumsData.filter((album: Album) => album.userId === user.id).length,
  }));
};

const UserListPage: React.FC = () => {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 text-white bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">User List</h1>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <table className="min-w-full bg-gray-800 border rounded-lg shadow-md">
          <thead className="bg-gray-700">
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
              <tr key={user.id} className="hover:bg-gray-700 transition-colors">
                <td className="py-2 px-4 border">
                  <Link to={`/user/${user.id}`} className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white py-1 px-3 rounded-full hover:shadow-lg transition-shadow duration-300">
                    {user.username}
                  </Link>
                </td>
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border">
                  <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer" className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white py-1 px-3 rounded-full hover:shadow-lg transition-shadow duration-300">
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
