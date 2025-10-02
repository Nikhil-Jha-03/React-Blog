import React, { useEffect, useState } from 'react'
import { ArrowRight, ArrowDown, ArrowUp } from 'lucide-react';
import useBlog from '../hooks/useBlog';
import useAuth from '../hooks/useAuth';
import BlogContainer from '../components/BlogContainer';


const Blog = () => {
    const { getBlog } = useBlog();
    const [blogs, setBlogs] = useState([]);
    const { token } = useAuth()
    const [noOfBlogTodisplay, setNoOfBlogTodisplay] = useState(3);

    const getAllBlog = async () => {
        const response = await getBlog(token)
        if (response.success) {
            setBlogs(response.blog)
        } else {
            setBlogs([])
        }

    }

    const isShowingAll = noOfBlogTodisplay >= blogs.length;

    const handleToggle = () => {
        setNoOfBlogTodisplay(prev => isShowingAll ? Math.max(prev - 3, 3) : prev + 3);
    };

    useEffect(() => {
        getAllBlog()
    }, [])

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

                    <div>
                        <h1 className='text-white text-2xl'>All blog</h1>
                        <div className=' sm:grid sm:grid-cols-2 lg:grid-cols-3 mt-5 gap-5'>
                            {blogs.slice(0, noOfBlogTodisplay).map((data) => (
                                <BlogContainer key={data._id} post={data} ></BlogContainer>
                            ))}
                        </div>

                        <div>

                            <p
                                className='text-white mt-5 cursor-pointer flex justify-center gap-2'
                                onClick={handleToggle}
                            >
                                <span>{isShowingAll ? "Show Less" : "Show More"}</span>
                                {isShowingAll ? <ArrowUp className='animate-bounce' /> : <ArrowDown className='animate-bounce' />}
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    )
}

export default Blog