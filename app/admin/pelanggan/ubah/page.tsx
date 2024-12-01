"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import PelangganForm from "../(component)/form";
import { toast } from "react-toastify";
import { API_HOST } from "@/helpers/envHelpers";

export default function UbahPelangganPage() {
  const router = useRouter();
  const params = useSearchParams();

  async function onSubmit(data: any) {
    const id = params.get("id");
    let body = data;
    body.id = Number(id);
    body.tanggal_lahir = new Date(body.tanggal_lahir).toISOString();

    const response = await fetch(API_HOST + "/pelanggan/ubah", {
      method: "PUT",
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
