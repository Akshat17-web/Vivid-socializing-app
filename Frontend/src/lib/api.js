import { axiosInstance } from "./axios";

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser: ", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export async function getUserFriends(){
  const res = await axiosInstance.get("/users/friends");
  return res.data;
}

export async function getRecommendedUsers(){
  const res = await axiosInstance.get("/users/feed");
  return res.data;
}

export async function getOutgoingFriendReqs(){
  const res = await axiosInstance.get("/users/friend-request-sent");
  return res.data;
}

export async function sendFriendRequests(userId){
  const res = await axiosInstance.post(`/users/friend-request/${userId}`);
  return res.data;
}

export async function getFriendRequests(userId){
  const res = await axiosInstance.get("/users/friend-requests");
  return res.data;
}

export async function acceptFriendRequest(requestId){
  const res = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return res.data;
}

export async function getStreamToken() {
  const res = await axiosInstance.get("/chat/token");
  return res.data;
}