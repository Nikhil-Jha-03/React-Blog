import { useSelector, useDispatch } from 'react-redux';
import { generateAiDescription, publishBlog } from '../features/BlogPost/BlogSlice';

const useBlog = () => {
    const dispatch = useDispatch();
    const blogState = useSelector(state => state.blog);
    const genAiDescription = ({ title, token }) => {
        dispatch(generateAiDescription({ title, token }));
    };

    const publishNewBlog = ({ data, token, type }) => {
        console.log("called")
        console.log(type)
        // dispatch(publishBlog({ data, token, type }));
    };


    return { blogState, genAiDescription, publishNewBlog };
};

export default useBlog;
