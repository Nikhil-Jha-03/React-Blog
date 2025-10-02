import { useSelector, useDispatch } from 'react-redux';
import { generateAiDescription, publishBlog, getAllBlog } from '../features/BlogPost/BlogSlice';

const useBlog = () => {

    const dispatch = useDispatch();
    const blogState = useSelector(state => state.blog);

    const getBlog = async (token) => {
        const response = await dispatch(getAllBlog({token}));
        if (response) {
            return response.payload;
        } else {
            console.log("errorres", response)

        }
    }

    const genAiDescription = ({ title, token }) => {
        dispatch(generateAiDescription({ title, token }));
    };

    const publishNewBlog = async (formData, token) => {
        const result = await dispatch(publishBlog({ formData, token }))
        if (publishBlog.fulfilled.match(result)) {
            return result.payload.message || null
        } else {
            return result.payload.message || "Something went wrong, Try Again"
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

    return { blogState, genAiDescription, publishNewBlog, draftBlog, getBlog };
};

export default useBlog;
