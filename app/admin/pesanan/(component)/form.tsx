"use client";

import {
  DeleteIcon,
  DownloadIcon,
  EyeIcon,
  PlusIcon,
} from "@/components/icons";
import { subtitle, title } from "@/components/primitives";
import { API_HOST } from "@/helpers/envHelpers";
import { downloadBase64 } from "@/helpers/fileHelpers";
import { toBase64 } from "@/helpers/valueHelpers";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { Button } from "@nextui-org/button";
import { DateInput } from "@nextui-org/date-input";
import { DatePicker } from "@nextui-org/date-picker";
import { Input, Textarea } from "@nextui-org/input";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Select, SelectItem } from "@nextui-org/select";
import { Tooltip } from "@nextui-org/tooltip";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAsyncList } from "react-stately";
import { toast } from "react-toastify";
import * as Yup from "yup";

const FormSchema = Yup.object().shape({
  pelanggan_id: Yup.string().required("Required"),
  jenis_pakaian_id: Yup.string().required("Required"),
});

export default function PesananForm({ onSubmit, formTitle }: any) {
  const params = useSearchParams();
  const router = useRouter();
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
      pelanggan_id: "",
      jenis_pakaian_id: "",
      target_tanggal: null,
      catatan: "",
    },
    onSubmit: (values) => {
      let otherValues = {
        pelanggan_id: Number(values.pelanggan_id),
        jenis_pakaian_id: Number(values.jenis_pakaian_id),
        dokumen: daftarDokumen,
        pengukuran: daftarPengukuran,
        bahan: daftarBahan,
        target_tanggal: new Date(values.target_tanggal ?? "").toISOString(),
      };
      onSubmit({ ...values, ...otherValues });
    },
    validationSchema: FormSchema,
  });

  const [daftarDokumen, setDaftarDokumen] = useState<any[]>([]);
  const [daftarPengukuran, setDaftarPengukuran] = useState<any[]>([]);
  const [daftarBahan, setDaftarBahan] = useState<any[]>([]);
  const [dokumenForm, setDokumenForm] = useState<any>({
    file: null,
    deskripsi: "",
    base64: "",
    nama: "",
  });
  const [pengukuranForm, setPengukuranForm] = useState({
    pengukuran_id: "",
    nilai: "",
    catatan: "",
  });
  const [bahanForm, setBahanForm] = useState({
    bahan_id: "",
    jumlah: "",
    catatan: "",
  });

  const pelangganList = useAsyncList({
    async load({ signal, cursor }) {
      const res = await fetch(
        cursor || API_HOST + "/pelanggan/daftar?search=",
        {
          signal,
        }
      );
      let json = await res.json();

      return {
        items: json.hasil,
        cursor: json.next,
      };
    },
  });

  const modelList = useAsyncList({
    async load({ signal, cursor }) {
      const res = await fetch(cursor || API_HOST + "/model/daftar?search=", {
        signal,
      });
      let json = await res.json();

      return {
        items: json.hasil,
        cursor: json.next,
      };
    },
  });

  const pengukuranItemList = useAsyncList({
    async load({ signal, cursor }) {
      const res = await fetch(
        cursor || API_HOST + "/pengukuran/daftar?search=",
        { signal }
      );
      let json = await res.json();

      return {
        items: json.hasil,
        cursor: json.next,
      };
    },
  });

  const bahanItemList = useAsyncList({
    async load({ signal, cursor }) {
      const res = await fetch(cursor || API_HOST + "/bahan/daftar?search=", {
        signal,
      });
      let json = await res.json();

      return {
        items: json.hasil,
        cursor: json.next,
      };
    },
  });

  async function tambahDokumen() {
    if (dokumenForm.file) {
      let base64 = "";
      try {
        const result = await toBase64(dokumenForm.file);
        base64 = result as string;
      } catch (error) {
        console.error(error);
        return;
      }
      setDaftarDokumen([
        ...daftarDokumen,
        { ...dokumenForm, base64, file: undefined },
      ]);
      setDokumenForm({ file: null, deskripsi: "", base64: "", nama: "" });
    }
  }

  function tambahPengukuran() {
    if (pengukuranForm.pengukuran_id && pengukuranForm.nilai) {
      setDaftarPengukuran([
        ...daftarPengukuran,
        {
          ...pengukuranForm,
          nilai: Number(pengukuranForm.nilai),
          pengukuran_id: Number(pengukuranForm.pengukuran_id),
        },
      ]);
      setPengukuranForm({
        pengukuran_id: "",
        nilai: "",
        catatan: "",
      });
    }
  }

  function tambahBahan() {
    if (bahanForm.bahan_id && bahanForm.jumlah) {
      setDaftarBahan([
        ...daftarBahan,
        {
          ...bahanForm,
          jumlah: Number(bahanForm.jumlah),
          bahan_id: Number(bahanForm.bahan_id),
        },
      ]);
      setBahanForm({
        bahan_id: "",
        jumlah: "",
        catatan: "",
      });
    }
  }

  function getPengukuranItemInfo(id: number) {
    let filtered = pengukuranItemList.items.filter((row: any) => row.id == id);
    let result: any = {};
    if (filtered.length > 0) {
      result = filtered[0];
    }
    return result;
  }

  function getBahanItemInfo(id: number) {
    let filtered = bahanItemList.items.filter((row: any) => row.id == id);
    let result: any = {};
    if (filtered.length > 0) {
      result = filtered[0];
    }
    return result;
  }

  function hapusDokumen(index: number) {
    let toRemove = daftarDokumen[index];
    setDaftarDokumen(daftarDokumen.filter((row) => row.nama != toRemove.nama));
  }

  function hapusPengukuran(pengukuran_id: number) {
    setDaftarPengukuran(
      daftarPengukuran.filter((row) => row.pengukuran_id != pengukuran_id)
    );
  }

  function hapusBahan(bahan_id: number) {
    setDaftarBahan(daftarBahan.filter((row) => row.bahan_id != bahan_id));
  }

  async function getDetail(id: string) {
    const response = await fetch(API_HOST + "/pesanan/ambil?id=" + id, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      let json = await response.json();
      setValues({
        ...json.hasil,
        target_tanggal:
          json.hasil.target_tanggal &&
          parseDate(json.hasil.target_tanggal.split("T")[0]),
        pelanggan_id: json.hasil.pelanggan_id.toString(),
        jenis_pakaian_id: json.hasil.jenis_pakaian_id.toString(),
      });
      setDaftarDokumen(json.hasil.dokumen);
      setDaftarPengukuran(json.hasil.pengukuran);
      setDaftarBahan(json.hasil.bahan);
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
    <div>
      <h3 className={subtitle()}>{formTitle}</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 my-5">
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Select
              label="Pelanggan"
              placeholder="Pilih Pelanggan"
              labelPlacement="outside"
              name="pelanggan_id"
              isRequired
              selectedKeys={[values.pelanggan_id ?? ""]}
              onChange={handleChange}
              value={values.pelanggan_id ?? ""}
              isInvalid={touched.pelanggan_id && errors.pelanggan_id != null}
              errorMessage={errors.pelanggan_id}
            >
              {pelangganList.items.map((row: any) => (
                <SelectItem key={row.id}>
                  {row.nama + " - " + (row.alamat ?? "")}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Model"
              placeholder="Pilih Model"
              labelPlacement="outside"
              name="jenis_pakaian_id"
              isRequired
              selectedKeys={[values.jenis_pakaian_id ?? ""]}
              onChange={handleChange}
              value={values.jenis_pakaian_id ?? ""}
              isInvalid={
                touched.jenis_pakaian_id && errors.jenis_pakaian_id != null
              }
              errorMessage={errors.jenis_pakaian_id}
            >
              {modelList.items.map((row: any) => (
                <SelectItem key={row.id}>
                  {row.nama + " (" + row.jenis_kelamin + ")"}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            {/* <DatePicker
              label="Target Selesai"
              labelPlacement="outside"
              minValue={today(getLocalTimeZone())}
              name="target_tanggal"
            /> */}
            <DateInput
              label="Target Selesai"
              labelPlacement="outside"
              // minValue={today(getLocalTimeZone())}
              name="target_tanggal"
              onChange={(v) =>
                handleChange({ target: { name: "target_tanggal", value: v } })
              }
              value={values.target_tanggal}
            />
            <Textarea
              label="Catatan"
              placeholder="Catatan Tambahan"
              labelPlacement="outside"
              name="catatan"
              onChange={handleChange}
              value={values.catatan}
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <div className="flex w-full flex-wrap gap-1">
              <label className="">Dokumen</label>
              <Listbox items={daftarDokumen} variant="bordered">
                {daftarDokumen.map((row: any, index: number) => (
                  <ListboxItem
                    key={index}
                    endContent={
                      <>
                        <Tooltip content={row.deskripsi}>
                          <Button
                            size="sm"
                            isIconOnly
                            color="primary"
                            variant="light"
                          >
                            <EyeIcon size={20} />
                          </Button>
                        </Tooltip>
                        <Button
                          size="sm"
                          isIconOnly
                          color="primary"
                          onPress={() => downloadBase64(row.base64, row.nama)}
                        >
                          <DownloadIcon size={20} />
                        </Button>
                        <Button
                          size="sm"
                          isIconOnly
                          color="danger"
                          onPress={() => hapusDokumen(index)}
                        >
                          <DeleteIcon size={20} />
                        </Button>
                      </>
                    }
                  >
                    {row.nama}
                  </ListboxItem>
                ))}
              </Listbox>
              <div className="flex w-full flex-nowrap gap-1">
                <Input
                  type="file"
                  labelPlacement="outside"
                  // value={dokumenForm.file}
                  onChange={(e) => {
                    if (e.target.files) {
                      // console.log("e", e.target.files[0]);
                      setDokumenForm({
                        ...dokumenForm,
                        file: e.target.files[0],
                        nama: e.target.files[0].name,
                      });
                    }
                  }}
                />
                <Input
                  placeholder="Input Deskripsi"
                  labelPlacement="outside"
                  value={dokumenForm.deskripsi}
                  onChange={(e) => {
                    setDokumenForm({
                      ...dokumenForm,
                      deskripsi: e.target.value,
                    });
                  }}
                />
                <Button isIconOnly color="success" onPress={tambahDokumen}>
                  <PlusIcon />
                </Button>
              </div>
            </div>
            <div className="flex w-full flex-wrap gap-1">
              <label className="">Pengukuran</label>
              <Listbox items={daftarPengukuran} variant="bordered">
                {daftarPengukuran.map((row: any, index: number) => (
                  <ListboxItem
                    key={index}
                    endContent={
                      <>
                        <Button
                          size="sm"
                          isIconOnly
                          color="danger"
                          onPress={() => hapusPengukuran(row.pengukuran_id)}
                        >
                          <DeleteIcon size={20} />
                        </Button>
                      </>
                    }
                  >
                    {getPengukuranItemInfo(row.pengukuran_id).nama +
                      " | " +
                      row.nilai +
                      " " +
                      getPengukuranItemInfo(row.pengukuran_id).satuan +
                      " | " +
                      row.catatan}
                  </ListboxItem>
                ))}
              </Listbox>
              <div className="flex w-full flex-nowrap gap-1">
                <Select
                  placeholder="Pilih"
                  labelPlacement="outside"
                  value={pengukuranForm.pengukuran_id}
                  onChange={(e) =>
                    setPengukuranForm({
                      ...pengukuranForm,
                      pengukuran_id: e.target.value,
                    })
                  }
                  className="justify-start"
                >
                  {pengukuranItemList.items.map((row: any) => (
                    <SelectItem key={row.id}>
                      {row.nama + " (" + row.satuan + ")"}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  type="number"
                  placeholder="Input Nilai"
                  labelPlacement="outside"
                  value={pengukuranForm.nilai}
                  onChange={(e) =>
                    setPengukuranForm({
                      ...pengukuranForm,
                      nilai: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Input Catatan"
                  labelPlacement="outside"
                  value={pengukuranForm.catatan}
                  onChange={(e) =>
                    setPengukuranForm({
                      ...pengukuranForm,
                      catatan: e.target.value,
                    })
                  }
                />
                <Button isIconOnly color="success" onPress={tambahPengukuran}>
                  <PlusIcon />
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 mb-6 md:mb-0 gap-4">
            <div className="gap-1">
              <label className="">Kebutuhan Bahan</label>
              <Listbox items={daftarBahan} variant="bordered">
                {daftarBahan.map((row: any, index: number) => (
                  <ListboxItem
                    key={index}
                    endContent={
                      <>
                        <Button
                          size="sm"
                          isIconOnly
                          color="danger"
                          onPress={() => hapusBahan(row.bahan_id)}
                        >
                          <DeleteIcon size={20} />
                        </Button>
                      </>
                    }
                  >
                    {getBahanItemInfo(row.bahan_id).nama +
                      " | " +
                      row.jumlah +
                      " " +
                      getBahanItemInfo(row.bahan_id).satuan +
                      " | " +
                      row.catatan}
                  </ListboxItem>
                ))}
              </Listbox>
              <div className="flex w-full flex-nowrap gap-1">
                <Select
                  placeholder="Pilih"
                  labelPlacement="outside"
                  value={bahanForm.bahan_id}
                  onChange={(e) =>
                    setBahanForm({
                      ...bahanForm,
                      bahan_id: e.target.value,
                    })
                  }
                  className="justify-start"
                >
                  {bahanItemList.items.map((row: any) => (
                    <SelectItem key={row.id}>
                      {row.nama + " (" + row.satuan + ")"}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  type="number"
                  placeholder="Input Jumlah"
                  labelPlacement="outside"
                  value={bahanForm.jumlah}
                  onChange={(e) =>
                    setBahanForm({
                      ...bahanForm,
                      jumlah: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Input Catatan"
                  labelPlacement="outside"
                  value={bahanForm.catatan}
                  onChange={(e) =>
                    setBahanForm({
                      ...bahanForm,
                      catatan: e.target.value,
                    })
                  }
                />
                <Button isIconOnly color="success" onPress={tambahBahan}>
                  <PlusIcon />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <Button type="submit" color="primary">
              Simpan
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
