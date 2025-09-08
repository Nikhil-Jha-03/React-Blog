import { useEffect, useState } from 'react'
import { Menu, X, User } from 'lucide-react'
import NavLinkComponent from './NavLinkComponent'
import UserInfo from './UserInfo'

const NavBar = () => {
  const [scrollY, setScrollY] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUser, setShowUser] = useState(false)

  const [user, setUser] = useState({
    isLoggedIn: false,
    name: "Nikhil Jha",
    email: "jhanikhil2083@gmail.com",
    username: "nikhil",
    avatar: "https://unsplash.com/photos/a-black-and-white-photo-of-a-network-of-dots-nv3Z-1Nsd3g",
    isVerified: true,
    bio: "Web developer passionate about backend & full-stack.",
    totalPosts: 25,
    totalLikes: 120,
    totalViews: 5400,
    followers: 300,
    joinDate: "2024-01-15",
    location: "Pune, India",
    website: "https://myportfolio.com",
    socialLinks: {
      twitter: "https://twitter.com/nikhil",
      github: "https://github.com/nikhil",
      linkedin: "https://linkedin.com/in/nikhil"
    }
  });


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
              <div className="relative">
                <button
                  onClick={() => setShowUser((prev) => !prev)}
                  className="p-2 rounded-full hover:bg-gray-800 transition"
                >
                  <User size={20} className="text-white" />
                </button>


                {showUser && user?.isLoggedIn && (
                  <UserInfo user={user} className={'absolute top-12 right-0 z-10'} />
                )}


                {showUser && !user?.isLoggedIn && (
                  <button className="w-40 bg-black text-white font-medium py-2 px-4 rounded-2xl absolute top-12 right-0 z-10 shadow-lg border border-gray-600hover:bg-white hover:text-black hover:bg-white transition-all duration-200">
                    Please Login
                  </button>

                )}
              </div>
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

              {user.isLoggedIn ? (
                <UserInfo user={user} />
              ) : (
                <div className="border-t border-gray-700 pt-4 mt-4 space-y-3">
                  <button className="w-full bg-white text-black py-3 rounded-2xl  hover:bg-gray-200  font-bold hover:text-white transition-colors">
                    Login
                  </button>
                  <button className="w-full bg-white text-black py-3 rounded-2xl  hover:bg-gray-200  font-bold">
                    Sign Up
                  </button>
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



