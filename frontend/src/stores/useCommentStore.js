import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useCommentStore = create((set) => ({
	comments: [],
	loading: false,
	error: null,

	setComments: (comments) => set({ comments }),
	createComment: async (userId, gameId, text) => {
		set({ loading: true });
		try {
			const res = await axios.post("/comments", { userId, gameId, text });
			set((prevState) => ({
				commnets: [...prevState.comments, res.data],
				loading: false,
			}));
		} catch (error) {
			toast.error(error.response.data.error);
			set({ loading: false });
		}
	},
	getAllComments: async (gameId) => {
		set({ loading: true, error: null });
		try {
			const response = await axios.get("/comments", { params: {gameId} });
            console.log(response.data);
			set({ comments: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch comments", loading: false });
			toast.error(error.response.data.error || "Failed to fetch comments");
		}
	},
    updateComment: async (commentId, text) => {
      set({ loading: true });
      try {
          await axios.patch("/comments", { commentId, text });
          set((prevState) => ({
              comments: prevState.comments.map((comment) =>
                  comment._id === commentId ? { ...comment, text } : comment
              ),
              loading: false,
          }))
      }  catch (error) {
        set({ loading: false });
        toast.error(error.response.data.error || "Failed to update comment");
      }
    },
	deleteComment: async (commentId) => {
		set({ loading: true });
		try {
			await axios.delete("/comments}", {commentId});
			set((prevState) => ({
				comments: prevState.comments.filter((comment) => comment._id !== commentId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete comment");
		}
	},

}));