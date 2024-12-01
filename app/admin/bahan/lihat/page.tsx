"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { subtitle, title } from "@/components/primitives";
import { Key, useCallback, useEffect, useState } from "react";
import {
  getKeyValue,
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

const tableColumns = [
  {
    key: "pelanggan_nama",
    label: "Pelanggan",
  },
  {
    key: "model_nama",
    label: "Model",
  },
  {
    key: "jumlah",
    label: "Jumlah",
  },
  {
    key: "catatan",
    label: "Catatan",
  },
];

export default function LihatBahanPage() {
  const params = useSearchParams();
  const [data, setData] = useState<Record<string, any>>();

  async function getDetail(id: string) {
    const response = await fetch(API_HOST + "/bahan/ambil?id=" + id, {
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
      <h3 className={subtitle()}>Lihat Bahan</h3>
      <table className="my-5">
        <tbody>
          <tr>
            <td>Nama Bahan</td>
            <td>: </td>
            <td>{data?.nama}</td>
          </tr>
          <tr>
            <td>Satuan</td>
            <td>: </td>
            <td>{data?.satuan}</td>
          </tr>
          <tr>
            <td>Stok</td>
            <td>: </td>
            <td>{data?.stok}</td>
          </tr>
          <tr>
            <td>Harga Satuan</td>
            <td>: </td>
            <td>{"Rp. " + data?.harga}</td>
          </tr>
          <tr>
            <td>Deskripsi</td>
            <td>: </td>
            <td>{data?.deskripsi}</td>
          </tr>
          <tr>
            <td>Riwayat Penggunaan</td>
            <td>: </td>
            <td>
              <Table removeWrapper isStriped>
                <TableHeader columns={tableColumns}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody items={data?.pesanan_bahan ?? []}>
                  {(item: any) => (
                    <TableRow key={item.id}>
                      {(columnKey) => (
                        <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
