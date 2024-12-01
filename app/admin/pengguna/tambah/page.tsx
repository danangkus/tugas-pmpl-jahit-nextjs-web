"use client";

import { useRouter } from "next/navigation";
import PenggunaForm from "../(component)/form";
import { toast } from "react-toastify";
import { API_HOST } from "@/helpers/envHelpers";

export default function TambahPenggunaPage() {
  const router = useRouter();

  async function onSubmit(data: any) {
    let body = data;

    const response = await fetch(API_HOST + "/pengguna/tambah", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    console.log("hasil", response, body);
    if (response.ok) {
      router.push("/admin/pengguna");
    } else {
      toast("Error!", { type: "error" });
    }
  }

  return <PenggunaForm onSubmit={onSubmit} formTitle={"Tambah Pengguna"} />;
}
