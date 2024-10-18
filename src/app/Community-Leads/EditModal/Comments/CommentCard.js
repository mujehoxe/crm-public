import { TrashIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

function CommentCard({ comments, index, onDelete, isLoading }) {
  useEffect(() => {
    const scroller = document.getElementById(`comments-container`);
    if (scroller) scroller.scrollTo(0, 1);
  }, [comments]);

  return (
    <div className="flex text-sm p-4 text-gray-500">
      <div className="flex-none py-4 mr-2">
        <img
          alt={comments[index].UserId.username}
          src={`${process.env.NEXT_PUBLIC_BASE_URL || ""}${
            comments[index]?.UserId.Avatar
          }`}
          className="h-10 w-10 rounded-full bg-gray-100"
        />
      </div>
      <div
        className={classNames(
          index === 0 ? "" : "border-t border-gray-200",
          "flex-1 py-4"
        )}
      >
        <h4 className="font-medium text-xl text-gray-900">
          {comments[index].UserId.username}
        </h4>
        <p>
          <time dateTime={comments[index].CreatedAt}>
            {new Date(comments[index].CreatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </p>

        <div
          dangerouslySetInnerHTML={{ __html: comments[index].Content }}
          className="prose prose-sm mt-4 max-w-none text-gray-500"
        />
      </div>
      <button
        onClick={onDelete}
        disabled={isLoading}
        className="text-xs mt-4 bg-red-200 text-red-800 flex justify-center items-center text-center size-6 rounded-full"
      >
        <TrashIcon className="size-4" />
      </button>
    </div>
  );
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default CommentCard;
