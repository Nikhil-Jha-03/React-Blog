import React, { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react';
import useBlog from '../hooks/useBlog';
import useAuth from '../hooks/useAuth';
import BlogContainer from '../components/BlogContainer';

const Blog = () => {
    const { getBlog, getAllCategory } = useBlog();
    const { token } = useAuth();
    
    const [blogs, setBlogs] = useState([]);
    const [category, setCategory] = useState([]);
    const [filteredBlog, setFilteredBlog] = useState([]);
    const [isFilterOn, setIsFilterOn] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(6);
    const [totalPage, setTotalPage] = useState(0);
    
    const searchRef = useRef(null);
    const searchTimeout = useRef(null);

    // Calculate pagination indices
    const lastPostIndex = currentPage * pageSize;
    const firstPageIndex = lastPostIndex - pageSize;

    const getAllBlog = async () => {
        const response = await getBlog(token);
        if (response.success) {
            setBlogs(response.blog);
            const pages = Math.ceil(response.blog.length / pageSize) || 1;
            setTotalPage(pages);
        } else {
            setBlogs([]);
            setTotalPage(0);
        }
    };

    const getAllCategorys = async () => {
        const response = await getAllCategory(token);
        if (response.success) {
            setCategory(response.data);
        } else {
            setCategory([]);
        }
    };

    const categoryFilter = (id) => {
        const filter = blogs.filter(data => data.category === id);
        setFilteredBlog(filter);
        setIsFilterOn(true);
        setCurrentPage(1); // Reset to first page when filtering
    };

    const handleSearch = (data) => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        
        searchTimeout.current = setTimeout(() => {
            if (data.trim()) {
                const filterData = blogs.filter(blog =>
                    blog.title.toLowerCase().includes(data.toLowerCase())
                );
                setFilteredBlog(filterData);
                setIsFilterOn(true);
                setCurrentPage(1); // Reset to first page when searching
            } else {
                setFilteredBlog([]);
                setIsFilterOn(false);
            }
        }, 500);
    };

    const handleClearFilter = () => {
        setIsFilterOn(false);
        setFilteredBlog([]);
        setCurrentPage(1); // Reset to first page
        if (searchRef.current) {
            searchRef.current.value = "";
        }
    };

    const onPageChange = (page) => {
        const maxPages = isFilterOn 
            ? Math.ceil(filteredBlog.length / pageSize) 
            : totalPage;
            
        if (page <= 0 || page > maxPages) {
            return;
        }
        setCurrentPage(page);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, []);

    // Fetch data on mount
    useEffect(() => {
        getAllBlog();
        getAllCategorys();
    }, []);

    // Determine which data to display
    const displayData = isFilterOn ? filteredBlog : blogs;
    const paginatedData = displayData.slice(firstPageIndex, lastPostIndex);
    const currentTotalPages = isFilterOn 
        ? Math.ceil(filteredBlog.length / pageSize) || 1
        : totalPage;

    return (
        <div className='border-t bg-black border-gray-800'>
            <section className='border-t border-gray-800 min-h-[60vh]'>
                <div className='max-w-7xl mx-auto py-5 px-9'>
                    
                    {/* Category Filters */}
                    <div className='flex justify-center mb-6'>
                        {category && category.length > 0 ? (
                            <div className='w-full max-w-5xl py-3 flex gap-5 justify-center whitespace-nowrap rounded-2xl overflow-x-auto scrollbar-hidden'>
                                {category.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => categoryFilter(cat._id)}
                                        className='flex-shrink-0 focus:ring-2 focus:ring-white bg-gray-900 text-white font-medium px-5 py-2 rounded-2xl shadow-md hover:scale-105 transform transition-all duration-300'
                                    >
                                        {cat.category}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className='text-gray-500'>No categories available</p>
                        )}
                    </div>

                    {/* Header with Search */}
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
                        <div>
                            <h1 className='text-white text-2xl font-bold'>All Blogs</h1>
                            <p className='text-zinc-500'>
                                Total results: {displayData.length}
                            </p>
                        </div>

                        <div className="relative flex justify-center items-center gap-4">
                            <div className="relative">
                                <input
                                    ref={searchRef}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    type="text"
                                    placeholder="Search blogs..."
                                    className="w-64 pl-10 pr-4 py-2 rounded-2xl border border-gray-600 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                            </div>

                            {isFilterOn && (
                                <button
                                    onClick={handleClearFilter}
                                    className='bg-white py-2 px-3 rounded-2xl font-semibold hover:bg-gray-200 transition-colors'
                                >
                                    Clear Filter
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Blog Grid */}
                    {displayData.length > 0 ? (
                        <>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                                {paginatedData.map((data) => (
                                    <BlogContainer key={data._id} post={data} />
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {currentTotalPages > 1 && (
                                <div className='flex gap-5 justify-center items-center mt-10'>
                                    <button
                                        onClick={() => onPageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className='text-white px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
                                    >
                                        Prev
                                    </button>

                                    <div className='flex gap-2'>
                                        {Array.from({ length: currentTotalPages }, (_, id) => (
                                            <button
                                                key={id}
                                                onClick={() => onPageChange(id + 1)}
                                                className={`px-3 py-2 rounded transition-all ${
                                                    currentPage === id + 1
                                                        ? 'bg-white text-black font-semibold'
                                                        : 'bg-gray-800 text-white hover:bg-gray-700'
                                                }`}
                                            >
                                                {id + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => onPageChange(currentPage + 1)}
                                        disabled={currentPage === currentTotalPages}
                                        className='text-white px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className='flex justify-center mt-10'>
                            <h1 className='text-lg font-bold text-zinc-400'>
                                {isFilterOn ? 'No blogs match your filter' : 'No Blogs Available'}
                            </h1>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Blog;