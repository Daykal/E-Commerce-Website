import React, { useEffect, useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useCommentStore } from "../stores/useCommentStore.js";
import { useUserStore } from "../stores/useUserStore.js";
import ProductCard from "../components/ProductCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const GamePage = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [isWritingComment, setIsWritingComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const { gameName } = useParams();
  const { products, fetchAllProducts } = useProductStore();
  const { comments, createComment, updateComment, deleteComment, loading, getAllComments } =
    useCommentStore();
  const { user } = useUserStore();

  const handleSubmitComment = async (e) => {
    try {
      if (!newComment.trim()) return;
      await createComment(user._id, game._id, newComment);
      setNewComment("");
      setIsWritingComment(false);
    } catch {
      console.log("error creating a comment");
    }
  };

  const handleUpdateComment = async (id) => {
    try {
      await updateComment(id, editText);
      setEditingCommentId(null);
      setEditText("");
    } catch {
      console.log("error updating a comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId, user._id);
    } catch {
      console.log("error deleting a comment");
    }
  };

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
    return <LoadingSpinner />;
  }

  const commentsTextArray = comments.map((comment) => comment.text);

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
            <div className="border rounded-lg overflow-hidden mb-4 border-gray-700">
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
          <div className="flex gap-2"></div>
          <div className="w-1/3 bg-gray rounded-lg shadow">
            <ProductCard product={game} />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-12">
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex border-b border-gray-300">
              <button
                onClick={() => setActiveTab("about")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "about"
                    ? "border-b-2 border-emerald-400 text-[rgba(212,175,55,0.6)]"
                    : "text-gray-300 hover:text-[rgba(212,175,55,0.6)]"
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`px-4 py-2 font-medium ml-4 ${
                  activeTab === "comments"
                    ? "border-b-2 border-emerald-400 text-[rgba(212,175,55,0.6)]"
                    : "text-gray-300 hover:text-[rgba(212,175,55,0.6)]"
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
              {/* COMMENT SECTION IS HERE!!! */}
              {activeTab === "comments" && (
                <div>
                  {/* Header row */}
                  <div className="flex justify-between items-center w-full mb-4">
                    <h2 className="text-lg font-semibold">Comments</h2>
                    {user ? (
                      <button
                        onClick={() => setIsWritingComment(true)}
                        className="flex items-center gap-2 cursor-pointer text-emerald-400 hover:text-emerald-600 p-2"
                        title="Add a comment"
                      >
                        <MessageSquarePlus className="w-8 h-8" />
                        <span className="text-sm font-medium">
                          Add a comment
                        </span>
                      </button>
                    ) : (
                      <span>Please login to add comments</span>
                    )}
                  </div>

                  {isWritingComment && (
                    <div className="mb-4 bg-gray-300 p-4 rounded">
                      <textarea
                        maxLength={1000}
                        className=" text-black w-full p-2 rounded border border-gray-300 resize-none focus:outline-none focus:ring focus:border-blue-400"
                        rows={4}
                        placeholder="Write your comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <div className="text-right text-sm text-gray-500 mt-1">
                        {newComment.length}/1000
                      </div>
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          className="text-md px-3 py-1 rounded bg-red-500 hover:bg-red-800"
                          onClick={() => {
                            setIsWritingComment(false);
                            setNewComment("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="text-md px-3 py-1 rounded bg-emerald-500 text-white hover:bg-emerald-800"
                          onClick={() => {
                            handleSubmitComment();
                          }}
                          disabled={!newComment.trim()}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}

                  <ul className="space-y-2">
  {comments.map((comment) => (
    <li
      key={comment._id}
      className="flex flex-col bg-[rgba(28,28,30,0.9)] px-4 py-2 rounded"
    >
      {editingCommentId === comment._id ? (
        <>
          <textarea
            maxLength={1000}
            rows={3}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2 rounded border border-gray-600 bg-[#1c1c1e] text-white resize-none focus:outline-none focus:ring"
          />
          <div className="mt-2 flex justify-end space-x-2">
            <button
              className="text-md px-2 py-1 rounded bg-red-500 hover:bg-red-800"
              onClick={() => {
                setEditingCommentId(null);
                setEditText("");
              }}
            >
              Cancel
            </button>
            <button
              className="text-md px-4 py-1 rounded bg-emerald-500 text-white hover:bg-emerald-800"
              onClick={() => handleUpdateComment(comment._id)}
              disabled={!editText.trim()}
            >
              Save
            </button>
          </div>
        </>
      ) : (
        <div className="flex justify-between items-center">
          <span className="text-white">{comment.text}</span>

          {user && comment.userId === user._id && (
            <div className="flex space-x-2">
              <button
                className="text-sm px-3 py-1 rounded bg-emerald-500 text-white hover:bg-emerald-800"
                onClick={() => {
                  setEditingCommentId(comment._id);
                  setEditText(comment.text);
                }}
              >
                Edit
              </button>
              <button className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-800"
              onClick={() => handleDeleteComment(comment._id)}
              >
                Delete
              </button>
            </div>
          )}
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
      </div>
    </motion.div>
  );
};

export default GamePage;
