import React, { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowDown, ArrowUp, Search } from 'lucide-react';
import useBlog from '../hooks/useBlog';
import useAuth from '../hooks/useAuth';
import BlogContainer from '../components/BlogContainer';

const Blog = () => {
    const { getBlog, getAllCategory } = useBlog();
    const [blogs, setBlogs] = useState([]);
    const [category, setCategory] = useState([]);
    const [filteredBlog, setfilteredBlog] = useState([]);
    const [isFilterOn, setIsFilterOn] = useState(false)
    const { token } = useAuth();
    const [noOfBlogTodisplay, setNoOfBlogTodisplay] = useState(3);

    const getAllBlog = async () => {
        const response = await getBlog(token)

        if (response.success) {
            setBlogs(response.blog)
        } else {
            setBlogs([])
        }
    }

    const getAllCategorys = async () => {
        const response = await getAllCategory(token)
        if (response.success) {
            localStorage.setItem("categories", JSON.stringify(response.data))
            return setCategory(response.data)
        } else {
            return setCategory([])
        }
    }

    const categoryFilter = (id) => {
        setIsFilterOn(true)
        const filter = blogs.filter(data => data.category === id)
        setfilteredBlog(filter);
    }

    const searchRef = useRef(null)
    const searchTimeout = useRef(null);

    const handleSearch = (data) => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            if (data.trim()) {
                const filterData = blogs.filter(blog =>
                    blog.title.toLowerCase().includes(data.toLowerCase())
                );
                setIsFilterOn(true);
                setfilteredBlog(filterData);
            } else {
                setIsFilterOn(false);
                setfilteredBlog([]);
            }
        }, 500);
    };

    const handleClearFilter = () => {
        setIsFilterOn(false);
        setfilteredBlog([]);
        if (searchRef.current) {
            searchRef.current.value = "";
        }

    }

    const isShowingAll = noOfBlogTodisplay >= blogs?.length;

    const handleToggle = () => {
        setNoOfBlogTodisplay(prev => isShowingAll ? 3 : prev + 3);
    };

    useEffect(() => {
        getAllBlog();
        getAllCategorys();
    }, [])

    return (
        <div className='border-t bg-black border-gray-800 '>

            <section className='border-t border-gray-800 min-h-[60vh]'>
                <div className='max-w-7xl mx-auto py-5 px-9'>
                    {/* For Category */}
                    <div>
                        <div className='flex justify-center'>
                            {category && category?.length > 0 ? (
                                <>
                                    <div className='w-5xl py-3 flex gap-5 justify-center whitespace-nowrap rounded-2xl bg-gray-00 overflow-y-auto scrollbar-hidden overflow-scrollshadow-white'>
                                        {category.map((cat) => (
                                            <div className='flex gap-1' key={cat._id}>

                                                <button onClick={() => categoryFilter(cat._id)} className='flex-shrink-0 focus:border-2 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white font-medium px-5 py-2 rounded-2xl shadow-md hover:scale-105 transform transition-all duration-300 cursor-pointer'>{cat.category}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>

                            ) :
                                (
                                    <h1>Nothing</h1>
                                )
                            }
                        </div>
                    </div>


                    <div>
                        <div className='flex justify-between'>
                            <div>
                                <h1 className='text-white text-2xl'>All blog</h1>
                                {!isFilterOn ? (<p className='text-zinc-500'>Total result: {blogs?.length || 0}</p>) : (<p className='text-zinc-500'>Total result: {filteredBlog?.length || 0}</p>)}
                            </div>

                            <div className="relative flex justify-center items-center gap-4">
                                <input
                                    ref={searchRef}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        handleSearch(e.currentTarget.value);
                                    }}
                                    type="text"
                                    placeholder="Search blogs..."
                                    className="w-64 pl-10 pr-4 py-2 rounded-2xl border border-gray-600 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                {isFilterOn && (
                                    <button
                                        onClick={handleClearFilter}
                                        className='bg-white py-2 px-3 rounded-2xl  font-semibold  disabled:cursor-not-allowed disabled:bg-zinc-400' disabled={!isFilterOn}
                                    >Clear Filter</button>
                                )}

                            </div>
                        </div>

                        {isFilterOn && filteredBlog.length > 0 && (

                            <>
                                <div className=' sm:grid sm:grid-cols-2 lg:grid-cols-3 mt-5 gap-5'>
                                    {filteredBlog.slice(0, noOfBlogTodisplay).map((data) => (
                                        <BlogContainer key={data._id} post={data} ></BlogContainer>
                                    ))}
                                </div>
                            </>
                        )}

                        {!isFilterOn && blogs && blogs?.length > 0 ? (
                            <>
                                <div className=' sm:grid sm:grid-cols-2 lg:grid-cols-3 mt-5 gap-5'>
                                    {blogs.slice(0, noOfBlogTodisplay).map((data) => (
                                        <BlogContainer key={data._id} post={data} ></BlogContainer>
                                    ))}
                                </div>

                                <div>

                                    {blogs.length > 3 && (
                                        <p
                                            className='text-white mt-5 cursor-pointer flex justify-center gap-2'
                                            onClick={handleToggle}
                                        >
                                            <span>{isShowingAll ? "Show Less" : "Show More"}</span>
                                            {isShowingAll ? <ArrowUp className='animate-bounce' /> : <ArrowDown className='animate-bounce' />}
                                        </p>
                                    )}


                                </div>
                            </>

                        )
                            : (
                                <h1 className=' flex justify-center text-lg font-bold text-zinc-400 mt-6'>No Blogs Available</h1>
                            )}


                    </div>
                </div>
            </section>
        </div>
    )
}

export default Blog