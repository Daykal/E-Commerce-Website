import React from 'react'
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useProductStore } from '../stores/useProductStore';
import LoadingSpinner from './LoadingSpinner';

const LibraryCard = ({item}) => {

  const { products, fetchAllProducts } = useProductStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchAllProducts();
    }
  }, [products.length, fetchAllProducts]);


  const game = products.find((g) => g._id === item);
  if (!game) {
    return LoadingSpinner;
  }

  return (
    	<motion.div
			
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
    <div className="w-4/5 h-24 bg-[rgba(28,28,30,0.9)] rounded-2xl shadow-md flex items-center justify-between px-4 my-2 mx-auto">
      {/* Left: Image */}
      <img
        src={game.image}
        alt={game.name}
        className="h-20 w-20 rounded object-cover"
      />

      <h1 className="text-4xl font-bold ml-8 flex-1 text-[rgba(212,175,55,0.6)]">
        {game.name}
      </h1>

      {/* Right: Button */}
      <a
        href={game.downloadLink}
        target="_blank"
        >
        <button className='cursor-pointer bg-[rgba(212,175,55,0.6)] hover:bg-[rgba(212,175,55,0.8)] px-4 py-2 rounded-md  transition text-lg text-gray-300 hover:text-emerald-400'>
          Download
          </button>
      </a>

    </div>
    </motion.div>
  );
}

export default LibraryCard