import { useSelector, useDispatch } from 'react-redux';
import { generateAiDescription, publishBlog, getAllBlog,getCategory } from '../features/BlogPost/BlogSlice';

const useBlog = () => {

    const dispatch = useDispatch();
    const blogState = useSelector(state => state.blog);

    

    const genAiDescription = ({ title, token }) => {
        dispatch(generateAiDescription({ title, token }));
    };

    const publishNewBlog = async (formData, token) => {
        console.log("Publishes")
        const result = await dispatch(publishBlog({ formData, token }))
        if (publishBlog.fulfilled.match(result)) {
            return result.payload || null
        } else {
            return result.payload || "Something went wrong, Try Again"
        }
    };

    const draftBlog = async (formData, token) => {
        const result = await dispatch(publishBlog({ formData, token }))
        if (publishBlog.fulfilled.match(result)) {
            return result.payload
        } else {
            return result.payload
        }
    };

    const getBlog = async (token) => {
        const response = await dispatch(getAllBlog({token}));
        if (response) {
            return response.payload;
        } else {
            console.log("errorres", response)

        }
    }
    const getAllCategory = async (token) => {
        const response = await dispatch(getCategory({token}));
        if (response) {
            return response.payload;
        } else {
            console.log("errorres", response)

        }
    }

    return { blogState, genAiDescription, publishNewBlog, draftBlog, getBlog, getAllCategory };
};

export default useBlog;
