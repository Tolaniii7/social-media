import { useQuery } from "@tanstack/react-query"
import { supabase } from "../supabase-client";
import { Link } from "react-router-dom";

export interface Community {
        id: number,
        name: string,
        description: string,
        created_at:string;
}

export  const fetchCommunities = async (): Promise<Community[]> => {
    const {error, data} = await supabase
    .from('communities')
    .select('*')
    .order('created_at', {ascending: false})

    if(error) throw new Error(error.message)

        return data as Community[]
 }

const CommunityList = () => {

     const {data, isLoading, error} = useQuery<Community[], Error>({
        queryKey: ['communities'], queryFn: fetchCommunities
     })

     if (isLoading) {
        return <div className="text-center py-4">Loading communities...</div>
     }
     if (error) {
        return <div className="text-center text-red-500 py-4">Error: (error.message)</div>
     }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {data?.map((community, key)=>(
        <div key={key} className="border border-white/10 p-4 rounded hover:-translate-y-1 transition transform">
            <Link className="text-2xl font-bold text-purple-500 hover:underline" to={`/community/${community.id}`}>{community.name}</Link>
            <p className="text-gray-400 mt-2">{community.description}</p>
        </div>
      ))}
    </div>
  )
}

export default CommunityList
