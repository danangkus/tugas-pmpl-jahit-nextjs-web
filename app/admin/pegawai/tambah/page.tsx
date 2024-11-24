"use client";

import { useRouter } from "next/navigation";
import PegawaiForm from "../(component)/form";
import { toast } from "react-toastify";

export default function TambahPegawaiPage() {
  const router = useRouter();

  async function onSubmit(data: any) {
    let body = data;

    const response = await fetch("http://localhost:3007/pegawai/tambah", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    console.log("hasil", response, body);
    if (response.ok) {
      router.push("/admin/pegawai");
    } else {
      toast("Error!", { type: "error" });
    }
  }

  return <PegawaiForm onSubmit={onSubmit} formTitile={"Tambah Pegawai"} />;
}
