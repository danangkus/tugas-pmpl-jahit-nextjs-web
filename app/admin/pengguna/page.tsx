"use client";

import { DataTable } from "@/components/data-table";
import { title } from "@/components/primitives";

const columns = [
  { key: "id", label: "ID" },
  { key: "username", label: "Username" },
  { key: "role", label: "Role" },
  { key: "tindakan", label: "Tindakan" },
];

export default function PenggunaPage() {
  return (
    <div>
      <h3 className={title()}>Pengguna</h3>
      <DataTable columns={columns} endpoint="/pengguna" searchKey={"nama"} />
    </div>
  );
}
