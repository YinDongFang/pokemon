"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { DialogController } from "./DialogController";
import useDialogStore from "@/store/dialogStore";
import { Species } from "@/app/types/contract";
import { useRequest } from "@/hooks/useRequest";
import { useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { MonsterCard } from "./MonsterCard";
import { toast } from "sonner";
import { useWriteContract } from "wagmi";
import { address } from "@/contracts/species";
import { abi } from "@/contracts/species";

export function GenerateImageDialog() {
  const { ids, close } = useDialogStore();
  const { monster, id } =
    (ids["imagen"]?.data as {
      monster: Species;
      id: number;
    }) || {};

  const {
    data,
    loading: imagenLoading,
    run: imagen,
    mutate,
  } = useRequest(
    (data) =>
      fetch("/api/species/imagen", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    { manual: true }
  );

  useEffect(() => {
    if (monster) imagen(monster);
  }, [monster]);

  const handleImagen = () => {
    imagen(monster);
  };

  const { writeContractAsync } = useWriteContract();
  const { loading: uploadLoading, run: upload } = useRequest(
    async (data) => {
      const buffer = Buffer.from(data.base64.split(",")[1], "base64");
      const file = new File([buffer], "image.png", { type: "image/png" });
      const formData = new FormData();
      formData.append("file", file);
      const result = await fetch("/api/file/upload", {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
      const hash = result.cid;
      return writeContractAsync({
        address: address,
        abi: abi,
        functionName: "setSpeciesHash",
        args: [BigInt(id), hash],
      });
    },
    {
      manual: true,
      successMessage: "File uploaded successfully",
      onSuccess: () => close("imagen"),
    }
  );

  const handleUpload = () => {
    if (!data) return toast.error("Please generate an image first");
    upload(data);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) mutate(undefined);
  };

  return (
    <DialogController id="imagen" onOpenChange={handleOpenChange}>
      <Dialog>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Imagen</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            {data && !imagenLoading ? (
              <MonsterCard
                url={data.base64}
                alt={monster?.name}
                className="rounded-[15px] w-[350px] shadow-lg shadow-black/10"
              />
            ) : (
              <Skeleton className="rounded-[15px] w-[350px] aspect-3/4 shadow-lg shadow-black/10" />
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleImagen} disabled={imagenLoading}>
              {imagenLoading ? "Loading..." : "Imagen"}
            </Button>
            <Button onClick={handleUpload} disabled={uploadLoading}>
              {uploadLoading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DialogController>
  );
}
