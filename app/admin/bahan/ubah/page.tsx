"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import BahanForm from "../(component)/form";
import { toast } from "react-toastify";
import { API_HOST } from "@/helpers/envHelpers";

export default function UbahBahanPage() {
  const router = useRouter();
  const params = useSearchParams();

  async function onSubmit(data: any) {
    const id = params.get("id");
    let body = data;
    body.id = Number(id);

    const response = await fetch(API_HOST + "/bahan/ubah", {
      method: "PUT",
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

  return <BahanForm onSubmit={onSubmit} formTitle={"Tambah Bahan"} />;
}
