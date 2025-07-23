import { useState, type ChangeEvent } from "react"
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../contest/AuthContext";
import { fetchCommunities, type Community } from "./CommunityList";


interface PostInput {
    title: string;
    content: string;
    avatar_url: string | null;
    community_id: number | null;
}

const createPost = async (post: PostInput , imageFile: File)=>{

    const filePath = `${post.title} - ${Date.now()} - ${imageFile.name}`

    const {error: uploadError} = await supabase.storage.from('post-images').upload(filePath, imageFile)

    if (uploadError) throw new Error(uploadError.message)

    const {data: publicUrlData} = supabase.storage.from('post-images').getPublicUrl(filePath)

    const {data, error } = await supabase.from('posts').insert({...post, image_url:publicUrlData.publicUrl})


    if (error) throw new Error(error.message)

    return data;
}


const CreatePost = () => {
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState< File | null>(null)
    const [communityId, setCommunityId] = useState<number | null >(null)

    const {user} = useAuth();

    const {data: communities} = useQuery<Community[], Error>({
       queryKey: ['communities'], queryFn: fetchCommunities
    })

    const {mutate , isError, isPending} = useMutation({
        mutationFn: (data: { post: PostInput; imageFile : File})=>{
            return createPost(data.post, data.imageFile)
        } })

    const handleSubmit = (event: React.FormEvent)=> {
        event.preventDefault();
        if(!selectedFile) return;

        mutate({post: {title, content, avatar_url: user?.user_metadata.avatar_url || null, community_id: communityId}, imageFile: selectedFile})
    }

    const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        setCommunityId(value ? Number(value) : null)
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>)  => { 
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
        <div>
            <label className="block mb-2 font-medium">Title</label>
            <input type="text" id="title" required onChange={(e)=>setTitle(e.target.value)} className="w-full border border-white/10 bg-transparent p-2 rounded"/>
        </div>

        <div>
            <label htmlFor="content" className="block mb-2 font-medium">Content</label>
            <textarea onChange={(e)=>setContent(e.target.value)} id="content" rows={5} required className="w-full border border-white/10 bg-transparent p-2 rounded"/>
        </div>

        <div>
            <label className=" mb-2 font-medium"> select community</label>
            <select id="community" className="w-full border border-white/10 bg-transparent p-2 rounded" onChange= {handleCommunityChange}>
                <option value='' className="bg-blue-950">== choose a community ==</option>
                {communities?.map((community, key)=> (
                    <option className="bg-blue-950" key={key} value= {community.id}>
                        {community.name}
                    </option>
                ))}
            </select>
        </div>

        <div>
            <label className="block mb-2 font-medium">Upload image</label>
            <input type="file" id="image" accept="image/*" onChange={handleFileChange} className="w-full text-gray-200" required/>
        </div>


        <button className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer" type="submit">
            {isPending ? 'Creating...' : 'Create post' }
        </button>

        {isError && <p className="text-red-500">Error creating post</p>}
    </form>
  )
}

export default CreatePost;
