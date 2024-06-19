import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface Album {
  id: number;
  title: string;
}

interface UserData {
  user: User;
  albums: Album[];
}

const fetchUserData = async (id: string): Promise<UserData> => {
  const userResponse = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
  const albumsResponse = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}/albums`);
  return { user: userResponse.data, albums: albumsResponse.data };
};

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery<UserData>({
    queryKey: ['user', id],
    queryFn: () => fetchUserData(id!),
    enabled: !!id
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading user data. Please try again later.</div>;
  }

  if (!data) {
    return null;
  }

  const { user, albums } = data;

  return (
    <div className="container mx-auto p-4">
      {user ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl font-bold mb-4">{user.name}</h1>
          <p className="mb-2"><strong>Username:</strong> {user.username}</p>
          <p className="mb-4"><strong>Email:</strong> {user.email}</p>
          <h2 className="text-xl font-semibold mb-2">Albums</h2>
          <ul className="list-disc list-inside mb-4">
            {albums.map((album: Album) => (
              <li key={album.id}>
                <Link to={`/album/${album.id}`} className="text-blue-500 hover:underline">{album.title}</Link>
              </li>
            ))}
          </ul>
          <Link to="/" className="text-blue-500 hover:underline">Back to User List</Link>
        </motion.div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfilePage;
