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
