"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import PenggunaForm from "../(component)/form";
import { toast } from "react-toastify";

export default function UbahPenggunaPage() {
  const router = useRouter();
  const params = useSearchParams();

  async function onSubmit(data: any) {
    const id = params.get("id");
    let body = data;
    body.id = Number(id);

    const response = await fetch("http://localhost:3007/pengguna/ubah", {
      method: "PUT",
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

  return <PenggunaForm onSubmit={onSubmit} formTitile={"Tambah Pengguna"} />;
}
