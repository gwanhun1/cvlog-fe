import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { EDITOR_CONSTANTS, EDITOR_PATHS, ERROR_MESSAGES } from 'lib/constants';
import LocalStorage from 'public/utils/Localstorage';
import { handleMutateErrors } from 'service/api/login';
import { ErrorResponse } from 'service/api/login/type';

const IMAGE_OPTIONS = EDITOR_CONSTANTS.IMAGE_COMPRESSION;

export const useImageUpload = () => {
  const uploadImage = async (file: File, signal?: AbortSignal) => {
    try {
      const resizedImage = await imageCompression(file, IMAGE_OPTIONS);
      const formData = new FormData();
      formData.append('file', resizedImage, resizedImage.name);

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: `Bearer ${LocalStorage.getItem('LogmeToken')}`,
        },
        signal,
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
      const error = errorRe as any;
      if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') {
        throw new Error('IMAGE_UPLOAD_CANCELED');
      }

      const apiError = errorRe as ErrorResponse;
      if (apiError.response?.status === 401) {
        handleMutateErrors(apiError);
      }
      throw new Error(ERROR_MESSAGES.IMAGE_UPLOAD_FAILED);
    }
  };

  return { uploadImage };
};
