// src/components/UserProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

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

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const userResponse = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUser(userResponse.data);

      const albumsResponse = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}/albums`);
      setAlbums(albumsResponse.data);
    };

    fetchUser();
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      {user ? (
        <>
          <h1 className="text-2xl font-bold mb-4">{user.name}</h1>
          <p className="mb-2"><strong>Username:</strong> {user.username}</p>
          <p className="mb-4"><strong>Email:</strong> {user.email}</p>
          <h2 className="text-xl font-semibold mb-2">Albums</h2>
          <ul className="list-disc list-inside mb-4">
            {albums.map((album) => (
              <li key={album.id}>
                <Link to={`/album/${album.id}`} className="text-blue-500 hover:underline">{album.title}</Link>
              </li>
            ))}
          </ul>
          <Link to="/" className="text-blue-500 hover:underline">Back to User List</Link>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfilePage;
