import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Users, TrendingUp, Star } from 'lucide-react';
import BlogContainer from '../components/BlogContainer';

export default function LandingPage() {
  
  const stats = [
    { icon: BookOpen, value: "250+", label: "Articles" },
    { icon: Users, value: "10K+", label: "Readers" },
    { icon: TrendingUp, value: "50K+", label: "Monthly Views" },
    { icon: Star, value: "4.9", label: "Rating" }
  ];

  const featuredPosts = [
    { title: "The Future of Web Development", excerpt: "Exploring the latest trends and technologies shaping our digital landscape.", readTime: "5 min read" },
    { title: "Mastering the Art of Storytelling", excerpt: "How to craft compelling narratives that resonate with your audience.", readTime: "8 min read" },
    { title: "Design Psychology Principles", excerpt: "Understanding the psychological impact of design choices on user behavior.", readTime: "6 min read" }
  ];


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
            {featuredPosts.map((post, index) => (
              <BlogContainer key={index} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}