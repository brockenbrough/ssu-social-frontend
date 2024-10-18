import axios from "axios";

const defaultProfileImageUrl = "https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png";

export const fetchProfileImage = async (username) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/getProfileImage/${username}`
    );

    if (response.data.imageUri) {
      const imageUri = response.data.imageUri;

      // Only use the default profile image if S3 returns a 404 or the image is not valid
      const imageExists = await axios
        .get(imageUri)
        .then(() => true)
        .catch(() => false);

      return imageExists ? imageUri : defaultProfileImageUrl;
    } else {
      return defaultProfileImageUrl; // Use default if no imageUri is found
    }
  } catch (error) {
    console.error("Error fetching profile image:", error);
    return defaultProfileImageUrl; // Use default in case of error
  }
};
