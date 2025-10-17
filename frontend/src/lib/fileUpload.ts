import { axiosInstance } from "./axios";

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("imageFile", file);

  const response = await axiosInstance.post("/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.url;
};
