"use client";

import { useRouter } from "next/navigation";
import PesananForm from "../(component)/form";
import { toast } from "react-toastify";

export default function TambahPesananPage() {
  const router = useRouter();

  async function onSubmit(data: any) {
    let body = data;

    const response = await fetch("http://localhost:3007/pesanan/tambah", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    console.log("hasil", response, body);
    if (response.ok) {
      router.push("/admin/pesanan");
    } else {
      toast("Error!", { type: "error" });
    }
  }

  return <PesananForm onSubmit={onSubmit} formTitile={"Tambah Pesanan"} />;
}
