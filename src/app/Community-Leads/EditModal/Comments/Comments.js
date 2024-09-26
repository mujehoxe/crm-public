import { PlusIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SkeletonLoader from "../../Components/SkeletonLoader";
import CommentCard from "./CommentCard";

const Comments = ({ modalStates, leadData }) => {
  const [comments, setComments] = React.useState([]);
  const [newComment, setNewComment] = useState("");

  const [loading, setLoading] = React.useState(true);
  const [adding, setAdding] = React.useState(false);
  const [sending, setSending] = React.useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      if (!leadData || !leadData._id) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/comment/get/${leadData._id}`);
        const data = await res.json();

        if (data && Array.isArray(data.data)) setComments(data.data);
        else console.error("No valid data returned");
      } catch (error) {
        console.error("Error fetching comments:", error);
      }

      setLoading(false);
    };

    !adding && fetchComments();
  }, [adding]);

  const handleDeleteComment = async (commentId) => {
    setLoading(true);
    try {
      await fetch(`/api/comment/delete/${commentId}`, { method: "DELETE" });
      setComments(comments.filter((m) => m._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
    setLoading(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    try {
      const res = await axios.post("/api/comment/add", {
        leadData,
        content: newComment,
      });
      toast.success("Comment Added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.error || error.message;
        toast.error(`Failed to add comment: ${errorMessage}`);
      } else {
        toast.error("An unexpected error occurred while adding the comment.");
      }
    }
    setSending(false);
    setAdding(false);
  };

  return (
    <>
      <section className="border rounded-lg p-4 h-[28rem] overflow-y-auto">
        <div className="w-full flex flex-col gap-4">
          {loading ? (
            <SkeletonLoader />
          ) : (
            <div className="scroll-smooth snap-y snap-mandatory">
              <ul
                id="comments-container"
                className="flex flex-col space-y-2 list-none pl-[0.1px]"
                style={{ overflowAnchor: "none" }}
              >
                {!comments.length ? (
                  <li className="text-center text-gray-500">
                    No comments found.
                  </li>
                ) : (
                  <div>
                    {comments.map((comment, index) => (
                      <li
                        key={index}
                        className="h-36"
                        style={{ overflowAnchor: "auto" }}
                      >
                        <CommentCard
                          comments={comments}
                          index={index}
                          onDelete={() => handleDeleteComment(comment._id)}
                          isLoading={loading}
                        />
                      </li>
                    ))}
                  </div>
                )}
                {adding && (
                  <li>
                    <form
                      onSubmit={onSubmit}
                      className="flex flex-col space-y-2 mt-4"
                    >
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="border border-gray-300 p-2 rounded"
                        placeholder="Write a comment..."
                        rows="4"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setAdding(false);
                            setNewComment("");
                          }}
                          className="px-5 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 bg-miles-500 text-white rounded hover:bg-miles-600"
                          disabled={loading}
                        >
                          {sending ? "Sending..." : "Send"}
                        </button>
                      </div>
                    </form>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </section>
      {!adding && !loading && (
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setAdding(true)}
            className="flex items-center bg-miles-500 hover:bg-miles-600 text-white px-6 rounded"
          >
            <PlusIcon className="size-4" /> Add Comment
          </button>
        </div>
      )}
    </>
  );
};

export default Comments;
