"use client";

import { DataTable } from "@/components/data-table";
import { title } from "@/components/primitives";

const columns = [
  { key: "id", label: "ID" },
  { key: "nama", label: "Nama Bahan" },
  { key: "satuan", label: "Satuan" },
  { key: "stok", label: "Stok" },
  { key: "harga", label: "Harga", render: (v: number) => "Rp. " + v },
  { key: "deskripsi", label: "Deskripsi" },
  { key: "tindakan", label: "Tindakan" },
];

export default function BahanPage() {
  return (
    <div>
      <h3 className={title()}>Bahan</h3>
      <DataTable
        columns={columns}
        endpoint="http://localhost:3007/bahan/daftar?search="
        searchKey={"nama"}
      />
    </div>
  );
}
