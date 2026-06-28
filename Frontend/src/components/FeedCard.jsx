import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon } from "lucide-react";
import { sendFriendRequests } from "../lib/api";
import { getLanguageFlag, capitalize } from "../lib/utils";

const FeedCard = ({ user, hasRequestBeenSent }) => {
  const queryClient = useQueryClient();

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequests,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });
  return (
    <div className="card bg-base-200/40 backdrop-blur-md border border-base-content/10 shadow-sm hover:shadow-xl hover:scale-[1.02] hover:border-primary/30 transition-all duration-300 ease-out">
      <div className="card-body p-5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="avatar size-16 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100">
            <img src={user.profilePic} alt={user.fullName} className="rounded-full" />
          </div>
          <div>
            <h3 className="font-bold text-lg tracking-tight text-base-content">{user.fullName}</h3>

            {user.location && (
              <div className="flex items-center text-xs opacity-75 mt-1 text-base-content/80">
                <MapPinIcon className="size-3.5 mr-1 text-primary animate-pulse" />
                {user.location}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="badge bg-secondary/15 text-secondary border border-secondary/25 font-semibold px-2.5 py-1 text-xs flex items-center gap-1">
            {getLanguageFlag(user.nativeLanguage)}
            Native: {capitalize(user.nativeLanguage)}
          </span>

          <span className="badge bg-primary/10 text-primary border border-primary/25 font-semibold px-2.5 py-1 text-xs flex items-center gap-1">
            {getLanguageFlag(user.learningLanguage)}
            Learning: {capitalize(user.learningLanguage)}
          </span>
        </div>

        {user.bio && <p className="text-sm text-base-content/75 line-clamp-2 leading-relaxed">{user.bio}</p>}

        <button
          className={`btn w-full mt-2 transition-all duration-200 active:scale-[0.98] ${
            hasRequestBeenSent 
              ? "btn-success bg-success/15 border-success/30 text-success cursor-not-allowed" 
              : "btn-primary shadow-sm hover:shadow-md hover:bg-primary-focus"
          }`}
          onClick={() => sendRequestMutation(user._id)}
          disabled={hasRequestBeenSent || isPending}
        >
          {hasRequestBeenSent ? (
            <>
              <CheckCircleIcon className="size-4 mr-2" />
              Request Sent
            </>
          ) : isPending ? (
            <>
              <span className="loading loading-spinner loading-xs mr-2"></span>
              Sending...
            </>
          ) : (
            <>
              <UserPlusIcon className="size-4 mr-2" />
              Send Friend Request
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FeedCard;
