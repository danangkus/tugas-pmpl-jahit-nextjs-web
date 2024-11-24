import { useTheme } from "next-themes";
import { toast } from "react-toastify";

export function showError(message: string) {
  const { theme } = useTheme();
  toast(message, { type: "error", theme });
}
