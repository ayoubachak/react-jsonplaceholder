import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';

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

const fetchAlbumData = async (id: string, start: number, limit: number): Promise<AlbumData> => {
  const albumResponse = await axios.get(`https://jsonplaceholder.typicode.com/albums/${id}`);
  const photosResponse = await axios.get(`https://jsonplaceholder.typicode.com/photos?albumId=${id}&_start=${start}&_limit=${limit}`);
  return { album: albumResponse.data, photos: photosResponse.data };
};

const AlbumPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [photoStart, setPhotoStart] = useState(0);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const photoLimit = 20;

  const { data, isLoading, isError } = useQuery<AlbumData>({
    queryKey: ['album', id, photoStart],
    queryFn: () => fetchAlbumData(id!, photoStart, photoLimit),
    enabled: !!id,
    staleTime: 5000, // 5 seconds
  });

  useEffect(() => {
    if (data?.photos) {
      setPhotos((prevPhotos) => [...prevPhotos, ...data.photos]);
    }
  }, [data]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  if (isError || !data) {
    return <div className="flex items-center justify-center h-screen text-white">Error loading album data.</div>;
  }

  const { album } = data;

  const handleLoadMore = () => {
    setPhotoStart((prev) => prev + photoLimit);
  };

  return (
    <div className="container mx-auto p-4 text-white bg-gray-900 min-h-screen">
      {album ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold mb-6">{album.title}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {photos.map((photo: Photo) => (
              <motion.div key={photo.id} className="border p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" whileHover={{ scale: 1.05 }}>
                <img src={photo.thumbnailUrl} alt={photo.title} className="w-full rounded-lg" />
              </motion.div>
            ))}
          </div>
          <button
            onClick={handleLoadMore}
            className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-full hover:shadow-lg transition-shadow duration-300"
          >
            Load More Photos
          </button>
          <Link to={`/user/${album.userId}`} className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-full hover:shadow-lg transition-shadow duration-300 mt-6 ml-4">
            Back to User Profile
          </Link>
        </motion.div>
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </div>
  );
};

export default AlbumPage;
