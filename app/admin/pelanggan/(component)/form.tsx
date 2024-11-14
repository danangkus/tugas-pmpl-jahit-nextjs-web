"use client";

import { title } from "@/components/primitives";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { Button } from "@nextui-org/button";
import { DatePicker } from "@nextui-org/date-picker";
import { Input, Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Formik, useFormik } from "formik";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const FormSchema = Yup.object().shape({
  nama: Yup.string().required("Required"),
});

export default function PelangganForm({ onSubmit, formTitle }: any) {
  const params = useSearchParams();
  const { handleSubmit, handleChange, values, setValues, errors, touched } =
    useFormik({
      initialValues: {
        nama: "",
        no_hp: "",
        jenis_kelamin: "",
        tanggal_lahir: null,
        alamat: "",
      },
      onSubmit: (values) => {
        onSubmit(values);
      },
      validationSchema: FormSchema,
    });
  const genderList = [
    { key: "L", label: "Laki-laki" },
    { key: "P", label: "Perempuan" },
  ];

  async function getDetail(id: string) {
    const response = await fetch(
      "http://localhost:3007/pelanggan/ambil?id=" + id,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.ok) {
      let json = await response.json();
      setValues({
        ...json.hasil,
        tanggal_lahir:
          json.hasil.tanggal_lahir &&
          parseDate(json.hasil.tanggal_lahir.split("T")[0]),
      });
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
      <h3 className={title()}>{formTitle}</h3>
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
            {errors.nama && touched.nama && errors.nama}
            <Input
              label="No HP"
              placeholder="Input No HP"
              labelPlacement="outside"
              name="no_hp"
              onChange={handleChange}
              value={values.no_hp}
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Select
              label="Jenis Kelamin"
              placeholder="Pilih Jenis Kelamin"
              labelPlacement="outside"
              name="jenis_kelamin"
              onChange={handleChange}
              selectedKeys={[values.jenis_kelamin]}
            >
              {genderList.map((row: any) => (
                <SelectItem key={row.key}>{row.label}</SelectItem>
              ))}
            </Select>
            <DatePicker
              label="Tanggal Lahir"
              labelPlacement="outside"
              maxValue={today(getLocalTimeZone())}
              name="tanggal_lahir"
              onChange={handleChange}
              value={values.tanggal_lahir}
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Textarea
              label="Alamat"
              placeholder="Input Alamat"
              labelPlacement="outside"
              name="alamat"
              onChange={handleChange}
              value={values.alamat}
            />
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
