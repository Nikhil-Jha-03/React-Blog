import React, { useRef, useState } from 'react'
import { Eye, Upload, X, Save } from 'lucide-react'
import RTE from '../components/RTE';
import { useForm } from 'react-hook-form';

const BlogUpload = () => {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [imagePreview, setImagePreview] = useState('')
    const [image, setImage] = useState(null)
    const isFormValid = false;
    const [title, setTitle] = useState('')
    // const { register, reset, handleSubmit, formState: { errors }, setValue, getValues, control } = useForm({
    //     image:'',
    //     title:'',
    //     description:''
    // })
    const { register, reset, handleSubmit, formState: { errors }, setValue, getValues, control } = useForm({})

    const handleFileUpload = (file) => {
        if (file && file.type.startsWith('image/')) {
            setImage(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        // When you drag an image file into the browser, the default behavior is to open it in a new tab.
        // Using e.preventDefault() only inside handleDrop is too late, because the browser already decided what to do during the drag over event.
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files; //important dataTransfer when dealing with the onDrop

        if (files.length > 0) {
            const file = files[0];
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
    }

    const onSubmit = (data) => {
        console.log(data)
        console.log(errors)
    }



    return (
        <div className='bg-black border-t border-gray-800'>
            <div className='max-w-4xl mx-auto px-8 py-10'>
                <form action="" onSubmit={handleSubmit(onSubmit)}>
                    {/* for Text */}
                    <section className='flex justify-between'>
                        <div>
                            <h1 className='text-3xl font-bold mb-2 text-white'>Create New Blop Post</h1>
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

                    {/* for Description */}
                    <section className='py-8 flex flex-col gap-3'>
                        <label htmlFor="title" className='block text-lg font-semibold text-white'>Blog Description</label>
                        <RTE name={'description'} control={control} />
                        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                    </section>


                    <section>
                        <div className="flex items-center justify-between pt-6 border-t border-gray-800">
                            <button
                                type="button"
                                className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-all"
                            >
                                Save Draft
                            </button>

                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    disabled={!isFormValid}
                                    className={`flex items-center space-x-2 px-6 py-3 border rounded-lg transition-all ${isFormValid
                                        ? 'border-gray-600 text-white hover:border-white hover:bg-gray-900'
                                        : 'border-gray-800 text-gray-600 cursor-not-allowed'
                                        }`}
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>Preview</span>
                                </button>

                                <button
                                    type="button"
                                    disabled={!isFormValid}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${isFormValid
                                        ? 'bg-white text-black hover:bg-gray-200'
                                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                        }`}
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Publish Blog</span>
                                </button>
                            </div>
                        </div>
                    </section>


                    <button className='bg-white cursor-pointer' type='submit'>Submit Form</button>
                </form>
            </div>

        </div>
    )
}

export default BlogUpload;

// add Loader in button or something