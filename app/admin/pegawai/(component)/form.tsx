"use client";

import { title } from "@/components/primitives";
import { genderList } from "@/helpers/valueHelpers";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { Button } from "@nextui-org/button";
import { DateInput } from "@nextui-org/date-input";
import { DatePicker } from "@nextui-org/date-picker";
import { Input, Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Formik, useFormik } from "formik";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

const FormSchema = Yup.object().shape({
  nip: Yup.string().required("Required"),
  nama: Yup.string().required("Required"),
});

export default function PegawaiForm({ onSubmit, formTitle }: any) {
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
      nip: "",
      no_hp: "",
    },
    onSubmit: (values) => {
      onSubmit(values);
    },
    validationSchema: FormSchema,
  });

  async function getDetail(id: string) {
    const response = await fetch(
      "http://localhost:3007/pegawai/ambil?id=" + id,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.ok) {
      let json = await response.json();
      setValues({
        ...json.hasil,
      });
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
      <h3 className={title()}>{formTitle}</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 my-5">
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input
              label="NIP"
              placeholder="Input NIP"
              labelPlacement="outside"
              name="nip"
              isRequired
              onChange={handleChange}
              value={values.nip}
              isInvalid={touched.nip && errors.nip != null}
              errorMessage={errors.nip}
            />
            {/* {errors.nip && touched.nip && errors.nip} */}
            <Input
              label="Nomor HP"
              placeholder="Input Nomor HP"
              labelPlacement="outside"
              name="no_hp"
              onChange={handleChange}
              value={values.no_hp}
            />
          </div>
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
          </div>
          <div className="flex justify-end mt-5">
            <Button type="submit" color="primary">
              Simpan
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
