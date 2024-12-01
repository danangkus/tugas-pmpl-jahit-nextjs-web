"use client";

import { subtitle, title } from "@/components/primitives";
import { API_HOST } from "@/helpers/envHelpers";
import { genderList } from "@/helpers/valueHelpers";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { Button } from "@nextui-org/button";
import { DateInput } from "@nextui-org/date-input";
import { DatePicker } from "@nextui-org/date-picker";
import { Input, Textarea } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Select, SelectItem } from "@nextui-org/select";
import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { Formik, useFormik } from "formik";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

const FormSchema = Yup.object().shape({
  nama: Yup.string().required("Required"),
  satuan: Yup.string().required("Required"),
});

const tableColumns = [
  {
    key: "pelanggan_nama",
    label: "Pelanggan",
  },
  {
    key: "model_nama",
    label: "Model",
  },
  {
    key: "jumlah",
    label: "Jumlah",
  },
  {
    key: "catatan",
    label: "Catatan",
  },
];

export default function BahanForm({ onSubmit, formTitle }: any) {
  const params = useSearchParams();
  const {
    handleSubmit,
    handleChange,
    values,
    setValues,
    errors,
    touched,
    setFormikState,
  } = useFormik({
    initialValues: {
      nama: "",
      satuan: "",
      stok: "",
      harga: "",
      deskripsi: "",
    },
    onSubmit: (values) => {
      onSubmit({
        ...values,
        stok: values.stok == "" ? null : values.stok,
        harga: values.harga == "" ? null : values.harga,
      });
    },
    validationSchema: FormSchema,
  });
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [historyList, setHistoryList] = useState<any[]>([]);

  async function getDetail(id: string) {
    const response = await fetch(API_HOST + "/bahan/ambil?id=" + id, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      let json = await response.json();
      setValues({
        ...json.hasil,
      });
      setHistoryList(json.hasil.pesanan_bahan);
    } else {
      toast("Error!", { type: "error" });
    }
  }

  useEffect(() => {
    const id = params.get("id");

    if (params.has("id") && id) {
      getDetail(id);
    }
  }, [params]);

  return (
    <>
      <h3 className={subtitle()}>{formTitle}</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 my-5">
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input
              label="Nama"
              placeholder="Input Nama"
              labelPlacement="outside"
              name="nama"
              isRequired
              onChange={handleChange}
              value={values.nama}
              isInvalid={touched.nama && errors.nama != null}
              errorMessage={errors.nama}
            />
            {/* {errors.nama && touched.nama && errors.nama} */}
            <Input
              label="Satuan"
              placeholder="Input Satuan"
              labelPlacement="outside"
              name="satuan"
              isRequired
              onChange={handleChange}
              value={values.satuan}
              isInvalid={touched.satuan && errors.satuan != null}
              errorMessage={errors.satuan}
            />
            {/* {errors.satuan && touched.satuan && errors.satuan} */}
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input
              label="Stok"
              placeholder="Input Stok"
              labelPlacement="outside"
              name="stok"
              onChange={handleChange}
              value={values.stok}
              type="number"
              endContent={values.satuan}
            />
            <Input
              label="Harga"
              placeholder="Input Harga"
              labelPlacement="outside"
              name="harga"
              onChange={handleChange}
              value={values.harga}
              type="number"
              startContent="Rp."
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Textarea
              label="Deskripsi"
              placeholder="Input Deskripsi"
              labelPlacement="outside"
              name="deskripsi"
              onChange={handleChange}
              value={values.deskripsi}
            />
          </div>
          <div className="flex justify-end mt-5 gap-4">
            {params.get("id") && (
              <Button onClick={onOpen}>Riwayat Penggunaan</Button>
            )}
            <Button type="submit" color="primary">
              Simpan
            </Button>
          </div>
        </div>
      </form>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Riwayat Penggunaan Bahan {values.nama}
              </ModalHeader>
              <ModalBody>
                <Table>
                  <TableHeader columns={tableColumns}>
                    {(column) => (
                      <TableColumn key={column.key}>{column.label}</TableColumn>
                    )}
                  </TableHeader>
                  <TableBody items={historyList}>
                    {(item) => (
                      <TableRow key={item.id}>
                        {(columnKey) => (
                          <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Tutup
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
