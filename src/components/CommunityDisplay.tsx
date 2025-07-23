import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import PostItem from "./PostItem";

interface Props {
    communityId : number ;
}

interface Post {
  id: number;
  title: string;
  created_at: string;
  content: string;
  image_url: string;
  avatar_url?: string
  like_count?: number;
  comment_count?: number;
}

interface PostWithCommunity extends Post {
  communities: {
     name: string
  }
}


const fetchCommunityPost = async (communityId: number): Promise<PostWithCommunity[]> => {
    const {error, data} = await supabase
    .from('posts')
    .select('*, communities(name)')
    .eq('community_id', communityId)
    .order('created_at', {ascending: false})

    if(error) throw new Error(error.message)

        return data as PostWithCommunity[]
 }


const CommunityDisplay = ({communityId} : Props) => {

    const {data, isLoading, error} = useQuery<PostWithCommunity[], Error>({

           queryKey: ['communityPost', communityId],
           queryFn:()=> fetchCommunityPost(communityId),

    })

        if (isLoading) {
           return <div className="text-center py-4">Loading communities...</div>
        }
        if (error) {
           return <div className="text-center text-red-500 py-4">Error: {error.message}</div>
        }

  return (
    <div>
        <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            {data && data[0].communities.name}Community post
        </h2>

        {data && data.length > 0 ? (
          <div className="flex flex-wrap gap-6 justify-center">
                {data.map((post, key)=>(<PostItem key={key} post={post}/>))}
          </div>
           ):(
         <p className="text-center text-gray-500">No posts in this community</p>)
        } 
    </div>
  )
}

export default CommunityDisplay
