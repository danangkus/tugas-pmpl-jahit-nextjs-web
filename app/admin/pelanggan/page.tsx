"use client";

import { DataTable } from "@/components/data-table";
import { title } from "@/components/primitives";

const columns = [
  { key: "id", label: "ID" },
  { key: "nama", label: "Nama" },
  { key: "no_hp", label: "No HP" },
  {
    key: "jenis_kelamin",
    label: "Jenis Kelamin",
    render: (v: string) => {
      let result = v;
      if (v == "P") {
        result = "Perempuan";
      } else if (v == "L") {
        result = "Laki-laki";
      }
      return result;
    },
  },
  {
    key: "tanggal_lahir",
    label: "Tanggal Lahir",
    render: (v: string) => v && (v as string).split("T")[0],
  },
  { key: "alamat", label: "Alamat" },
  { key: "tindakan", label: "Tindakan" },
];

export default function PelangganPage() {
  return (
    <div>
      <h3 className={title()}>Pelanggan</h3>
      <DataTable
        columns={columns}
        endpoint="http://localhost:3007/pelanggan/daftar?search="
        searchKey={"nama"}
      />
    </div>
  );
}
