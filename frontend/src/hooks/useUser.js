import { useSelector, useDispatch } from 'react-redux'

const useUser = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.value)

    return { user, dispatch }
}

export default useUser;