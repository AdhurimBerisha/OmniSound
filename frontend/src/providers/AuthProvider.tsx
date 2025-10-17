import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus } = useAuthStore();
  const { initSocket, disconnectSocket } = useChatStore();
  const { fetchLikedSongs } = useMusicStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);
        if (token) {
          await checkAdminStatus();
          await fetchLikedSongs();

          if (userId) initSocket(userId);
        }
      } catch (error) {
        updateApiToken(null);
        console.log("Error in auth provider");
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => disconnectSocket();
  }, [
    getToken,
    userId,
    checkAdminStatus,
    initSocket,
    disconnectSocket,
    fetchLikedSongs,
  ]);

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-emerald-50 animate-spin" />
      </div>
    );

  return <>{children}</>;
};
export default AuthProvider;
