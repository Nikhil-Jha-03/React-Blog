import { logout } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
const Logout = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout())
        navigate('/')
    }

    return (
        <button
            onClick={handleLogout}
            className="block w-full text-left text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
            Logout
        </button>
    )
}

export default Logout