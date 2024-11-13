"use client";

import { DataTable, DataTableRef } from "@/components/data-table";
import { VerticalDotsIcon } from "@/components/icons";
import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Select, SelectItem } from "@nextui-org/select";
import { Tab, Tabs } from "@nextui-org/tabs";
import { createRef, useState } from "react";
import { useAsyncList } from "react-stately";

export default function PesananPage() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isOpenConfirmDelete,
    onOpen: onOpenConfirmDelete,
    onOpenChange: onOpenChangeConfirmDelete,
    onClose: onCloseConfirmDelete,
  } = useDisclosure();
  const tableRef = createRef<DataTableRef>();
  const [tahapForm, setTahapForm] = useState<any>({
    id: null,
    tahap: "",
    penerima_tugas: null,
  });
  const [deleteId, setDeleteId] = useState<number>();

  const columns = [
    { key: "id", label: "ID" },
    {
      key: "pelanggan_id",
      label: "Pelanggan",
      render: (v: BigInt, r: any) => r.pelanggan.nama,
    },
    {
      key: "jenis_pakaian_id",
      label: "Model",
      render: (v: BigInt, r: any) => r.jenis_pakaian.nama,
    },
    {
      key: "tahap",
      label: "Tahap",
      render: (v: BigInt, r: any) => r.tahap_objek.nama,
    },
    {
      key: "target_tanggal",
      label: "Target Selesai",
      render: (v: string) => v && (v as string).split("T")[0],
    },
    { key: "catatan", label: "Catatan" },
    {
      key: "tindakan",
      label: "Tindakan",
      render: (v: any, r: any) => (
        <div className="relative flex justify-end items-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <VerticalDotsIcon className="text-default-300" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem>Ubah Data</DropdownItem>
              <DropdownItem onPress={() => openTahapModal(r.id)}>
                Ubah Tahap
              </DropdownItem>
              <DropdownItem
                color="danger"
                onPress={() => konfirmasiHapusPesanan(r.id)}
              >
                Hapus
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      ),
    },
  ];

  const tahapList = useAsyncList({
    async load({ signal, cursor }) {
      const res = await fetch(
        cursor || "http://localhost:3007/tahap/daftar?search=",
        { signal }
      );
      let json = await res.json();

      return {
        items: json.hasil,
        cursor: json.next,
      };
    },
  });

  const pegawaiList = useAsyncList({
    async load({ signal, cursor }) {
      const res = await fetch(
        cursor || "http://localhost:3007/pegawai/daftar?search=",
        { signal }
      );
      let json = await res.json();

      return {
        items: json.hasil,
        cursor: json.next,
      };
    },
  });

  async function openTahapModal(id: number) {
    const response = await fetch(
      "http://localhost:3007/pesanan/ambil?id=" + id,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.ok) {
      let json = await response.json();
      onOpen();
      setTahapForm({
        tahap: json.hasil.tahap,
        penerima_tugas: json.hasil.penerima_tugas,
        id,
      });
    }
  }

  function konfirmasiHapusPesanan(id: number) {
    setDeleteId(id);
    onOpenConfirmDelete();
  }

  async function hapusPesanan() {
    const response = await fetch(
      "http://localhost:3007/pesanan/hapus?id=" +
        deleteId +
        "&oleh=" +
        localStorage.getItem("username"),
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.ok) {
      onCloseConfirmDelete();
      tableRef.current?.reload();
    }
  }

  function getSelectedStepDesc() {
    let filtered: any[] = tahapList.items.filter(
      (row: any) => row.kode == tahapForm.tahap
    );
    let result = "";
    if (filtered.length > 0) {
      result = filtered[0]?.deskripsi;
    }
    return result;
  }

  async function simpanTahap() {
    if (tahapForm.tahap && tahapForm.penerima_tugas) {
      let body = tahapForm;
      body.penerima_tugas = Number(body.penerima_tugas);
      body.oleh = localStorage.getItem("username");

      const response = await fetch("http://localhost:3007/pesanan/ubah", {
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });

      console.log("hasil", body, response);
      if (response.ok) {
        onClose();
        tableRef.current?.reload();
      }
    }
  }

  return (
    <div>
      <h3 className={title()}>Pesanan</h3>
      <DataTable
        columns={columns}
        endpoint="http://localhost:3007/pesanan/daftar?search="
        searchKey={"pelanggan.nama"}
        tableRef={tableRef}
      />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Ubah Tahap
              </ModalHeader>
              <ModalBody>
                <div className="flex w-full flex-nowrap">
                  <ScrollShadow
                    className="h-[300px]"
                    style={{ width: "inherit" }}
                  >
                    <Tabs
                      isVertical
                      // size="sm"
                      selectedKey={tahapForm.tahap}
                      onSelectionChange={(value) => {
                        setTahapForm({ ...tahapForm, tahap: value });
                      }}
                    >
                      {tahapList.items.map((row: any) => (
                        <Tab key={row.kode} title={row.nama} />
                      ))}
                    </Tabs>
                  </ScrollShadow>
                  <Card style={{ width: "inherit" }}>
                    <CardBody>{getSelectedStepDesc()}</CardBody>
                  </Card>
                </div>
                <Select
                  label="Penerima Tugas"
                  labelPlacement="outside"
                  isRequired
                  value={tahapForm.penerima_tugas}
                  onChange={(e) =>
                    setTahapForm({
                      ...tahapForm,
                      penerima_tugas: e.target.value,
                    })
                  }
                >
                  {pegawaiList.items.map((row: any) => (
                    <SelectItem key={row.id}>{row.nama}</SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Tutup
                </Button>
                <Button color="primary" onPress={simpanTahap}>
                  Simpan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        size="xs"
        isOpen={isOpenConfirmDelete}
        onOpenChange={onOpenChangeConfirmDelete}
      >
        <ModalContent>
          {(onCloseConfirmDelete) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Hapus Pesanan?
              </ModalHeader>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onCloseConfirmDelete}
                >
                  Batal
                </Button>
                <Button color="primary" onPress={() => hapusPesanan()}>
                  Ya
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
