import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import ProductCard from "../components/ProductCard.jsx";

const GamePage = () => {
  const { gameName } = useParams();
  const { products, fetchAllProducts } = useProductStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchAllProducts();
    }
    console.log(products);
  }, [products.length, fetchAllProducts]);

  const game = products.find(
    (g) => g.name.trim().toLowerCase().replace(/\s+/g, "-") === gameName
  );
  if (!game) {
    return <div></div>;
  }
  return (
    <div>
    <div className="flex max-w-6xl mx-auto p-6 gap-8">
      {/* Left side image gallery */}
      <div className="w-2/3">
        <div className="border rounded-lg overflow-hidden mb-4">
            <div className="w-full flex flex-col relative">

            <div className="relative h-120 overflow-hidden">

             <img className="object-cover w-full h-full" src={game.image} alt="Game Image" />
            </div>
            </div>
        </div>
      </div>
      <div className="flex gap-2">{/* Placeholder for game images */}</div>
      {/* Right side game component */}
      <div className="w-1/3 bg-gray rounded-lg shadow">
        <ProductCard product={game} />
      </div>



    </div>
<div className="max-w-6xl mx-auto px-6 pb-12">
    <div className="bg-gray-900 rounded-lg shadow p-6 ">
   <h3 className="text-xl font-bold mb-4">
    About This Game
   </h3>
   <p className="text-gray-700 leading-relaxed">
    {game.description}
   </p>
    </div>
</div>
</div>


    // </div>
    // <div className='relative overflow-hidden h-96 w-full rounded-lg group'>
    // 		<Link to={"/AllGames" + category.href}>
    // 			<div className='w-full h-full cursor-pointer'>
    // 				<div className='absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10' />
    // 				<img
    // 					src={category.imageUrl}
    // 					alt={category.name}
    // 					className='w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110'
    // 					loading='lazy'
    // 				/>
    // 				<div className='absolute bottom-0 left-0 right-0 p-4 z-20'>
    // 					<h3 className='text-white text-2xl font-bold mb-2'>{category.name}</h3>
    // 					<p className='text-gray-200 text-sm'>Explore {category.name}</p>
    // 				</div>
    // 			</div>
    // 		</Link>
    // 	</div>
  );
};

export default GamePage;
