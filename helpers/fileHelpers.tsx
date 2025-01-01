export async function downloadBase64(base64Data: string, filename: string) {
  const base64 = await fetch(`${base64Data}`);
  let blob = await base64.blob();
  downloadBlob(blob, filename);
}

export async function downloadBlob(blob: Blob, name = "file.txt") {
  // For other browsers:
  // Create a link pointing to the ObjectURL containing the blob.
  const data = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = data;
  link.download = name;

  // this is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(data);
    link.remove();
  }, 100);
}
