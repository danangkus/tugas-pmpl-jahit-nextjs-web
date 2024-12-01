"use client";

import { subtitle, title } from "@/components/primitives";
import { API_HOST } from "@/helpers/envHelpers";
import { genderList } from "@/helpers/valueHelpers";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { Button } from "@nextui-org/button";
import { DateInput } from "@nextui-org/date-input";
import { DatePicker } from "@nextui-org/date-picker";
import { Input, Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { isEmpty } from "@nextui-org/shared-utils";
import { Formik, useFormik } from "formik";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAsyncList } from "react-stately";
import { toast } from "react-toastify";
import * as Yup from "yup";

export default function PenggunaForm({ onSubmit, formTitle }: any) {
  const params = useSearchParams();
  const FormSchema = Yup.object().shape({
    password: Yup.string().required("Required").min(6, "Minimal 6 karakter"),
    pegawai_id: Yup.string().required("Required"),
    konfirmasi: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("password"), ""], "Belum sesuai"),
  });
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
      username: "",
      password: "",
      konfirmasi: "",
      pegawai_id: null,
    },
    onSubmit: (values) => {
      onSubmit(values);
    },
    validationSchema: FormSchema,
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

  async function getDetail(id: string) {
    const response = await fetch(API_HOST + "/pengguna/ambil?id=" + id, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      let json = await response.json();
      setValues({
        ...json.hasil,
        pegawai_id: json.hasil.pegawai_id?.toString(),
        konfirmasi: json.hasil.password,
      });
    } else {
      toast("Error!", { type: "error" });
    }
  }

  useEffect(() => {
    let username = "";
    if (!isEmpty(values.pegawai_id)) {
      let filtered: any[] = pegawaiList.items.filter(
        (row: any) => row.id == values.pegawai_id
      );
      if (filtered.length > 0) {
        username = filtered[0].nip;
      }
    }
    setValues({ ...values, username });
  }, [values.pegawai_id]);

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
            <Select
              label="Pegawai"
              placeholder="Pilih Pegawai"
              labelPlacement="outside"
              isRequired
              selectedKeys={[values.pegawai_id ?? ""]}
              name="pegawai_id"
              onChange={handleChange}
              value={values.pegawai_id ?? ""}
              isInvalid={touched.pegawai_id && errors.pegawai_id != null}
              errorMessage={errors.pegawai_id}
            >
              {pegawaiList.items.map((row: any) => (
                <SelectItem key={row.id}>{row.nama}</SelectItem>
              ))}
            </Select>
            <Input
              label="Username"
              placeholder="Username populated here"
              labelPlacement="outside"
              name="username"
              onChange={handleChange}
              value={values.username}
              isDisabled
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input
              label="Password"
              placeholder="Input Password"
              labelPlacement="outside"
              name="password"
              isRequired
              onChange={handleChange}
              value={values.password}
              isInvalid={touched.password && errors.password != null}
              errorMessage={errors.password}
              type="password"
            />
            <Input
              label="Konfirmasi Password"
              placeholder="Input Konfirmasi Password"
              labelPlacement="outside"
              name="konfirmasi"
              isRequired
              onChange={handleChange}
              value={values.konfirmasi}
              isInvalid={touched.konfirmasi && errors.konfirmasi != null}
              errorMessage={errors.konfirmasi}
              type="password"
            />
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
