import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Users, TrendingUp, Star } from 'lucide-react';
import BlogContainer from '../components/BlogContainer';
import api from '../api/axios';

export default function LandingPage() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  
  const stats = [
    { icon: BookOpen, value: "250+", label: "Articles" },
    { icon: Users, value: "10K+", label: "Readers" },
    { icon: TrendingUp, value: "50K+", label: "Monthly Views" },
    { icon: Star, value: "4.9", label: "Rating" }
  ];

  const stripHtml = (value) => {
    if (!value) return "";
    return value.replace(/<[^>]*>?/gm, "");
  };

  const estimateReadTime = (text) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const fetchFeaturedBlogs = async () => {
    try {
      setFeaturedLoading(true);
      const response = await api.get("/api/v1/blog/featured");
      const blogs = response?.data?.blogs || [];

      const mappedFeaturedPosts = blogs.map((blog) => {
        const plainDescription = stripHtml(blog.description || "");
        return {
          ...blog,
          excerpt:
            plainDescription.length > 120
              ? `${plainDescription.slice(0, 120)}...`
              : plainDescription,
          readTime: estimateReadTime(plainDescription),
          publishedDate: new Date(blog.createdAt).toLocaleDateString(),
          author: blog.userId?.name || "Unknown"
        };
      });

      setFeaturedPosts(mappedFeaturedPosts);
    } catch (error) {
      setFeaturedPosts([]);
      console.error("Failed to fetch featured blogs:", error);
    } finally {
      setFeaturedLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedBlogs();
  }, []);


  const stars = [
  { pos: "top-40 left-10", size: "w-2 h-2", color: "bg-white", delay: "" },
  { pos: "top-60 right-20", size: "w-1 h-1", color: "bg-gray-500", delay: "delay-1000" },
  { pos: "top-20 left-1/4", size: "w-1.5 h-1.5", color: "bg-gray-400", delay: "delay-500" },
  { pos: "left-40", size: "w-1.5 h-1.5", color: "bg-gray-400", delay: "delay-500" },
  { pos: "bottom-20 left-1/4", size: "w-1.5 h-1.5", color: "bg-gray-400", delay: "delay-500" },
  { pos: "bottom-20 right-1/4", size: "w-1.5 h-1.5", color: "bg-gray-400", delay: "delay-500" },
  { pos: "top-20 right-1/3", size: "w-1.5 h-1.5", color: "bg-gray-400", delay: "delay-500" },
  { pos: "top-32 left-32", size: "w-0.5 h-0.5", color: "bg-gray-300", delay: "delay-[200ms]" },
  { pos: "top-16 right-16", size: "w-3 h-3", color: "bg-white", delay: "delay-[700ms]" },
  { pos: "top-80 left-16", size: "w-1 h-1", color: "bg-gray-600", delay: "delay-[300ms]" },
];

  return (
    <div className='bg-black'>
      <section className="relative pt-32 pb-20 px-6 sm:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-white">
                Stories That
                <span className="block bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                  Inspire
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Discover insights, ideas, and inspiration through our carefully crafted articles.
                Join thousands of readers on a journey of knowledge and creativity.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 hover:scale-105">
                <span>Start Reading</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              <button className="border-2 border-gray-700 text-white px-8 py-4 rounded-full font-semibold text-lg hover:border-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-105">
                Browse Categories
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        {stars.map((star, i) => (
        <div
          key={i}
          className={`absolute ${star.pos} ${star.size} ${star.color} rounded-full animate-pulse ${star.delay}`}
        ></div>
      ))}
      </section>


      {/* Stats Section */}
      <section className="py-16 px-6 sm:px-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-gray-900 rounded-full group-hover:bg-gray-800 transition-colors">
                      <Icon size={28} className="text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* Featured Posts Section */}
      <section className="py-20 px-6 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Articles</h2>
            <p className="text-gray-400 text-xl">Handpicked stories from our latest publications</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3">
            {featuredLoading ? (
              <p className="text-gray-400">Loading featured blogs...</p>
            ) : featuredPosts.length > 0 ? (
              featuredPosts.map((post) => (
                <BlogContainer key={post._id} post={post} />
              ))
            ) : (
              <p className="text-gray-400">
                No featured blogs yet. Admin can add up to 3 featured blogs.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
