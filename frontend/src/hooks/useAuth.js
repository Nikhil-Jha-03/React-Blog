import { useSelector, useDispatch } from 'react-redux'

const useAuth = () => {
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth?.token || null);
    return { dispatch, token }
}

export default useAuth;