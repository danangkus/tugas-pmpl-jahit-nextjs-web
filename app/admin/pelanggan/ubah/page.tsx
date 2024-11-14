"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import PelangganForm from "../(component)/form";

export default function UbahPelangganPage() {
  const router = useRouter();
  const params = useSearchParams();

  async function onSubmit(data: any) {
    const id = params.get("id");
    let body = data;
    body.id = Number(id);
    body.tanggal_lahir = new Date(body.tanggal_lahir).toISOString();

    const response = await fetch("http://localhost:3007/pelanggan/ubah", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    console.log("hasil", response, body);
    if (response.ok) {
      router.push("/admin/pelanggan");
    }
  }

  return <PelangganForm onSubmit={onSubmit} formTitile={"Tambah Pelanggan"} />;
}
