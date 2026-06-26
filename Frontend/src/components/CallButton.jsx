import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <div className="p-5 bg-white">
      <button onClick={handleVideoCall} className="btn btn-success btn-sm text-white bg-green-400 hover:bg-green-600">
        <VideoIcon className="size-6" />
      </button>
    </div>
  );
}

export default CallButton;