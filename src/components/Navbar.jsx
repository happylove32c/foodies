import React from 'react'
import logo from '../assets/logo.svg'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
        <div className="bg-yellow-light fixed top-0 z-50 w-full p-4 flex justify-between items-center ">
            <div className="image">
                <Link to='/'>
                    <img src={logo} alt="" className="h-12" />
                </Link>
            </div>

            <div className="links flex flex-row items-center justify-center gap-3 ">
                <Link to='/menu' className='text-red hover:text-red-dark text-xl' >Menu</Link>
                <Link to='/dashboard' className='text-red hover:text-red-dark text-xl' >Sign In</Link>
            </div>
        </div>
    </div>
  )
}

export default Navbar
