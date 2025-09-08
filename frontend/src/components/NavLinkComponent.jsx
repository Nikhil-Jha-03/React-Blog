import React from 'react'
import { NavLink } from 'react-router-dom'
const NavLinkComponent = ({to,name}) => {
    return (
        <NavLink to={`${to}`} className={({ isActive }) =>
            isActive ? "text-white font-semibold underline underline-offset-4 transition duration-200" : "text-gray-300 hover:text-white transition-colors duration-200"
        }>{name}</NavLink>
    )
}

export default React.memo(NavLinkComponent)