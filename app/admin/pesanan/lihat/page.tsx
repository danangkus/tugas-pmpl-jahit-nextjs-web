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
import { API_HOST } from "@/helpers/envHelpers";

const dokumenColumns = [
  {
    key: "nama",
    label: "Nama Dokumen",
  },
  {
    key: "deskripsi",
    label: "Deskripsi",
  },
  {
    key: "download",
    label: "Download",
  },
];

const bahanColumns = [
  {
    key: "nama",
    label: "Nama Bahan",
  },
  {
    key: "jumlah",
    label: "Jumlah",
  },
  {
    key: "satuan",
    label: "Satuan",
  },
  {
    key: "harga",
    label: "Harga Satuan",
  },
  {
    key: "jumlahHarga",
    label: "Harga",
  },
  {
    key: "catatan",
    label: "Catatan",
  },
];

const aktivitasColumns = [
  {
    key: "aktivitas",
    label: "Aktivitas",
  },
  {
    key: "tanggal",
    label: "Waktu",
  },
  {
    key: "oleh",
    label: "Oleh",
  },
];

const pengukuranColumns = [
  {
    key: "nama",
    label: "Nama Pengukuran",
  },
  {
    key: "nilai",
    label: "Nilai",
  },
  {
    key: "satuan",
    label: "Satuan",
  },
  {
    key: "catatan",
    label: "Catatan",
  },
];

export default function LihatPesananPage() {
  const params = useSearchParams();
  const [data, setData] = useState<Record<string, any>>();

  async function getDetail(id: string) {
    const response = await fetch(API_HOST + "/pesanan/ambil?id=" + id, {
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

  const renderCellDokumen = useCallback((data: any, columnKey: Key) => {
    const cellValue = data[columnKey as keyof typeof data];

    switch (columnKey) {
      case "download":
        return (
          <Link download={data.nama} href={data.base64}>
            <DownloadIcon />
          </Link>
        );
      default:
        return cellValue;
    }
  }, []);

  const renderCellBahan = useCallback((data: any, columnKey: Key) => {
    const cellValue = data[columnKey as keyof typeof data];

    switch (columnKey) {
      case "nama":
        return data.bahan.nama;
      case "harga":
        return "Rp. " + data.bahan.harga;
      case "satuan":
        return data.bahan.satuan;
      case "jumlahHarga":
        return "Rp. " + parseFloat(data.jumlah) * data.bahan.harga;
      default:
        return cellValue;
    }
  }, []);

  const renderCellAktivitas = useCallback((data: any, columnKey: Key) => {
    const cellValue = data[columnKey as keyof typeof data];

    switch (columnKey) {
      default:
        return cellValue;
    }
  }, []);

  const renderCellPengukuran = useCallback((data: any, columnKey: Key) => {
    const cellValue = data[columnKey as keyof typeof data];

    switch (columnKey) {
      case "nama":
        return data.pengukuran.nama;
      case "satuan":
        return data.pengukuran.satuan;
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
      <h3 className={subtitle()}>Lihat Pesanan</h3>
      <table className="my-5">
        <tbody>
          <tr>
            <td>Pelanggan</td>
            <td>: </td>
            <td>{data?.pelanggan.nama}</td>
          </tr>
          <tr>
            <td>Alamat Pelanggan</td>
            <td>: </td>
            <td>{data?.pelanggan.alamat}</td>
          </tr>
          <tr>
            <td>Model Pakaian</td>
            <td>: </td>
            <td>{data?.jenis_pakaian.nama}</td>
          </tr>
          <tr>
            <td>Tahap</td>
            <td>: </td>
            <td>{data?.tahap_objek.nama}</td>
          </tr>
          <tr>
            <td>Penanggung Jawab</td>
            <td>: </td>
            <td>{data?.pegawai.nama}</td>
          </tr>
          <tr>
            <td>Target Penyelesaian</td>
            <td>: </td>
            <td>{data?.target_tanggal}</td>
          </tr>
          <tr>
            <td>Catatan</td>
            <td>: </td>
            <td>{data?.catatan}</td>
          </tr>
          <tr>
            <td>Dokumen</td>
            <td>:</td>
            <td>
              <Table removeWrapper isStriped>
                <TableHeader columns={dokumenColumns}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody items={data?.dokumen ?? []}>
                  {(item: any) => (
                    <TableRow key={item.id}>
                      {(columnKey) => (
                        <TableCell>
                          {renderCellDokumen(item, columnKey)}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </td>
          </tr>
          <tr>
            <td>Pengukuran</td>
            <td>: </td>
            <td>
              <Table removeWrapper isStriped>
                <TableHeader columns={pengukuranColumns}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody items={data?.pengukuran ?? []}>
                  {(item: any) => (
                    <TableRow key={item.id}>
                      {(columnKey) => (
                        <TableCell>
                          {renderCellPengukuran(item, columnKey)}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </td>
          </tr>
          <tr>
            <td>Kebutuhan Bahan</td>
            <td>: </td>
            <td>
              <Table removeWrapper isStriped>
                <TableHeader columns={bahanColumns}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody items={data?.bahan ?? []}>
                  {(item: any) => (
                    <TableRow key={item.id}>
                      {(columnKey) => (
                        <TableCell>
                          {renderCellBahan(item, columnKey)}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </td>
          </tr>
          <tr>
            <td>Riwayat Aktivitas</td>
            <td>: </td>
            <td>
              <Table removeWrapper isStriped>
                <TableHeader columns={aktivitasColumns}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody items={data?.aktivitas ?? []}>
                  {(item: any) => (
                    <TableRow key={item.id}>
                      {(columnKey) => (
                        <TableCell>
                          {renderCellAktivitas(item, columnKey)}
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
