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
import { API_HOST } from "@/helpers/envHelpers";

const pesananColumns = [
  {
    key: "model",
    label: "Model",
  },
  {
    key: "tahap",
    label: "Tahap",
  },
  {
    key: "target_tanggal",
    label: "Target Selesai",
  },
  {
    key: "catatan",
    label: "Catatan",
  },
];

export default function LihatPelangganPage() {
  const params = useSearchParams();
  const [data, setData] = useState<Record<string, any>>();

  async function getDetail(id: string) {
    const response = await fetch(API_HOST + "/pelanggan/ambil?id=" + id, {
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

  const renderCellPesanan = useCallback((data: any, columnKey: Key) => {
    const cellValue = data[columnKey as keyof typeof data];

    switch (columnKey) {
      case "model":
        return data.jenis_pakaian.nama;
      case "tahap":
        return data.tahap_objek.nama;
      case "target_tanggal":
        return (
          data?.target_tanggal && (data?.target_tanggal as string).split("T")[0]
        );
      default:
        return cellValue;
    }
  }, []);

  useEffect(() => {
    const id = params.get("id");

    if (params.has("id") && id) {
      getDetail(id);
    }
  }, [params]);

  return (
    <>
      <h3 className={subtitle()}>Lihat Pelanggan</h3>
      <table className="my-5">
        <tbody>
          <tr>
            <td>Nama Pelanggan</td>
            <td>: </td>
            <td>{data?.nama}</td>
          </tr>
          <tr>
            <td>Nomor HP</td>
            <td>: </td>
            <td>{data?.no_hp}</td>
          </tr>
          <tr>
            <td>Jenis Kelamin</td>
            <td>: </td>
            <td>{getGenderDesc(data?.jenis_kelamin)}</td>
          </tr>
          <tr>
            <td>Tanggal Lahir</td>
            <td>: </td>
            <td>
              {data?.tanggal_lahir &&
                (data?.tanggal_lahir as string).split("T")[0]}
            </td>
          </tr>
          <tr>
            <td>Alamat</td>
            <td>: </td>
            <td>{data?.alamat}</td>
          </tr>
          <tr>
            <td>Riwayat Pemesanan</td>
            <td>: </td>
            <td>
              <Table removeWrapper isStriped>
                <TableHeader columns={pesananColumns}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody items={data?.pesanan ?? []}>
                  {(item: any) => (
                    <TableRow key={item.id}>
                      {(columnKey) => (
                        <TableCell>
                          {renderCellPesanan(item, columnKey)}
                        </TableCell>
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
