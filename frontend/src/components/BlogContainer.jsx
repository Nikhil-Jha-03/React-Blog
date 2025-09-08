import React from 'react'
import {ArrowRight,Heart,Eye} from 'lucide-react'

const BlogContainer = ({index,post}) => {
    return (
        <article key={index} className="group bg-gray-900 rounded-2xl p-8 hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-800 hover:border-gray-700">
            <div className="mb-6">
                <div className="w-full h-40 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-6 group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-300"></div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>{post.readTime}</span>
                    <span>{post.publishedDate}</span>
                </div>
                <div className="text-gray-500 text-sm mb-2">by {post.author || 'Nikhil Jha'}</div>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-gray-100 transition-colors">
                {post.title}
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">{post.excerpt}</p>
            <div className="flex items-center justify-between">
                <button className="flex items-center space-x-2 text-white font-medium group-hover:gap-3 transition-all duration-200">
                    <span>Read More</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center space-x-4 text-gray-500 text-sm">
                    <div className="flex items-center space-x-1">
                        <Heart size={14} />
                        <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Eye size={14} />
                        <span>{post.views}</span>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default BlogContainer