// src/components/AlbumPage.tsx
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

interface Photo {
  id: number;
  thumbnailUrl: string;
  title: string;
}

interface Album {
  title: string;
  userId: number;
}

const AlbumPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [album, setAlbum] = useState<Album | null>(null);

  useEffect(() => {
    const fetchAlbumData = async () => {
      const albumResponse = await axios.get(`https://jsonplaceholder.typicode.com/albums/${id}`);
      setAlbum(albumResponse.data);

      const photosResponse = await axios.get(`https://jsonplaceholder.typicode.com/photos?albumId=${id}`);
      setPhotos(photosResponse.data);
    };

    fetchAlbumData();
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      {album ? (
        <>
          <h1 className="text-2xl font-bold mb-4">{album.title}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="border p-2">
                <img src={photo.thumbnailUrl} alt={photo.title} className="w-full" />
              </div>
            ))}
          </div>
          <Link to={`/user/${album.userId}`} className="text-blue-500 hover:underline mt-4 block">Back to User Profile</Link>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AlbumPage;
