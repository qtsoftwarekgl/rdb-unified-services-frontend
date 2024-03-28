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
