"use client";

import { useRouter } from "next/navigation";
import BahanForm from "../(component)/form";
import { toast } from "react-toastify";

export default function TambahBahanPage() {
  const router = useRouter();

  async function onSubmit(data: any) {
    let body = data;

    const response = await fetch("http://localhost:3007/bahan/tambah", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    console.log("hasil", response, body);
    if (response.ok) {
      router.push("/admin/bahan");
    } else {
      toast("Error!", { type: "error" });
    }
  }

  return <BahanForm onSubmit={onSubmit} formTitile={"Tambah Bahan"} />;
}
