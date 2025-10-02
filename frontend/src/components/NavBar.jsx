import { useEffect, useState, useRef } from 'react'
import { Menu, X, User } from 'lucide-react'
import NavLinkComponent from './NavLinkComponent'
import UserInfo from './UserInfo'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getCurrentUser } from '../features/user/userSlice'

const NavBar = () => {
  const [scrollY, setScrollY] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch();


  const auth = useSelector(state => state.auth) || {};

  const navRef = useRef(null);
  const profileRef = useRef(null);

  // Close navbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target) && profileRef.current && !profileRef.current.contains(event.target)) {
        setShowUser(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (auth.isLoggedIn) {
      dispatch(getCurrentUser(auth.token))
    }
  }, [auth, dispatch])

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setScrollY(prev => (prev !== scrolled ? scrolled : prev));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (


    <div className="min-h-20 bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full bg-black z-50 transition-all duration-300 ${scrollY ? 'bg-black/80 backdrop-blur-lg border-b border-gray-800' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 ">
          <div className="flex justify-between items-center h-20 relative">
            <div className="text-2xl font-bold tracking-tight">
              <span className="text-white">Blog</span>
              <span className="text-gray-400">.</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 ">
              <NavLinkComponent to={'/'} name={"Home"} />
              <NavLinkComponent to={'/blog'} name={"Blog"} />
              <NavLinkComponent to={'/about'} name={"About"} />

              {auth.isLoggedIn ? (<div className="relative">
                <button
                ref={profileRef}
                  onClick={() => setShowUser((prev) => !prev)}
                  className="p-2 rounded-full hover:bg-gray-800 transition"
                >
                  <User size={20} className="text-white" />
                </button>


                {showUser && auth.isLoggedIn && (
                  <UserInfo ref={navRef} className={'absolute top-12 right-0 z-10'} />
                )}

              </div>) : (<Link to={"/auth"} className="bg-white text-black px-4 py-1 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 hover:scale-105">
                Please Login
              </Link>)}


            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className=" md:hidden bg-black border-t border-gray-800">
            <div className="px-6 py-4 space-y-4 flex flex-col">
              <NavLinkComponent to={'/'} name={"Home"} />
              <NavLinkComponent to={'/blog'} name={"Blog"} />
              <NavLinkComponent to={'/about'} name={"About"} />

              {auth.isLoggedIn ? (
                <UserInfo />
              ) : (
                <div className="border-t border-gray-700 pt-4 mt-4 space-y-3">
                  <Link to={'/auth'} className='w-full bg-white text-black py-3 rounded-2xl  hover:bg-gray-200  font-bold hover:text-white transition-colors'>Login</Link>

                  <Link to={'/auth'} className='w-full bg-white text-black py-3 rounded-2xl  hover:bg-gray-200  font-bold hover:text-white transition-colors'>Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

export default NavBar



