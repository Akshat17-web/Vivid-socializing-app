import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon } from "lucide-react";
import { sendFriendRequests } from "../lib/api";
import { getLanguageFlag } from "./FriendCard";
import { capitalize } from "../lib/utils.";

const FeedCard = ({ user, hasRequestBeenSent }) => {
  const queryClient = useQueryClient();

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequests,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });
  return (
    <div className="card bg-base-200 hover:shadow-lg transition-all duration-300">
      <div className="card-body p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="avatar size-16 rounded-full">
            <img src={user.profilePic} alt={user.fullName} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{user.fullName}</h3>

            {user.location && (
              <div className="flex items-center text-xs opacity-70 mt-1">
                <MapPinIcon className="size-3 mr-1" />
                {user.location}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="badge badge-secondary">
            {getLanguageFlag(user.nativeLanguage)}
            Native: {capitalize(user.nativeLanguage)}
          </span>

          <span className="badge badge-outline">
            {getLanguageFlag(user.learningLanguage)}
            Learning: {capitalize(user.learningLanguage)}
          </span>
        </div>

        {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

        <button
          className={`btn w-full mt-2 ${
            hasRequestBeenSent ? "btn-disabled" : "btn-primary"
          }`}
          onClick={() => sendRequestMutation(user._id)}
          disabled={hasRequestBeenSent || isPending}
        >
          {hasRequestBeenSent ? (
            <>
              <CheckCircleIcon className="size-4 mr-2" />
              Request Sent
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
