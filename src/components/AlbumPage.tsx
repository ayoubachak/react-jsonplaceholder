import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

interface Photo {
  id: number;
  thumbnailUrl: string;
  title: string;
}

interface Album {
  title: string;
  userId: number;
}

interface AlbumData {
  album: Album;
  photos: Photo[];
}

const fetchAlbumData = async (id: string): Promise<AlbumData> => {
  const albumResponse = await axios.get(`https://jsonplaceholder.typicode.com/albums/${id}`);
  const photosResponse = await axios.get(`https://jsonplaceholder.typicode.com/photos?albumId=${id}`);
  return { album: albumResponse.data, photos: photosResponse.data };
};

const AlbumPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery<AlbumData>({
    queryKey: ['album', id],
    queryFn: () => fetchAlbumData(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading album data. Please try again later.</div>;
  }

  if (!data) {
    return null;
  }

  const { album, photos } = data;

  return (
    <div className="container mx-auto p-4">
      {album ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl font-bold mb-4">{album.title}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo: Photo) => (
              <motion.div key={photo.id} className="border p-2" whileHover={{ scale: 1.05 }}>
                <img src={photo.thumbnailUrl} alt={photo.title} className="w-full rounded-lg" />
              </motion.div>
            ))}
          </div>
          <Link to={`/user/${album.userId}`} className="text-blue-500 hover:underline mt-4 block">Back to User Profile</Link>
        </motion.div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AlbumPage;
