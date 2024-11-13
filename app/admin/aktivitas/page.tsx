"use client";

import { DataTable } from "@/components/data-table";
import { title } from "@/components/primitives";

const columns = [
  { key: "id", label: "ID" },
  { key: "aktivitas", label: "Aktivitas" },
  { key: "tanggal", label: "Waktu" },
  { key: "oleh", label: "Oleh" },
  { key: "tindakan", label: "Tindakan" },
];

export default function AktivitasPage() {
  return (
    <div>
      <h3 className={title()}>Riwayat Aktivitas</h3>
      <DataTable
        columns={columns}
        endpoint="http://localhost:3007/aktivitas/daftar?search="
        searchKey={"aktivitas"}
      />
    </div>
  );
}
