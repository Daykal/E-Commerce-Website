import React from 'react'
import { useEffect, useState } from 'react';
import { useUserStore } from '../stores/useUserStore.js';
import LibraryCard from '../components/LibraryCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const LibraryPage = () => {
const { user } = useUserStore();
const libraryItems = user.libraryItems;
// const libraryItems = null;

if (!user) {
  return <LoadingSpinner />;
}
if (!libraryItems) {
  window.location.reload();
  return <LoadingSpinner />;
}
  
  return (
    <div>
      {libraryItems.map((item, index) => (
        <LibraryCard key={index} item={item} />
      ))}
    </div>
  );
}

export default LibraryPage
