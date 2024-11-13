"use client";

import { DataTable } from "@/components/data-table";
import { title } from "@/components/primitives";

const columns = [
  { key: "id", label: "ID" },
  { key: "nama", label: "Nama Jenis/Model Pakaian" },
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
  { key: "deskripsi", label: "Deskripsi" },
  { key: "tindakan", label: "Tindakan" },
];

export default function ModelPage() {
  return (
    <div>
      <h3 className={title()}>Jenis/Model Pakaian</h3>
      <DataTable
        columns={columns}
        endpoint="http://localhost:3007/model/daftar?search="
        searchKey={"nama"}
      />
    </div>
  );
}
