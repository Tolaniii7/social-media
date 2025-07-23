import { useParams } from "react-router-dom";
import CommunityDisplay from "../components/CommunityDisplay";

const CommunityPostPage = () => {

  const { id } = useParams<{id: string }>()


  return (
    <div className="pt-20">
      <CommunityDisplay communityId={Number(id)}/>
    </div>
  )
}

export default CommunityPostPage;
