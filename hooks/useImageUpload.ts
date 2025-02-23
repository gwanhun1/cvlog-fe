import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { EDITOR_CONSTANTS, EDITOR_PATHS, ERROR_MESSAGES } from 'lib/constants';
import LocalStorage from 'public/utils/Localstorage';
import { ErrorResponse, handleMutateErrors } from 'service/api/login';

const IMAGE_OPTIONS = EDITOR_CONSTANTS.IMAGE_COMPRESSION;

export const useImageUpload = () => {
  const uploadImage = async (file: File) => {
    try {
      const resizedImage = await imageCompression(file, IMAGE_OPTIONS);
      const formData = new FormData();
      formData.append('file', resizedImage, resizedImage.name);

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: `Bearer ${LocalStorage.getItem('CVtoken')}`,
        },
      };

      const { data } = await axios.post(
        EDITOR_PATHS.UPLOAD_ENDPOINT,
        formData,
        config
      );

      return {
        url: data.data.url,
        name: data.data.name,
      };
    } catch (errorRe) {
      const error = errorRe as ErrorResponse;
      if (error.response?.status === 401) {
        handleMutateErrors(error);
      }
      throw new Error(ERROR_MESSAGES.IMAGE_UPLOAD_FAILED);
    }
  };

  return { uploadImage };
};
