import axios from "axios";

const defaultProfileImageUrl =
  "https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png";

export const fetchProfileImage = async (username) => {
  if (!username) return defaultProfileImageUrl;

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/getProfileImage/${username}`
    );

    if (response.data.imageUri) {
      const imageUri = response.data.imageUri;

      const imageExists = await axios
        .get(imageUri)
        .then(() => true)
        .catch(() => false);

      return imageExists ? imageUri : defaultProfileImageUrl;
    } else {
      return defaultProfileImageUrl;
    }
  } catch (error) {
    return defaultProfileImageUrl;
  }
};
