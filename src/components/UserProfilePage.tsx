import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface Album {
  id: number;
  title: string;
  photos: Photo[];
}

interface Photo {
  id: number;
  thumbnailUrl: string;
}

interface UserData {
  user: User;
  albums: Album[];
}

const fetchUserData = async (id: string): Promise<UserData> => {
  const userResponse = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
  const albumsResponse = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}/albums`);
  const albumsWithPhotos = await Promise.all(albumsResponse.data.map(async (album: Album) => {
    const photosResponse = await axios.get(`https://jsonplaceholder.typicode.com/photos?albumId=${album.id}`);
    return { ...album, photos: photosResponse.data };
  }));
  return { user: userResponse.data, albums: albumsWithPhotos };
};

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'info' | 'albums'>('info');

  const { data, isLoading } = useQuery<UserData>({
    queryKey: ['user', id],
    queryFn: () => fetchUserData(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  if (!data) {
    return null;
  }

  const { user, albums } = data;

  return (
    <div className="container mx-auto p-4 text-white bg-gray-900 min-h-screen">
      {user ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold mb-4">{user.name}</h1>
          <div className="mb-4">
            <button
              className={`mr-4 ${activeTab === 'info' ? 'bg-blue-500' : 'bg-gray-700'} text-white py-2 px-4 rounded-full`}
              onClick={() => setActiveTab('info')}
            >
              User Info
            </button>
            <button
              className={`${activeTab === 'albums' ? 'bg-blue-500' : 'bg-gray-700'} text-white py-2 px-4 rounded-full`}
              onClick={() => setActiveTab('albums')}
            >
              Albums
            </button>
          </div>
          {activeTab === 'info' ? (
            <div>
              <p className="mb-2"><strong>Username:</strong> {user.username}</p>
              <p className="mb-4"><strong>Email:</strong> {user.email}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {albums.map((album: Album) => (
                <div key={album.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                  <Link to={`/album/${album.id}`} className="block">
                    <img
                      src={album.photos[0]?.thumbnailUrl}
                      alt={album.title}
                      className="w-full h-40 object-cover rounded-lg mb-2"
                    />
                    <h2 className="text-xl font-semibold">{album.title}</h2>
                  </Link>
                </div>
              ))}
            </div>
          )}
          <Link to="/" className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-full hover:shadow-lg transition-shadow duration-300 mt-4">
            Back to User List
          </Link>
        </motion.div>
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </div>
  );
};

export default UserProfilePage;
