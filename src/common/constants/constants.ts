export const INJECTION_TOKEN = {
  CLOUDINARY_CONFIG: "CLOUDINARY_CONFIG",
  GOOGLE_CONFIG: "GOOGLE_CONFIG",
} as const;

export const CLOUDINARY_CONFIG = {
  UPLOAD_PRESETS: {
    AVATAR: "pinpin_avatars",
  },
  FOLDER_NAME: {
    AVATAR: "Avatar",
  },
};

export const GOOGLE_API_URL = {
  TEXT_SEARCH: "https://places.googleapis.com/v1/places:searchText",
};
