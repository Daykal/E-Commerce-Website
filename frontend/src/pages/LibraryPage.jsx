import React from 'react'
import { useUserStore } from '../stores/useUserStore.js';
import LibraryCard from '../components/LibraryCard.jsx';

const LibraryPage = () => {
    const { user } = useUserStore();
    const libraryItems = user.libraryItems;
    // console.log(libraryItems);

  return (
    <div>
      {libraryItems.map((item, index) => (
        <LibraryCard key={index} item={item} />
      ))}
    </div>
  );
}

export default LibraryPage
