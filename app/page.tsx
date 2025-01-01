"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { FormEvent, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { API_HOST } from "@/helpers/envHelpers";
import { Alert } from "@nextui-org/alert";
import { isEmpty } from "@/helpers/valueHelpers";

export default function Home() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const body: any = Object.fromEntries(formData.entries());

    const response = await fetch(API_HOST + "/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    // Handle response if necessary
    if (response.ok) {
      let json = await response.json();
      localStorage.setItem("username", body.username);
      localStorage.setItem("role", json.hasil.role);
      router.push("/admin");
    } else {
      let json = await response.json();
      setErrorMessage(json.pesan);
    }
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
          <Image
            alt="nextui logo"
            height={40}
            radius="sm"
            src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md">Login</p>
            <p className="text-small text-default-500">
              Sistem Manajemen Jahit
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="flex w-full flex-wrap gap-4">
              {!isEmpty(errorMessage) && (
                <Alert
                  color="danger"
                  title="Gagal"
                  description={errorMessage}
                />
              )}
              <Input type="text" name="username" label="Username" />
              <Input type="password" name="password" label="Password" />
              <Button type="submit">Masuk</Button>
            </div>
          </form>
        </CardBody>
        {/* <Divider />
        <CardFooter>
          <Link
            isExternal
            showAnchorIcon
            href="https://github.com/nextui-org/nextui"
          >
            Visit source code on GitHub.
          </Link>
        </CardFooter> */}
      </Card>
    </section>
  );
}
