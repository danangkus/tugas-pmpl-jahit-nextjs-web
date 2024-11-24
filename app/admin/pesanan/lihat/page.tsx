"use client";

import { useRouter, useSearchParams } from "next/navigation";
import PesananForm from "../(component)/form";
import { toast } from "react-toastify";
import { title } from "@/components/primitives";
import { useEffect, useState } from "react";

export default function LihatPesananPage() {
  const params = useSearchParams();
  const [data, setData] = useState<Record<string, any>>();

  async function getDetail(id: string) {
    const response = await fetch(
      "http://localhost:3007/pesanan/ambil?id=" + id,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.ok) {
      let json = await response.json();
      setData({ ...json.hasil });
    } else {
      toast("Error!", { type: "error" });
    }
  }

  useEffect(() => {
    const id = params.get("id");

    if (params.has("id") && id) {
      getDetail(id);
    }
  }, [params]);

  return (
    <>
      <h3 className={title()}>Lihat Pesanan</h3>
      <table className="my-5">
        <tbody>
          <tr>
            <td>Pelanggan</td>
            <td>: {data?.pelanggan.nama}</td>
          </tr>
          <tr>
            <td>Model Pakaian</td>
            <td>: {data?.jenis_pakaian.nama}</td>
          </tr>
          <tr>
            <td>Tahap Terakhir</td>
            <td>: {data?.tahap_objek.nama}</td>
          </tr>
          <tr>
            <td>Penanggung Jawab</td>
            <td>: {data?.pegawai.nama}</td>
          </tr>
          <tr>
            <td>Target Penyelesaian</td>
            <td>: {data?.target_tanggal}</td>
          </tr>
          <tr>
            <td>Catatan</td>
            <td>: {data?.catatan}</td>
          </tr>
          <tr>
            <td>Dokumen</td>
            {/* <td>: {data?.dokumen}</td> */}
          </tr>
          <tr>
            <td>Kebutuhan Bahan</td>
            {/* <td>: {data?.bahan}</td> */}
          </tr>
          <tr>
            <td>Pengukuran</td>
            {/* <td>: {data?.pengukuran}</td> */}
          </tr>
        </tbody>
      </table>
    </>
  );
}
