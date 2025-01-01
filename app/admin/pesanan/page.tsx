"use client";

import { DataTable, DataTableRef } from "@/components/data-table";
import { VerticalDotsIcon } from "@/components/icons";
import { title } from "@/components/primitives";
import { API_HOST } from "@/helpers/envHelpers";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip, ChipProps } from "@nextui-org/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
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
import { usePathname, useRouter } from "next/navigation";
import { createRef, useMemo, useState } from "react";
import { useAsyncList } from "react-stately";
import { toast } from "react-toastify";

const statusColorMap: Record<string, ChipProps["color"]> = {
  PESAN: "primary",
  AMBIL: "success",
  SIAP: "success",
  BATAL: "danger",
  PERMAK: "warning",
};

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
    tahap: new Set([]),
    penerima_tugas: null,
  });
  const [deleteId, setDeleteId] = useState<number>();
  const router = useRouter();
  const pathname = usePathname();

  const fullActions = [
    {
      key: "lihat",
      label: "Lihat",
      onClick: (id: any) => toLihatPage(id),
    },
    {
      key: "ubah",
      label: "Ubah",
      onClick: (id: any) => toUbahPage(id),
    },
    {
      key: "ubahTahap",
      label: "Pindah Tahap",
      onClick: (id: any) => openTahapModal(id),
    },
    // {
    //   key: "hapus",
    //   label: "Hapus",
    //   onClick: (id: any) => konfirmasiHapusPesanan(id),
    //   color: "danger",
    // },
  ];

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
      render: (v: string, r: any) => (
        <Chip
          className="capitalize"
          color={statusColorMap[v]}
          size="sm"
          variant="flat"
        >
          {r.tahap_objek.nama}
        </Chip>
      ),
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
            <DropdownMenu items={actionItems}>
              {(item) => (
                <DropdownItem
                  key={item.key}
                  color={item.key === "hapus" ? "danger" : "default"}
                  className={item.key === "hapus" ? "text-danger" : ""}
                  onPress={() => item.onClick(r.id)}
                >
                  {item.label}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
      ),
    },
  ];

  const tahapList = useAsyncList({
    async load({ signal, cursor }) {
      const res = await fetch(cursor || API_HOST + "/tahap/daftar?search=", {
        signal,
      });
      let json = await res.json();

      return {
        items: json.hasil,
        cursor: json.next,
      };
    },
  });

  const pegawaiList = useAsyncList({
    async load({ signal, cursor }) {
      const res = await fetch(cursor || API_HOST + "/pegawai/daftar?search=", {
        signal,
      });
      let json = await res.json();

      return {
        items: json.hasil,
        cursor: json.next,
      };
    },
  });

  const role = useMemo(() => {
    let result: string | null = "";
    if (localStorage) {
      result = localStorage.getItem("role");
    }
    return result;
  }, []);

  const actionItems = useMemo(() => {
    let result = fullActions;
    result = result.filter((row) => {
      let rRes = true;
      if (role == "PEMILIK" && ["ubah", "ubahTahap"].indexOf(row.key) != -1) {
        rRes = false;
      }
      return rRes;
    });
    return result;
  }, [role]);

  function toLihatPage(id: number) {
    const params = new URLSearchParams();
    params.set("id", id.toString());
    router.push(`${pathname}/lihat?${params.toString()}`);
  }

  function toUbahPage(id: number) {
    const params = new URLSearchParams();
    params.set("id", id.toString());
    router.push(`${pathname}/ubah?${params.toString()}`);
  }

  async function openTahapModal(id: number) {
    const response = await fetch(API_HOST + "/pesanan/ambil?id=" + id, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      let json = await response.json();
      onOpen();
      setTahapForm({
        tahap: new Set([json.hasil.tahap]),
        penerima_tugas: json.hasil.penerima_tugas?.toString(),
        id,
      });
    } else {
      toast("Error!", { type: "error" });
    }
  }

  function konfirmasiHapusPesanan(id: number) {
    setDeleteId(id);
    onOpenConfirmDelete();
  }

  async function hapusPesanan() {
    const response = await fetch(
      API_HOST +
        "/pesanan/hapus?id=" +
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
    } else {
      toast("Error!", { type: "error" });
      onCloseConfirmDelete();
    }
  }

  function getSelectedStepDesc() {
    let iterator = tahapForm.tahap.values();
    let kode = iterator.next().value;
    let filtered: any[] = tahapList.items.filter(
      (row: any) => row.kode == kode
    );
    let result = "";
    if (filtered.length > 0) {
      result = filtered[0]?.deskripsi;
    }
    return result;
  }

  async function simpanTahap() {
    if (tahapForm.tahap && tahapForm.penerima_tugas) {
      let iterator = tahapForm.tahap.values();
      let body = {
        ...tahapForm,
        tahap: iterator.next().value,
        penerima_tugas: Number(tahapForm.penerima_tugas),
        oleh: localStorage.getItem("username"),
      };

      const response = await fetch(API_HOST + "/pesanan/ubah-tahap", {
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });

      console.log("hasil", body, response);
      if (response.ok) {
        onClose();
        tableRef.current?.reload();
      } else {
        toast("Error!", { type: "error" });
      }
    }
  }

  return (
    <div>
      <h3 className={title()}>Pesanan</h3>
      <DataTable
        columns={columns}
        endpoint="/pesanan"
        searchKey={"pelanggan.nama"}
        tableRef={tableRef}
        excelExport={role == "PEMILIK"}
        hideCreate={role == "PEMILIK"}
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
                    <Listbox
                      items={tahapList.items as any[]}
                      disallowEmptySelection
                      selectionMode="single"
                      selectedKeys={tahapForm.tahap}
                      onSelectionChange={(value) => {
                        setTahapForm({ ...tahapForm, tahap: value });
                      }}
                    >
                      {(item) => (
                        <ListboxItem
                          key={item.kode}
                          color={statusColorMap[item.kode]}
                          className={
                            statusColorMap[item.kode] &&
                            "text-" + statusColorMap[item.kode]
                          }
                        >
                          {item.nama}
                        </ListboxItem>
                      )}
                    </Listbox>
                  </ScrollShadow>
                  <Card style={{ width: "inherit" }}>
                    <CardBody>{getSelectedStepDesc()}</CardBody>
                  </Card>
                </div>
                <Select
                  label="Penerima Tugas"
                  labelPlacement="outside"
                  isRequired
                  selectedKeys={[tahapForm.penerima_tugas]}
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
