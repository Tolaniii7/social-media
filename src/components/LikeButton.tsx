import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../contest/AuthContext";

interface Props {
    postId: number;
}

interface Vote {
  id: number ;
  post_id: number;
  user_id: string;
  like: number;
}


// inserting votes in the vote table 

const vote = async (voteValue: number, postId: number , userId: string ) => {

  const {data: existingVote} = await supabase
  .from('votes')
  .select('*')
  .eq('post_id', postId)
  .eq('user_id', userId)
  .maybeSingle()

  if(existingVote){
    
    if(existingVote.like === voteValue){
     const {error} = await supabase
    .from('votes').delete().eq('id', existingVote.id)
    if(error) throw new Error (error.message)
    } else {
     const {error} = await supabase
      .from('votes')
      .update({like: voteValue})
      .eq('id', existingVote.id)
      if(error) throw new Error (error.message)
    }
  } else {
     const {error} = await supabase
    .from('votes')
    .insert({post_id: postId, user_id: userId, like: voteValue})
    if(error) throw new Error(error.message)
  }
}

const fetchVotes = async (postId: number): Promise<Vote[]> =>{

  const {data, error} = await supabase.from('votes').select('*').eq('post_id', postId)

    if(error) throw new Error(error.message)


  return data as  Vote[]
}

const LikeButton = ({postId}:Props) => {


  // getting userId from useAuth hook 

    const {user} = useAuth()

    const queryClient = useQueryClient();

     const {data: votes, isLoading, isError} = useQuery <Vote[], Error>({
      queryKey: ['votes', postId],
      queryFn:()=> fetchVotes(postId),

      refetchInterval: 5000,
    })
    
    const {mutate}= useMutation({
      mutationFn:(voteValue: number)=> {

        if(!user) {
           throw new Error('you must be logged in to vote')
        }

       return vote(voteValue, postId, user!.id)
      }, 

      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['votes', postId]})
      }
    })

    if(isLoading) return <div>Loading posts...</div>
    if(isError) return  <div>Error:(error.message)</div>
 
    const likes = votes?.filter((v)=> v.like === 1).length 
    const dislikes = votes?.filter((v)=>v.like === -1).length
    const userVote = votes?.find((v)=> v.user_id === user?.id)?.like;


  return (
    <div className="mt-2">
      <button onClick={()=> mutate(1)} className= {`px-3 py-1 cursor-pointer rounded transition-colors duration-150
         ${userVote === 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'}`}>👍{likes}</button>

      <button onClick={()=> mutate(-1)}  className= {`px-3 py-1 cursor-pointer ml-2 rounded transition-colors duration-150
         ${userVote === -1 ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'}`}>👎{dislikes}</button>

    </div>
  )
}

export default LikeButton
