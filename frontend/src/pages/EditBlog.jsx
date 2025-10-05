import React, { useEffect, useRef, useState } from 'react'
import { Eye, Upload, X, Save, ChevronDown, LoaderCircle, LoaderCircleIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import domPurify from 'dompurify'

import RTE from '../components/RTE';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import useUser from '../hooks/useUser';
import useBlog from '../hooks/useBlog';
import { toast } from "react-toastify"
import useAuth from '../hooks/useAuth';

const BlogUpload = () => {
    const navigate = useNavigate()
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [imagePreview, setImagePreview] = useState('')
    const [image, setImage] = useState(null)
    const [isFormValid, setIsFormValid] = useState(false)
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState()
    const { blogState, genAiDescription } = useBlog();
    const [isUpdating, setIsUpdating] = useState(false)
    const { token } = useAuth();
    const { user } = useUser();
    const paramsData = useParams();


    const { register, reset, watch, handleSubmit, formState: { errors, isDirty }, setValue, getValues, control } = useForm({});

    const newtitle = watch('title');
    const newImage = watch('image');
    const newDescription = watch('description');


    useEffect(() => {
        if (newtitle && newImage && newDescription) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [newtitle, newImage, newDescription]);

    const handleFileUpload = (file) => {
        if (file && file.type.startsWith('image/')) {
            setImage(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true)
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false)
    };

    const handleDrop = (e) => {
        // When you drag an image file into the browser, the default behavior is to open it in a new tab.
        // Using e.preventDefault() only inside handleDrop is too late, because the browser already decided what to do during the drag over event.
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files; //important dataTransfer when dealing with the onDrop

        if (files.length > 0) {
            const file = files[0];
            console.log(file)
            setValue('image', file)
            handleFileUpload(file)
        }
    };

    const removeImage = (e) => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    async function fetchData() {
        try {
            const response = await api.get('/api/v1/blog/get-category', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setCategory(response.data.data)
        } catch (error) {
            toast.error('Failed to load blog');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData()
    }, [])


    const handleAiGenerate = () => {
        const getTitle = getValues('title')
        if (!getTitle && !getTitle.trim() != '') {
            toast.error("Enter Tittle")
            return;
        }
        genAiDescription({ title: getTitle, token: token });
    }

    useEffect(() => {
        if (blogState?.aiDescription?.data) {
            setValue("description", blogState.aiDescription.data);
        }
    }, [blogState?.aiDescription, setValue]);


    const onBlogEdit = async (data) => {
        setIsUpdating(true)
        try {
            const { id } = paramsData
            const formData = new FormData();
            formData.append("image", image);
            formData.append("title", data.title)
            formData.append("category", data.category)
            formData.append("description", data.description)
            formData.append("status", "draft");

            const response = await api.put(`/api/v1/blog/edit/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            reset();
            removeImage();
            console.log(response.data)
            if (response.data.success) {
                navigate("/myblogs")
                return toast.success(response.data.message)
            } else {
                return toast.error(response.data.message)
            }

        } catch (error) {
            toast.error("Failed to update blog");
            console.error(error);
        } finally {
            setIsUpdating(false)
        }
    };

    const fetchExistingData = async () => {
        try {
            const { id } = paramsData
            const { data } = await api.get(`/api/v1/blog/getEditBlog/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`

                }
            })
            if (data.data) {
                reset(data.data)
                setImagePreview(data.data.image)
                setImage(data.data.image)
            }
        } catch (error) {
            toast.error('Failed to load blog');
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    }

    useEffect(() => {
        fetchExistingData()
    }, [])


    if (isPreviewMode) {
        return (

            <section className='bg-black border-t border-gray-800'>
                <div className='max-w-5xl mx-auto px-8 py-10 '>
                    <div className='flex justify-between mb-10'>
                        <h1 className='text-white text-lg font-bold'>View Post Preview </h1>
                        <button type='button' onClick={() => setIsPreviewMode(false)} className='text-white font-extrabold bg-opacity-75 hover:bg-gray-800 rounded-full p-2  transition-all'>
                            <X className="w-4 h-4 cursor-pointer" />
                        </button>
                    </div>

                    <div>
                        <div className="aspect-video w-full bg-gray-800 rounded-lg overflow-hidden">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>


                    <div>
                        <h1 className='text-white text-3xl my-5'>{newtitle}</h1>

                        <div
                            className='text-white prose prose-invert max-w-none [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-gray-200 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-4 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-4 [&_ol]:space-y-2 [&_li]:text-gray-200 [&_strong]:font-bold [&_strong]:text-white [&_em]:italic &_a]:text-blue-400 [&_a]:underline'
                            dangerouslySetInnerHTML={{
                                __html: domPurify.sanitize(getValues("description") || '')
                            }}
                        />

                    </div>

                </div>

            </section>
        )
    } else {
        return (
            <div className='bg-black border-t border-gray-800'>
                <div className='max-w-4xl mx-auto px-8 py-10'>
                    <form>
                        {/* for Text */}
                        <section className='flex justify-between'>
                            <div>
                                <h1 className='text-3xl font-bold mb-2 text-white'>Edit Blog Post</h1>
                                <p className='text-gray-400'>Share your thoughts with the world</p>
                            </div>
                            <div>
                                <button
                                    onClick={() => setIsPreviewMode(true)}
                                    disabled={!isFormValid}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${isFormValid
                                        ? 'border-gray-600 text-white hover:border-white hover:bg-gray-900'
                                        : 'border-gray-800 text-gray-600 cursor-not-allowed'
                                        }`}
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>Preview</span>
                                </button>
                            </div>
                        </section>

                        {/* for Image */}
                        <section className='text-white mt-8 flex flex-col gap-5'>
                            <label className='block text-lg font-semibold' htmlFor="FeaturedImage"> Featured Image</label>

                            {!imagePreview ?
                                (
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`border-2 border-dashed rounded-lg p-12 w-full text-center transition-all cursor-pointer ${isDragging
                                            ? 'border-white bg-gray-900'
                                            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-950'
                                            }`}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                        <p className="text-xl mb-2 text-gray-300">
                                            Drop your image here, or <span className="text-white underline">browse</span>
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Support: JPG, PNG, GIF up to 10MB
                                        </p>
                                        <input
                                            {...register('image', { required: "Image is required" })}
                                            ref={(e) => {
                                                register('image').ref(e);
                                                fileInputRef.current = e;
                                            }}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target?.files[0]
                                                setValue('image', file || null, { shouldValidate: true })
                                                if (file) handleFileUpload(file)
                                            }}
                                        // onChange={handleFileSelect}
                                        />
                                        {errors.image && <p className="text-red-500 text-2xl">{errors.image.message}</p>}
                                    </div>
                                )

                                :
                                (
                                    <div className="relative group">
                                        <div className="aspect-video w-full bg-gray-800 rounded-lg overflow-hidden">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-4 right-4 bg-black bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-all">
                                            {image?.name}
                                        </div>
                                    </div>


                                )}

                        </section>

                        {/* for Title */}
                        <section className='py-8 flex flex-col gap-3'>
                            <label htmlFor="title" className='block text-lg font-semibold text-white'>Blog Title</label>
                            <input
                                {...register('title', {
                                    required: "Title is required",
                                    minLength: { value: 3, message: "Title must be at least 3 characters" }
                                })}
                                type="text"
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter your blog title..."
                                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white text-lg"
                                maxLength={100}
                            />
                            <div className="text-right text-sm text-gray-500">
                                {title.length}/100 characters
                            </div>
                            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                        </section>

                        {/* for Category */}
                        <section className='py-8 flex flex-col gap-4'>
                            <label htmlFor="category" className='text-white font-semibold text-lg tracking-wide'>
                                Select Category
                            </label>
                            <div className="relative">
                                <select
                                    className='w-full bg-black border-2 border-gray-300 text-white px-4 py-3 rounded-lg appearance-none cursor-pointer focus:outline-none focus:border-white focus:ring-2 focus:ring-white focus:ring-opacity-20 transition-all duration-200 hover:border-gray-100'
                                    {...register('category', { required: "Select Category" })}
                                >
                                    <option value="" className="bg-black text-gray-400">Choose a category...</option>
                                    {category && category.map((cat) => (
                                        <option
                                            key={cat._id}
                                            value={cat._id}
                                            className="bg-black text-white py-2 hover:bg-gray-800"
                                        >
                                            {cat.category}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                    <ChevronDown className="h-5 w-5 text-gray-300" />
                                </div>
                            </div>
                            {errors.category && <p className="text-red-500">{errors.category.message}</p>}

                        </section>

                        {/* for Description */}
                        <section className='py-8 flex flex-col gap-3'>

                            <div className='flex justify-between'>
                                <label htmlFor="title" className='block text-lg font-semibold text-white'>Blog Description</label>



                                {!blogState?.loading || false ? (<button type='button' onClick={(e) => {
                                    e.preventDefault()
                                    handleAiGenerate()
                                }} className='flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold transition-all bg-white text-black hover:bg-gray-200 cursor-pointer text-lg'> Use Ai - credit left {user?.aiCredit ? user.aiCredit : 0} </button>)
                                    : (
                                        <button className='flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold transition-all bg-zinc-300 text-black text-sm'>
                                            <span className='text-lg'> Thinking... </span> <LoaderCircle className='transition-all animate-spin' />
                                        </button>
                                    )}

                            </div>
                            <RTE name={'description'} control={control} />
                            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                        </section>


                        <section>
                            <div className="flex items-center justify-between pt-6 border-t border-gray-800">
                                <button
                                    type="submit"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSubmit(onBlogEdit)();
                                    }}
                                    disabled={!isFormValid && !isDirty}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${isFormValid && isDirty
                                        ? 'bg-white text-black hover:bg-gray-200'
                                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                        }`}
                                >
                                    {isUpdating ? (
                                        <span className='animate-spin duration-200 transition-all bg-gray-800 text-gray-600 cursor-not-allowed'><LoaderCircleIcon /></span>
                                    ) : (<>
                                        <Save className="w-4 h-4" />
                                        <span> Save</span></>)}

                                </button>
                            </div>
                        </section>
                    </form>
                </div>

            </div>
        )
    }

}

export default BlogUpload;

// Add Generate text to the frontend and also check the code and role with gpt
