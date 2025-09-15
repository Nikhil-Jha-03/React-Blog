import React from 'react'
import { ArrowRight } from 'lucide-react';


const Blog = () => {
    return (
        <div className='border-t bg-black border-gray-800 '>
            <section className='text-white max-w-7xl mx-auto py-5 px-9'>
                <div className='middle-part flex flex-col justify-center min-h-96 py-12'>
                    <h1 className='text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-white'>Explore What Matters</h1>
                    <p className='text-xl sm:text-2xl text-gray-400 mx-auto leading-relaxed'>Discover thought-provoking content across technology, science, and lifestyle. Stay informed with curated articles from leading voices in their fields.</p>
                    <button className="w-fit mt-10 group bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 hover:scale-105">
                        <span>Start Reading</span>
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </button>
                </div>
            </section>
            <section className='border-t border-gray-800'>
                <div className='max-w-7xl mx-auto py-5 px-9'>
                    {/* For Category */}
                    <div>
                        <h1 className='text-white'>Category</h1>
                    </div>
                    {/* for Search and filter */}
                    <div>
                        <h1 className='text-white'>Search and filter</h1>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Blog