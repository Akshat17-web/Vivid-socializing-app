import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
// import { completeOnboarding } from "../lib/api";
import { Globe, LoaderIcon, MapPin, ShipWheel, ShipWheelIcon, Shuffle, User } from "lucide-react";
import { LANGUAGES } from "../constants";
import { axiosInstance } from "../lib/axios";

const OnBoarding = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
    const response = await axiosInstance.post("/auth/onboarding", formState);
    return response.data;
    },

    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
    },

    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatarapi.runflare.run/public/${idx}.png`;
    setFormState({...formState, profilePic: randomAvatar});
    toast.success("Avatar changed successfully");
  };
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4 py-8"
    data-theme="forest">
      <div className="w-full max-w-2xl">
        <div className="card bg-base-100 shadow-2xl rounded-3xl">
          <div className="card-body p-5 sm:p-8 md:p-10">
            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold">
                Complete Your Profile
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-4">
                <div className="avatar">
                  <div className="w-24 sm:w-28 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                    <img
                      src={
                        formState.profilePic ||
                        "https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
                      }
                      alt="profile"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-accent"
                  onClick={handleRandomAvatar}
                >
                  <Shuffle size={18} />
                  Generate Random Avatar
                </button>
              </div>

              {/* Full Name */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>

                <label className="input input-bordered flex items-center gap-2 w-full">
                  <User size={18} />
                  <input
                    type="text"
                    className="grow"
                    placeholder="John Doe"
                    value={formState.fullName}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        fullName: e.target.value,
                      })
                    }
                  />
                </label>
              </div>

              {/* Bio */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>

                <textarea
                  className="textarea textarea-bordered w-full h-20"
                  placeholder="Tell others about yourself and your language learning goals"
                  value={formState.bio}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      bio: e.target.value,
                    })
                  }
                />
              </div>

              {/* Languages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Native Language</span>
                  </label>

                  <select
                    className="select select-bordered w-full"
                    value={formState.nativeLanguage}
                    onChange={(e) =>
                      setFormState({...formState, nativeLanguage: e.target.value,})}
                  >
                    <option value="">Select your native language</option>

                    {LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Learning Language</span>
                  </label>

                  <select
                    className="select select-bordered w-full"
                    value={formState.learningLanguage}
                    onChange={(e) =>
                      setFormState({...formState,
                        learningLanguage: e.target.value,})}
                  >
                    <option value="">Select language you're learning</option>

                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>

                <label className="input input-bordered flex items-center gap-2 w-full">
                  <MapPin size={18} />
                  <input
                    type="text"
                    className="grow"
                    placeholder="City, Country"
                    value={formState.location}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        location: e.target.value,
                      })
                    }
                  />
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="btn btn-success w-full rounded-full text-sm sm:text-base"
              >

                {!isPending ? (
                  <>
                  <ShipWheelIcon className="size-5 mr-2"/>
                  Complete Onboarding
                  </>
                ):(
                  <>
                  <LoaderIcon className="animate-spin size-5 mr-2"/>
                  Onboarding...
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnBoarding;
