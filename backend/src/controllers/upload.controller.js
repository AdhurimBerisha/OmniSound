import cloudinary from "../lib/cloudinary.js";

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error uploading to cloudinary:", error);
    throw new Error("Error uploading to cloudinary");
  }
};

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.files || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload an image file" });
    }

    const imageFile = req.files.imageFile;
    const imageUrl = await uploadToCloudinary(imageFile);

    res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.log("Error in uploadImage:", error);
    next(error);
  }
};
