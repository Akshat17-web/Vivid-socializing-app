import { Link } from "react-router-dom";
import { getLanguageFlag, capitalize } from "../lib/utils";

const FriendCard = ({ friend }) => {
  console.log(friend.profilePic);
  return (
    <div className="card bg-base-200/40 backdrop-blur-md border border-base-content/10 shadow-sm hover:shadow-lg hover:scale-[1.02] hover:border-primary/20 transition-all duration-300 ease-out">
      <div className="card-body p-4 space-y-2">
        {/* USER INFO */}
        <div className="flex items-center gap-3">
          <div className="avatar size-12 rounded-full ring-2 ring-primary/15 ring-offset-1 ring-offset-base-100">
            <img src={friend.profilePic} alt={friend.fullName} className="rounded-full" />
          </div>
          <h3 className="font-bold truncate text-base-content tracking-tight">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="badge bg-secondary/15 text-secondary border border-secondary/25 font-semibold px-2.5 py-0.5 text-xs flex items-center gap-1">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {capitalize(friend.nativeLanguage)}
          </span>

          <span className="badge bg-primary/10 text-primary border border-primary/25 font-semibold px-2.5 py-0.5 text-xs flex items-center gap-1">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {capitalize(friend.learningLanguage)}
          </span>
        </div>
        <Link to={`/chat/${friend._id}`} className="btn btn-primary btn-outline btn-sm w-full mt-2 transition-all duration-200 active:scale-[0.98]">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;
