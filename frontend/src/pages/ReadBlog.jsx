import React, { use, useEffect, useState } from 'react'
import api from '../api/axios';
import useAuth from '../hooks/useAuth';
import { useParams } from 'react-router-dom';
import { Calendar, Eye, Heart, User, Tag } from 'lucide-react';


const ReadBlog = () => {
  const blogId = useParams().id;
  console.log(blogId);
  const [blog, setBlog] = useState(null);
  const { token } = useAuth();


  const fetchBlog = async () => {
    console.log(token)
    if (!token) return;
    if (!blogId) return;
    try {
      const response = await api.get(`/api/v1/blog/getblogbyid/${blogId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (response?.data) {
        setBlog(response.data.data)
        console.log(response.data.data)
      }

    } catch (error) {
      console.error("Error fetching blog:", error);
      setBlog(null);
    }

  }


  useEffect(() => {
    fetchBlog();
  }, []);

const [liked, setLiked] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white ">Blog Article</h2>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30 uppercase">
                {blog?.status || "Published"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {blog ? (
          <article className="space-y-8">
            {/* Category Badge */}
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-400" />
              <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-sm font-semibold border border-blue-500/20">
                {blog.category.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{blog.userId.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{blog.views} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>{blog.like.length} likes</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-800 shadow-2xl group">
              <img 
                src={blog.image} 
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Interaction Bar */}
            <div className="flex items-center justify-between p-6 bg-gray-900/50 rounded-xl border border-gray-800">
              <button 
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  liked 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                {liked ? 'Liked' : 'Like'}
              </button>

              <div className="flex items-center gap-4 text-gray-400">
                <span className="text-sm">{blog.comments.length} Comments</span>
                <span className="text-sm">•</span>
                <span className="text-sm">Share</span>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              <div 
                className="text-gray-300 leading-relaxed space-y-6 p-8 bg-gray-900/30 rounded-xl border border-gray-800 prose prose-invert max-w-none [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-gray-200 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-white [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-4 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-4 [&_ol]:space-y-2 [&_li]:text-gray-200 [&_strong]:font-bold [&_strong]:text-white [&_em]:italic &_a]:text-blue-400 [&_a]:underline'"
                dangerouslySetInnerHTML={{ __html: blog.description }}
                style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.75'
                }}
              />
            </div>

            {/* Article Footer */}
            <div className="pt-8 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Author</p>
                    <p className="text-gray-400 text-sm">Username: {blog.userId.name}</p>
                  </div>
                </div>

                {blog.feature && (
                  <span className="px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg text-sm font-semibold border border-yellow-500/20">
                    ⭐ Featured
                  </span>
                )}
              </div>
            </div>
          </article>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-500">No data available</h2>
            <p className="text-gray-600 mt-2">The blog post could not be loaded.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReadBlog;

// implement the like feature and comment feature