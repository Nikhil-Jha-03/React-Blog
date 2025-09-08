import React from 'react'
import {Link} from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="border-t bg-black border-gray-800 py-12 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="text-2xl font-bold">
              <span className="text-white">Blog</span>
              <span className="text-gray-400">.</span>
            </div>
            <p className="text-gray-400">Creating stories that matter, one article at a time.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Content</h4>
            <div className="space-y-2 text-gray-400">
              <Link to="/latest-posts" className="block hover:text-white transition-colors">Latest Posts</Link>
              <Link to="/categories" className="block hover:text-white transition-colors">Categories</Link>
              <Link to="/archives" className="block hover:text-white transition-colors">Archives</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <div className="space-y-2 text-gray-400">
              <Link to="/about" className="block hover:text-white transition-colors">About</Link>
              <Link to="/contact" className="block hover:text-white transition-colors">Contact</Link>
              <Link to="/careers" className="block hover:text-white transition-colors">Careers</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <div className="space-y-2 text-gray-400">
              <Link to="/privacy" className="block hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="block hover:text-white transition-colors">Terms</Link>
              <Link to="/cookies" className="block hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Blog. All rights reserved. Developed by Nikhil Jha.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer