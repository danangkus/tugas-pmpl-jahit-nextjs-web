"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { subtitle, title } from "@/components/primitives";
import { Key, useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { DownloadIcon } from "@/components/icons";
import { Link } from "@nextui-org/link";
import { getGenderDesc } from "@/helpers/valueHelpers";
import { Image } from "@nextui-org/image";
import { API_HOST } from "@/helpers/envHelpers";

export default function LihatPenggunaPage() {
  const params = useSearchParams();
  const [data, setData] = useState<Record<string, any>>();

  async function getDetail(id: string) {
    const response = await fetch(API_HOST + "/pengguna/ambil?id=" + id, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
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
      <h3 className={subtitle()}>Lihat Pengguna</h3>
      <table className="my-5">
        <tbody>
          <tr>
            <td>Pegawai</td>
            <td>: </td>
            <td>{data?.pegawai.nama}</td>
          </tr>
          <tr>
            <td>Username</td>
            <td>: </td>
            <td>{data?.username}</td>
          </tr>
          <tr>
            <td>Tanggal Login Terakhir</td>
            <td>: </td>
            <td>{data?.tanggal_login_terakhir}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
