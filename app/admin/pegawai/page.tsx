"use client";

import { DataTable } from "@/components/data-table";
import { title } from "@/components/primitives";

const columns = [
  { key: "id", label: "ID" },
  { key: "nip", label: "NIP" },
  { key: "nama", label: "Nama" },
  { key: "no_hp", label: "No HP" },
  { key: "tindakan", label: "Tindakan" },
];

export default function PegawaiPage() {
  return (
    <div>
      <h3 className={title()}>Pegawai</h3>
      <DataTable
        columns={columns}
        endpoint="http://localhost:3007/pegawai/daftar?search="
        searchKey={"nama"}
      />
    </div>
  );
}
