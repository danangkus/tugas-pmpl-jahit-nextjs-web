export const genderList = [
  { key: "L", label: "Laki-laki" },
  { key: "P", label: "Perempuan" },
];

export function getBase64(file: File, cb: (b: any) => void) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    cb(reader.result);
  };
  reader.onerror = function (error) {
    console.log("Error: ", error);
  };
}

export const toBase64 = (file: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export function getGenderDesc(code: string) {
  let result = code;
  let filtered = genderList.filter((row) => row.key == code);
  if (filtered.length > 0) {
    result = filtered[0].label;
  }
  return result;
}

export function isEmpty(value: any) {
  let result = false;
  if (["", null, undefined].indexOf(value) != -1) {
    result = true;
  }
  return result;
}
