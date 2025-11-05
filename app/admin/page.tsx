"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { SpeciesList } from "@/components/SpeciesList";
import { Button } from "@/components/ui/button";
import { CreateSpeciesDialog } from "@/components/CreateSpeciesDialog";
import useDialogStore from "@/store/dialogStore";

export default function AdminPage() {
  const { open } = useDialogStore();

  return (
    <div>
      <header className="backdrop-blur-lg sticky">
        <div className="container flex items-center py-4 justify-between mx-auto">
          <h1>Monsters</h1>
          <ConnectButton />
        </div>
      </header>
      <main className="container mx-auto">
        <Button onClick={() => open("create")}>Create Monster</Button>
        <SpeciesList />
      </main>
      <CreateSpeciesDialog />
    </div>
  );
}
