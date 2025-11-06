"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { SpeciesList } from "@/components/SpeciesList";
import { Button } from "@/components/ui/button";
import { CreateSpeciesDialog } from "@/components/CreateSpeciesDialog";
import useDialogStore from "@/store/dialogStore";
import { useReadContract } from "wagmi";
import { abi, address } from "@/contracts/species";
import { Species } from "../types/contract";
export default function AdminPage() {
  const { open } = useDialogStore();

  // 读取物种总数
  const {
    data: species = [],
    isLoading: loading,
    refetch,
  } = useReadContract({
    address,
    abi,
    functionName: "getAllSpecies",
  });

  return (
    <div>
      <header className="backdrop-blur-lg sticky">
        <div className="container flex items-center py-4 justify-between mx-auto">
          <h1>Monsters</h1>
          <ConnectButton />
        </div>
      </header>
      <main className="container mx-auto">
        <span>
          <Button onClick={() => open("create")}>Create Monster</Button>
          <Button variant="outline" className="ml-2" onClick={() => refetch()}>
            Refresh
          </Button>
        </span>
        <SpeciesList loading={loading} species={species as Species[]} />
      </main>
      <CreateSpeciesDialog />
    </div>
  );
}
