import { useState } from 'react';
import { useAuth } from '../contest/AuthContext';
import { supabase } from '../supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';


interface Comment {
    id: number;
    post_Id: number ;
    parent_comment_id: number| null;
    content: string;
    user_id: string;
    created_at: string;
    author: string;
}

interface Props {
    comment: Comment & {
    children?: Comment[];
    };
    postId: number;

}

const createReply = async (replyContent: string, postId: number, parentCommentId: number, userId: string, author: string) => {
       if(!userId || !author) {
         throw new Error ('You must be logged in to comment')
       }


      const {error} = await supabase.from('comments').insert({
          post_id: postId,
          content: replyContent,
          parent_comment_id: parentCommentId,
          user_id:userId,
          author: author,
      })

      if(error) throw new Error(error.message)
}


const CommentItem = ({comment, postId}: Props) => {
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('')
  const [showReplies, setShowReplies] = useState<boolean>(false)

  const {user} = useAuth()
  const queryClient = useQueryClient()


  const {mutate, isPending, isError} = useMutation({
    mutationFn: (replyContent: string) => createReply(
        replyContent,
        postId,
        comment.id,
        user!.id,
        user?.user_metadata?.user_name
    ),
    onSuccess: ()=>{
        queryClient.invalidateQueries({queryKey: ['comments', postId]})
        setReplyText("");
        setShowReplyForm(false)

    }
  })

  const handleReplySubmit = (e: React.FormEvent)=>{
      e.preventDefault();
      if (!replyText ) return ;
      mutate(replyText)
  }

  
  return (
    <div className='pl-4 border-l border-white/10'>
      <div className='mb-2'>

        <div className='flex items-center space-x-2'> 
          {/* display commenters username */}
          <span className='text-sm font-bold text-blue-400'>{comment.author}</span>
          <span className=' text-xs text-gray-500'>{new Date(comment.created_at).toLocaleDateString()}</span>
        </div>

          <p className='text-gray-300'>{comment.content}</p>

          <button className='text-blue-500 text-sm mt-1' onClick={()=>setShowReplyForm((prev) => !prev) }>
            {showReplyForm ? 'Cancel' : 'Reply'}
          </button>

      </div>

       {showReplyForm && user && (
        <form onSubmit={handleReplySubmit} className="mb-2 ">
          <textarea className="w-full border border-white/10 bg-transparent p-2 rounded"
            rows={2}
            onChange={((e)=>setReplyText(e.target.value))}
            placeholder="write a reply..."
            value = {replyText} />
          <button type = "submit" disabled = {!replyText} className="mt-2 bg-purple-500 text-white px-4 py-2 rounded cursor-pointer">
               {isPending ? 'Posting...' : 'post reply'}
          </button>
          {isError && <p className="text-red-500 mt-2"> Error posting reply </p>}
        </form>
       )}

       {comment.children && comment.children.length > 0 && (
          <div className='space-y-2'>
            <button onClick={()=> setShowReplies((prev)=> !prev)} className="mt-2 bg-purple-400 text-sm text-white px-2 py-2 rounded cursor-pointer"> 
             {showReplies ? 'Hide Replies' : 'Show Replies'} 
            </button>

            {showReplies && (
              <div>
                {comment.children.map((child)=> (
                  <CommentItem  comment= {child} postId = {postId}/>
                ))}
              </div>
            )}
          </div>
       )}
    </div>
  )
}

export default CommentItem
