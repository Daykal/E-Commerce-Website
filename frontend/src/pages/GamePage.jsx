import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useCommentStore } from "../stores/useCommentStore.js";
import { useUserStore } from "../stores/useUserStore.js";
import ProductCard from "../components/ProductCard.jsx";
const GamePage = () => {
  const [activeTab, setActiveTab] = useState("about");

  const { gameName } = useParams();
  const { products, fetchAllProducts } = useProductStore();
  const { comments, loading, getAllComments } = useCommentStore();
  const { user } = useUserStore();  
  useEffect(() => {
    if (products.length === 0) {
      fetchAllProducts();
    }
  }, [products.length, fetchAllProducts]);
    
  const game = products.find(
    (g) => g.name.trim().toLowerCase().replace(/\s+/g, "-") === gameName
  );
  useEffect(() => {
    if (game) {
      getAllComments(game._id);
      
    }
  }, [getAllComments, game]);
  
  if (products.length === 0) {
return <div>Loading products...</div>;
}
  if (!game) {
    return <div></div>;
  }
  if (loading) {
    return <div>Loading...</div>;
  }


  
const commentsTextArray = comments.map(comment => comment.text);

  console.log(commentsTextArray);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <div className="flex max-w-6xl mx-auto p-6 gap-8">
          {/* Left side image gallery */}
          <div className="w-2/3">
            <div className="border rounded-lg overflow-hidden mb-4">
              <div className="w-full flex flex-col relative">
                <div className="relative h-120 overflow-hidden">
                  <img
                    className="object-cover w-full h-full"
                    src={game.image}
                    alt="Game Image"
                  />
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
          <div className="bg-gray-900 rounded-lg shadow p-6">
            <div className="flex border-b border-gray-300">
              <button
                onClick={() => setActiveTab("about")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "about"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-blue-500"
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`px-4 py-2 font-medium ml-4 ${
                  activeTab === "comments"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-blue-500"
                }`}
              >
                Comments
              </button>
            </div>

            <div className="mt-4">
              {activeTab === "about" && (
                <div>
                  <h3 className="text-xl font-bold mb-4">About This Game</h3>
                  <p>{game.description}</p>
                </div>
              )}
              {activeTab === "comments" && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Comments</h2>
                  <ul className="space-y-2">
                    {comments.map((comment) => (
                      <li
                        key={comment._id}
                        className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
                      >
                        <span className="text-gray-700">{comment.text}</span>

                        {user && comment.userId === user._id && (
                          <div className="flex space-x-2">
                            <button className="text-sm text-blue-600 hover:underline">
                              Edit
                            </button>
                            <button className="text-sm text-red-600 hover:underline">
                              Delete
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" id="default-tab" data-tabs-toggle="#default-tab-content" role="tablist">
        <li class="me-2" role="presentation">
            <button className="inline-block p-4 border-b-2 rounded-t-lg" id="profile-tab" data-tabs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Profile</button>
        </li>
        <li className="me-2" role="presentation">
            <button className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="dashboard-tab" data-tabs-target="#dashboard" type="button" role="tab" aria-controls="dashboard" aria-selected="false">Dashboard</button>
        </li>
        <li class="me-2" role="presentation">
            <button className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="settings-tab" data-tabs-target="#settings" type="button" role="tab" aria-controls="settings" aria-selected="false">Settings</button>
        </li>
        <li role="presentation">
            <button className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="contacts-tab" data-tabs-target="#contacts" type="button" role="tab" aria-controls="contacts" aria-selected="false">Contacts</button>
        </li>
    </ul>
</div>
<div id="default-tab-content">
    <div className="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="profile" role="tabpanel" aria-labelledby="profile-tab">
        <p className="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong class="font-medium text-gray-800 dark:text-white">Profile tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
    </div>
    <div className="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
        <p className="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong class="font-medium text-gray-800 dark:text-white">Dashboard tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
    </div>
    <div className="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="settings" role="tabpanel" aria-labelledby="settings-tab">
        <p className="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong class="font-medium text-gray-800 dark:text-white">Settings tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
    </div>
    <div className="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="contacts" role="tabpanel" aria-labelledby="contacts-tab">
        <p className="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong class="font-medium text-gray-800 dark:text-white">Contacts tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
    </div>
</div>
 */}
      </div>
    </motion.div>

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
