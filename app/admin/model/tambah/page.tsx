"use client";

import { useRouter } from "next/navigation";
import ModelForm from "../(component)/form";
import { toast } from "react-toastify";

export default function TambahModelPage() {
  const router = useRouter();

  async function onSubmit(data: any) {
    let body = data;

    const response = await fetch("http://localhost:3007/model/tambah", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    console.log("hasil", response, body);
    if (response.ok) {
      router.push("/admin/model");
    } else {
      toast("Error!", { type: "error" });
    }
  }

  return <ModelForm onSubmit={onSubmit} formTitile={"Tambah Model"} />;
}
