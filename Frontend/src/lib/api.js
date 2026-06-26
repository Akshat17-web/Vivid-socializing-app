import { axiosInstance } from "./axios";

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser: ", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/onboarding", userData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/login", loginData);
  return response.data;
};

export async function getUserFriends(){
  const res = await axiosInstance.get("/friends");
  return res.data;
}

export async function getRecommendedUsers(){
  const res = await axiosInstance.get("/feed");
  return res.data;
}

export async function getOutgoingFriendReqs(){
  const res = await axiosInstance.get("/friend-request-sent");
  return res.data;
}

export async function sendFriendRequests(userId){
  const res = await axiosInstance.post(`/friend-request/${userId}`);
  return res.data;
}

export async function getFriendRequests(userId){
  const res = await axiosInstance.get("/friend-requests");
  return res.data;
}

export async function acceptFriendRequest(requestId){
  const res = await axiosInstance.put(`/friend-request/${requestId}/accept`);
  return res.data;
}

export async function getStreamToken() {
  const res = await axiosInstance.get("/chat/token");
  return res.data;
}