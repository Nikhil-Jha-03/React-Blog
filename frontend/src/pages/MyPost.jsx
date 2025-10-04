import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import useAuth from '../hooks/useAuth'
import { Loader } from 'lucide-react'
import { toast } from 'react-toastify'

const MyPost = () => {
    const { token } = useAuth();
    const [userBlog, setUserBlog] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUserBlog = async () => {
        try {
            setLoading(true)

            const response = await api.get("/api/v1/blog/getuserblog", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response?.data?.success) {
                setUserBlog(response.data.data);
            } else {
                setUserBlog([]);
            }
        } catch (error) {
            console.error("Error fetching user blogs:", error);
            setUserBlog([]);
        } finally {
            setLoading(false);
        }

    }

    const handlePublish = async (id) => {
        try {
            const response = await api.patch("/api/v1/blog/drafttopublish", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: { id }
            })
            fetchUserBlog();
            toast.success(response?.data?.message || "Done")
        } catch (error) {
            toast.error("Someting went wrong")
        }


    }

    const handleDelete = async (id) => {
        try {
            const response = await api.delete(`/api/v1/blog/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(response?.data?.message || "Deleted")
            fetchUserBlog();
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    useEffect(() => {
        fetchUserBlog();
    }, [])

    return (
        <div className='border-t bg-black border-gray-800 '>
            <section className='border-t border-gray-800 min-h-[60vh]'>
                {loading ? (

                    <div
                        className="flex justify-center items-center h-full w-full mt-16"
                        role="status"
                        aria-label="Loading"
                    >
                        <Loader className="animate-spin text-white w-8 h-8" />
                    </div>

                ) : (
                    <div className='max-w-6xl mx-auto py-5 px-9'>
                        <div>
                            <h1 className='text-white text-2xl mt-10'>Your Blogs</h1>
                            <p className='text-gray-500'>Total Blog: {userBlog.length}</p>
                        </div>


                        <div className="flex flex-col gap-4 mt-10">
                            {userBlog && userBlog.length > 0 ? (
                                userBlog.map((items) => (
                                    <div
                                        key={items._id}
                                        className="bg-gray-900 flex flex-col md:flex-row rounded-2xl border border-gray-700 p-4 justify-between items-start md:items-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                                    >
                                        {/* Left side: Image + Info */}
                                        <div className="flex items-start gap-4 w-full md:w-auto">
                                            {/* Blog Image */}
                                            <div className="w-20 h-20 overflow-hidden rounded-xl">
                                                <img
                                                    className="object-cover w-full h-full"
                                                    src={items.image}
                                                    alt={items.title}
                                                />
                                            </div>

                                            {/* Blog Details */}
                                            <div className="flex flex-col gap-1">
                                                <h1 className="text-white font-semibold text-lg line-clamp-2">{items.title.length > 50 ? items.title.slice(0, 50) + "..." : items.title}</h1>


                                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                                                    <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded-md">
                                                        {items.category?.category || "Uncategorized"}
                                                    </span>
                                                    <span>{new Date(items.createdAt).toLocaleDateString()}</span>
                                                    <span>{items.views} views</span>
                                                    <span>{items.like?.length || 0} likes</span>
                                                    <span>{items.comments?.length || 0} comments</span>
                                                    {items.status === "draft" ? (
                                                        <span className="text-yellow-400 font-medium">Draft</span>
                                                    ) : (
                                                        <span className="text-green-400 font-medium">Published</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right side: Actions */}
                                        <div className="flex items-center gap-3 mt-3 md:mt-0">
                                            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium text-white text-sm rounded-lg transition">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(items._id)} className="px-3 py-1.5 bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 text-white text-sm font-medium rounded-lg transition">
                                                Delete
                                            </button>
                                            {items.status === "draft" && (
                                                <button onClick={() => { handlePublish(items._id) }} className="px-3 py-1.5 bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 text-white text-sm font-medium rounded-lg transition">
                                                    Publish
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <h1 className="text-white text-center">No blogs yet.</h1>
                            )}
                        </div>


                    </div>
                )

                }



            </section>
        </div>

    )
}

export default MyPost;


// Implement Pagination