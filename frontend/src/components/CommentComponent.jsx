import React from 'react'
import { HeartIcon, User } from 'lucide-react'
import moment from 'moment';
moment().format();

const CommentComponent = ({ blogComment, userName }) => {
  console.log(blogComment)
  const createdTime = moment(blogComment.createdAt).fromNow();
  return (
    <div className="w-full rounded-xl border border-gray-800 bg-gray-900/40 px-3 py-3 sm:px-4 sm:py-4 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">

        <div className="flex items-center gap-2">
          <span className="rounded-2xl">
            <User size={18} className="text-gray-300" />
          </span>
          <p className="font-semibold text-blue-400 text-sm sm:text-[15px]">
            {blogComment?.userId?.name || "Anonymous"}
          </p>
        </div>

        <p className="text-[11px] sm:text-xs text-gray-400">
          {createdTime}
        </p>
      </div>

      <p className="mt-2 text-gray-200 text-[13px] sm:text-sm leading-relaxed">
        {blogComment.text}
      </p>

      <div className="flex items-center gap-3 mt-3 text-[11px] sm:text-xs text-gray-500">
        <span className="cursor-pointer hover:text-blue-400 transition flex items-center gap-1 sm:gap-2">
          <HeartIcon size={14} /> {blogComment.likes?.length || 0} Likes
        </span>
      </div>
    </div>

  );
};

export default React.memo(CommentComponent);

