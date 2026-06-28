import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { StreamChat } from "stream-chat";
import ChatLoader from "../components/ChatLoader";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageComposer,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import CallButton from "../components/CallButton";
import "stream-chat-react/dist/css/index.css";
import toast from "react-hot-toast";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // This will run only when authUser is available
  });

  useEffect(() => {
    // 1. Move getInstance outside the init logic so we can access it in the cleanup function
    const client = StreamChat.getInstance(STREAM_API_KEY);
    let isMounted = true; 

    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;
      
      try {
        console.log("Initializing stream chat client...");

        // 2. Check if the user is already connected to avoid the "called twice" error
        if (client.userID === authUser._id) {
          console.log("User already connected.");
        } else {
          // If a different user happens to be connected, disconnect them first
          if (client.userID) {
            await client.disconnectUser();
          }
          
          // Proceed with standard connection
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePic,
            },
            tokenData.token,
          );
        }

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });
        
        await currChannel.watch();

        // 3. Only update state if the component is still mounted
        if (isMounted) {
          setChatClient(client);
          setChannel(currChannel);
        }
      } catch (err) {
        console.error("Error initializing chat: ", err);
        if (isMounted) toast.error("Could not connect to chat. Please try again!");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initChat();

    // 4. Cleanup function to handle React Strict Mode unmounting
    return () => {
      isMounted = false;
      if (client.userID) {
        client.disconnectUser();
      }
    };
  }, [tokenData, authUser, targetUserId]); // Added targetUserId to dependency array

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      console.log("clicked");
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
      toast.success("Video call link sent successfully!");
    }
  };
  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[95vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <Window>
              <div className="flex items-center justify-between border-b">
                <div className="flex-1">
                  <ChannelHeader />
                </div>
                <CallButton handleVideoCall={handleVideoCall} />
              </div>
              <MessageList />
              <MessageComposer />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;
