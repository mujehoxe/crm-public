import { TrashIcon } from "@heroicons/react/24/outline";

function CommentCard({ comment, index, onDelete, isLoading }) {
  return (
    <div className="flex space-x-4 text-sm text-gray-500">
      <div className="flex-none py-4">
        <img
          alt={comment.UserId.username}
          src={`${process.env.NEXT_PUBLIC_BASE_URL || ""}${
            comment?.UserId.Avatar
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
          {comment.UserId.username}
        </h4>
        <p>
          <time dateTime={comment.CreatedAt}>
            {new Date(comment.CreatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </p>

        <div
          dangerouslySetInnerHTML={{ __html: comment.Content }}
          className="prose prose-sm mt-4 max-w-none text-gray-500"
        />
      </div>
      <button
        onClick={onDelete}
        disabled={isLoading}
        className="text-xs bg-red-200 text-red-800 p-1 w-6 h-6 rounded-full mt-2 ml-2"
      >
        <TrashIcon />
      </button>
    </div>
  );
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default CommentCard;
