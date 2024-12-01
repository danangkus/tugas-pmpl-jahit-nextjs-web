"use client";

import { useRouter } from "next/navigation";
import PelangganForm from "../(component)/form";
import { toast } from "react-toastify";
import { API_HOST } from "@/helpers/envHelpers";

export default function TambahPelangganPage() {
  const router = useRouter();

  async function onSubmit(data: any) {
    let body = data;
    body.tanggal_lahir = new Date(body.tanggal_lahir).toISOString();
    // console.log("body",body)
    // return

    const response = await fetch(API_HOST + "/pelanggan/tambah", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    console.log("hasil", response, body);
    if (response.ok) {
      router.push("/admin/pelanggan");
    } else {
      toast("Error!", { type: "error" });
    }
  }

  return <PelangganForm onSubmit={onSubmit} formTitle={"Tambah Pelanggan"} />;
}
