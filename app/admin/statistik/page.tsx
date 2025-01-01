"use client";

import { EyeIcon, UserIcon } from "@/components/icons";
import { subtitle, title } from "@/components/primitives";
import { API_HOST } from "@/helpers/envHelpers";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import { CheckIcon, ForwardIcon, LinkIcon } from "@nextui-org/shared-icons";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
} from "@nextui-org/table";
import { Key, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const pesananColumn = [
  { name: "Pelanggan", uid: "pelanggan" },
  { name: "Model", uid: "model" },
  { name: "Tahap", uid: "tahap" },
  { name: "Target", uid: "target" },
];
const bahanColumn = [
  { name: "Nama Bahan", uid: "nama" },
  { name: "Stok", uid: "stok" },
];

export default function Statistik() {
  const [data, setData] = useState<Record<string, any>>();

  const pesananRenderCell = useCallback((data: any, columnKey: Key) => {
    const cellValue = data[columnKey as keyof typeof data];
    switch (columnKey) {
      case "pelanggan":
        return data.pelanggan.nama;
      case "model":
        return data.jenis_pakaian.nama;
      case "tahap":
        return data.tahap_objek.nama;
      case "target":
        let value =
          data.target_tanggal && (data.target_tanggal as string).split("T")[0];
        let isLessThanToday =
          data.target_tanggal && new Date(data.target_tanggal) <= new Date();
        return (
          <Chip
            color={isLessThanToday ? "danger" : "warning"}
            size="sm"
            variant="flat"
          >
            {value}
          </Chip>
        );
      default:
        return cellValue;
    }
  }, []);

  const bahanRenderCell = useCallback((data: any, columnKey: Key) => {
    const cellValue = data[columnKey as keyof typeof data];
    switch (columnKey) {
      case "stok":
        return (data.stok ?? "-") + " " + data.satuan;
      default:
        return cellValue;
    }
  }, []);

  async function getDetail() {
    const response = await fetch(API_HOST + "/statistik/ambil", {
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
    getDetail();
  }, []);

  return (
    <section className="flex flex-col gap-4 my-5">
      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <Card>
          <CardBody>
            <div className="flex">
              <div>
                <h6>Pesanan Aktif</h6>
                <h1
                  className={title({ color: "violet", className: "text-6xl" })}
                >
                  {data?.activeOrderCount ?? "-"}
                </h1>
              </div>
              <div className="content-end">
                <Button size="sm" isIconOnly color="secondary" variant="light">
                  <ForwardIcon fontSize={25} />
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex">
              <div>
                <h6>Pesanan Selesai</h6>
                <h1
                  className={title({ color: "violet", className: "text-6xl" })}
                >
                  {data?.completeOrderCount ?? "-"}
                </h1>
              </div>
              <div className="content-end">
                <Button size="sm" isIconOnly color="secondary" variant="light">
                  <CheckIcon fontSize={25} />
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex">
              <div>
                <h6>Total Pelanggan</h6>
                <h1
                  className={title({ color: "violet", className: "text-6xl" })}
                >
                  {data?.customerCount ?? "-"}
                </h1>
              </div>
              <div className="content-end">
                <Button size="sm" isIconOnly color="secondary" variant="light">
                  <UserIcon fontSize={25} />
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <Divider />
      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <div>
          <h3 className={subtitle({ className: "text-red-400" })}>
            Segera Diselesaikan
          </h3>
          <Table>
            <TableHeader columns={pesananColumn}>
              {(column) => (
                <TableColumn key={column.uid}>{column.name}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={data?.dueOrder ?? []}>
              {(item: any) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{pesananRenderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div>
          <h3 className={subtitle({ className: "text-red-400" })}>
            Perlu Pembelian Bahan
          </h3>
          <Table>
            <TableHeader columns={bahanColumn}>
              {(column) => (
                <TableColumn key={column.uid}>{column.name}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={data?.stockBahan ?? []}>
              {(item: any) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{bahanRenderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
