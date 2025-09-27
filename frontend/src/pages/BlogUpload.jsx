import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Eye, Upload, X, Save, ChevronDown, LoaderCircle, LogIn } from 'lucide-react'
import { useSelector } from 'react-redux'
import RTE from '../components/RTE';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import useUser from '../hooks/useUser';
import useBlog from '../hooks/useBlog';
import { toast } from "react-toastify"
import useAuth from '../hooks/useAuth';

const BlogUpload = () => {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [imagePreview, setImagePreview] = useState('')
    const [image, setImage] = useState(null)
    const [isFormValid, setIsFormValid] = useState(false)
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState()
    const { blogState, genAiDescription } = useBlog();
    const { token } = useAuth();
    const { user } = useUser();
    // const { _id, name, email, isAccountVerified } = user;



    const { register, watch, reset, handleSubmit, formState: { errors }, setValue, getValues, control } = useForm({});

    const newtitle = watch('title');
    const newImage = watch('image');
    const newDescription = watch('description');


    React.useEffect(() => {
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
        const response = await api.get('/api/v1/blog/get-category', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setCategory(response.data.data)
    };

    useState(() => {
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

    function timepass() {
        console.log(blogState)
        setValue('description', `<p>Have you ever found yourself marveling at how incredibly smooth and responsive your favorite web applications feel? That instant feedback when you click a button, the seamless loading of new content without a full page refresh? Chances are, you're experiencing the magic of <strong>React Js</strong>. This powerful JavaScript library, developed and maintained by Facebook, has revolutionized how we build modern user interfaces, making web development more efficient, performant, and enjoyable. But what exactly is React, and why has it become such an indispensable tool for developers worldwide?</p>\n\n<h2>The Core Magic: Understanding React's Component-Based Architecture</h2>\n\n<p>At the heart of React Js lies a deceptively simple yet profoundly powerful concept: <strong>components</strong>. Imagine your website or application not as one monolithic block, but as a collection of independent, reusable building blocks. Each button, navigation bar, user profile card, or even an entire page section can be a component. This modular approach brings immense clarity and organization to complex interfaces.</p>\n\n<p>When you break down a UI into these self-contained units, you gain incredible flexibility. Each component manages its own logic and appearance, making it easier to develop, test, and maintain. Need to update a specific part of your page? You only modify that component, without affecting the rest of the application. This reusability not only speeds up development but also ensures consistency across your product.</p>\n\n<p>Another foundational concept is the <strong>Virtual DOM</strong>. Unlike traditional web development where every change directly manipulates the browser's Document Object Model (DOM), React first creates a lightweight copy of the DOM in memory – the Virtual DOM. When state changes, React compares the new Virtual DOM with the previous one, identifies only the necessary changes, and then efficiently updates only those specific parts of the real DOM. This intelligent diffing and patching mechanism dramatically boosts performance, leading to the lightning-fast user experiences we've come to expect.</p>\n\n<h2>Why Developers and Businesses Alike Champion React Js</h2>\n\n<p>The rise of React Js isn't just a trend; it's a testament to its tangible benefits for both developers and the businesses they serve. For developers, React offers a declarative programming style, meaning you describe what your UI should look like for a given state, and React handles the steps to achieve it. This makes code easier to read, debug, and predict, reducing common errors and accelerating development cycles.</p>\n\n<p>Businesses, on the other hand, reap rewards in various forms. React's efficiency translates directly into faster product delivery, lower development costs due to code reusability, and a more maintainable codebase over time. A robust and active community further strengthens React's appeal, providing a wealth of resources, libraries, and tools that extend its capabilities. This vibrant ecosystem means developers rarely face a problem without a pre-existing solution or a supportive peer to guide them.</p>\n\n<ul>\n    <li><strong>Enhanced Performance:</strong> The Virtual DOM ensures highly optimized updates, providing users with a smooth and responsive experience.</li>\n    <li><strong>Reusability & Maintainability:</strong> Component-based architecture promotes modular code, making applications easier to scale and manage.</li>\n    <li><strong>Strong Community Support:</strong> A vast global community contributes to an extensive ecosystem of tools, libraries, and learning resources.</li>\n    <li><strong>Cross-Platform Capabilities:</strong> With React Native, developers can build native mobile applications using their React knowledge, extending reach across platforms.</li>\n</ul>\n\n<h2>React in the Real World: Powering Modern Digital Experiences</h2>\n\n<p>React Js isn't just for startups; it's the backbone of some of the world's most popular and demanding web applications. From social media giants to streaming services and e-commerce platforms, React's ability to handle complex, dynamic user interfaces at scale makes it a top choice. Consider the seamless browsing experience on <strong>Netflix</strong>, the interactive dashboards in <strong>Airbnb</strong>, or the dynamic content feeds on <strong>Instagram</strong> – all are testaments to React's power and versatility.</p>\n\n<p>The beauty of React lies in its flexibility. It's not a full-stack framework; it focuses solely on the view layer, meaning you can integrate it with existing backend technologies or pair it with modern serverless architectures. This makes it an ideal solution for single-page applications (SPAs), complex enterprise systems, real-time dashboards, and even e-commerce storefronts that require rapid updates and interactive elements.</p>\n\n<h2>Embarking on Your React Journey: Getting Started with Confidence</h2>\n\n<p>Feeling inspired to dive into React? The journey is accessible, especially if you have a foundational understanding of JavaScript, HTML, and CSS. The official React documentation is an excellent starting point, known for its clarity and comprehensiveness. Many online courses, tutorials, and bootcamps also offer structured learning paths that guide you from basic concepts to advanced patterns.</p>\n\n<p>To kickstart a new React project, tools like <strong>Create React App</strong> or <strong>Vite</strong> provide a ready-to-use development environment, abstracting away complex build configurations so you can focus immediately on coding. Start by understanding components, then move to props (how data flows into components), state (how components manage their own data), and finally, React Hooks (functions that let you \"hook into\" React state and lifecycle features from functional components). Build small projects, experiment, and don't be afraid to break things – that's how true learning happens!</p>\n\n<h2>The Vibrant React Ecosystem and Its Future</h2>\n\n<p>Beyond the core library, React boasts an incredibly rich and evolving ecosystem. Frameworks like <strong>Next.js</strong> build on React to provide server-side rendering, static site generation, and API routes, making it a powerful choice for full-stack React applications and SEO-friendly websites. State management libraries such as <strong>Redux</strong> or <strong>Zustand</strong> help manage complex application states efficiently. For mobile development, <strong>React Native</strong> allows you to write cross-platform native apps using your React knowledge, sharing up to 90% of your codebase between iOS and Android.</p>\n\n<p>The future of React looks incredibly bright, with continuous innovation driven by both Facebook and the community. Expect ongoing improvements in performance, developer experience, and new features that keep React at the forefront of web development. As the web evolves, React's adaptable nature ensures it will remain a relevant and powerful tool for crafting cutting-edge user interfaces.</p>\n\n<p>React Js has undeniably transformed the landscape of front-end development, offering a powerful, efficient, and enjoyable way to build interactive web applications. Its component-based architecture and Virtual DOM deliver unparalleled performance and maintainability, while its robust ecosystem and active community provide a wealth of resources for developers at every stage. Whether you're a seasoned developer or just starting your coding journey, embracing React can unlock new possibilities and empower you to create truly dynamic and engaging digital experiences. So, why not take the leap and start building something amazing with React today?</p>`)
    };

    useEffect(() => {
        if (blogState?.aiDescription?.data) {
            setValue("description", blogState.aiDescription.data);
        }
    }, [blogState?.aiDescription, setValue]);


    const onSubmit = (data) => {
        console.log(data)
        console.log(errors)
    };


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
                        <h1 className='text-lg text-white my-5'>{newtitle}</h1>

                        <div className='text-white' dangerouslySetInnerHTML={{ __html: newDescription }}></div>

                    </div>

                </div>

            </section>
        )
    } else {
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



                                {!blogState?.loading || false ? (<button type='button' onClick={handleAiGenerate} className='flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold transition-all bg-white text-black hover:bg-gray-200 cursor-pointer text-lg'> Use Ai - credit left {user?.aiCredit ? user.aiCredit : 0} </button>)
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
                        <br />
                        <br />
                        <br />
                        <button className='bg-white cursor-pointer' onClick={timepass}>Generate ai description</button>
                    </form>
                </div>

            </div>
        )
    }

}

export default BlogUpload;

// create backend endpoint to save the blog detail to the database
// Add Generate text to the frontend and also check the code and role with gpt
// add Loader in button or something