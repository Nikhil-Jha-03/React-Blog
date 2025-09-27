import { useSelector, useDispatch } from 'react-redux';
import { generateAiDescription } from '../features/BlogPost/BlogSlice';

const useBlog = () => {
    const dispatch = useDispatch();
    const blogState = useSelector(state => state.blog);
    const genAiDescription = ({ title, token }) => {
        dispatch(generateAiDescription({ title, token }));
    };

    return { blogState, genAiDescription };
};

export default useBlog;
