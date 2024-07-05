export const getBase64 = (
  file: File,
  cb: (arg0: string | ArrayBuffer | null) => void
) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    cb(reader.result);
  };
  reader.onerror = function (error) {
    return error;
  };
};

export const convertFileSizeToMbs = (size: number) => {
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};
