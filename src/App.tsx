import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import CreatePostPage from './pages/CreatePostPage'
import PostPage from './pages/PostPage'
import CreateCommunityPage from './pages/CreateCommunityPage'
import CommunitiesPage from './pages/CommunitiesPage'
import CommunityPostPage from './pages/CommunityPostPage'


const App = () => {
  return (
    <div className='min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20'>
      <Navbar />
      <div className='container mx-auto px-4 py-6'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/create' element= {<CreatePostPage/>}/>
          <Route path='/post/:id' element= {<PostPage/>}/>
          <Route path= '/community/create' element ={<CreateCommunityPage />} />
          <Route path = '/communities' element = {<CommunitiesPage />} />
          <Route path = '/community/:id' element = {<CommunityPostPage />} />

        </Routes>
      </div>
    </div>
  )
}

export default App
