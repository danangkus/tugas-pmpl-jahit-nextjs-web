"use client";

import { title } from "@/components/primitives";
import { genderList, getBase64 } from "@/helpers/valueHelpers";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { Button } from "@nextui-org/button";
import { DateInput } from "@nextui-org/date-input";
import { DatePicker } from "@nextui-org/date-picker";
import { Image } from "@nextui-org/image";
import { Input, Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Formik, useFormik } from "formik";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

const FormSchema = Yup.object().shape({
  nama: Yup.string().required("Required"),
});

export default function ModelForm({ onSubmit, formTitle }: any) {
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
      jenis_kelamin: "",
      deskripsi: "",
    },
    onSubmit: (values) => {
      onSubmit({ ...values, gambar_base64: base64 });
    },
    validationSchema: FormSchema,
  });
  const [base64, setBase64] = useState<string>();

  async function getDetail(id: string) {
    const response = await fetch("http://localhost:3007/model/ambil?id=" + id, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      let json = await response.json();
      setValues({ ...json.hasil });
      setBase64(json.hasil.gambar_base64);
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
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <div className="flex w-full flex-col gap-1">
              <label className="">Contoh Gambar</label>
              <Image src={base64} className="mx-auto max-h-80" />
              <Input
                type="file"
                labelPlacement="outside"
                // value={dokumenForm.file}
                onChange={(e) => {
                  if (e.target.files) {
                    getBase64(e.target.files[0], (r) => {
                      setBase64(r);
                    });
                  }
                }}
              />
            </div>
            <Textarea
              label="Deskripsi"
              placeholder="Input Deskripsi"
              labelPlacement="outside"
              name="deskripsi"
              onChange={handleChange}
              value={values.deskripsi}
              defaultValue=""
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
