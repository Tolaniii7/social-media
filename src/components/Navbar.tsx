import { Link } from 'react-router-dom'
import menu from '../assets/menu.svg';
import close from '../assets/close.svg'
import {  useState } from 'react';
import { useAuth } from '../contest/AuthContext';


const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)

    const {signInWithGithub, signOut, user} = useAuth();

    // getting username after authentication from the user object
    const displayname = user?.user_metadata.user_name || user?.email;


  return (
    <nav className='fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg '>
      <div className='max-w-5xl mx-auto px-4'>
            <div className='flex justify-between items-center h-16'>
                <Link to={'/'} className='font-mono text-xl font-bold text-white'>
                    forum<span className='text-purple-500'>.app</span>
                </Link>

                {/* desktop links */}
                <div className= 'hidden md:flex items-center space-x-8'>
                    <Link to={'/'} className='text-gray-300 hover:text-white transition-colors'>Home</Link>
                    <Link to={'/create'} className='text-gray-300 hover:text-white transition-colors'>Create post</Link>
                    <Link to={'/communities'} className='text-gray-300 hover:text-white transition-colors'>Communities</Link>
                    <Link to={'/community/create'} className='text-gray-300 hover:text-white transition-colors'>Create Community</Link>
                </div>

                {/* {desktop auth} */}

                <div className='hidden md:flex items-center'>
                     {user ? (
                         <div className='flex items-center space-x-4'>
                            {user.user_metadata.avatar_url && 
                                (<img src={user.user_metadata.avatar_url} className='w-8 h-8 rounded-full object-cover' alt='user-avatar'/>)}
                            <span className='text-gray-300'>{displayname}</span> 
                            <button className='bg-red-500 px-3 py-1 rounded' onClick={signOut}> signOut</button>
                         </div> )
                        :(
                        <button onClick={signInWithGithub} className='bg-blue-500 px-3 py-1 rounded'> sign in with github</button> 
                        )}
                </div>

                 {/* Mobile links */}
                <div className='md:hidden'>
                    <button className='text-gray-300 focus:outline-none' onClick={()=> setMenuOpen((prev) => !prev)}>
                        {menuOpen ? <img src={close} /> : <img src={menu} />}
                    </button>
                </div>
            </div>
         </div>

                { menuOpen &&
                <div className='md:hidden bg-[rgba(10,10,10,0.9)]'>
                   <div className='px-2 pt-2 pb-3 space-y-1 text-right'>
                       <Link to={'/'} className='block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700'>Home</Link>
                       <Link to={'/create'} className='block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700'>Create post</Link>
                       <Link to={'/communities'} className='block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700'>Communities</Link>
                       <Link to={'/community/create'} className='block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700'>Create Community</Link>
                    </div>
                </div>
                }
    </nav>
  )
}

export default Navbar
