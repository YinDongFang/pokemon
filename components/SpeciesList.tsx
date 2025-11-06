"use client";

import { Species } from "@/app/types/contract";
import { Skeleton } from "./ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { PawPrintIcon } from "lucide-react";
import { Button } from "./ui/button";
import useDialogStore from "@/store/dialogStore";
import { GenerateImageDialog } from "./GenerateImageDialog";
import { MonsterCard } from "./MonsterCard";

interface SpeciesCardProps {
  id: number;
  species: Species;
}

function SpeciesCard({ id, species }: SpeciesCardProps) {
  const { open } = useDialogStore();

  const { hash } = species;
  const imageSrc = `${process.env.NEXT_PUBLIC_PINATA_BASE_URL}/${hash}`;

  if (!hash) {
    return (
      <div className="rounded-[15px] bg-gray-100 aspect-3/4 flex items-center justify-center shadow-lg shadow-black/10">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-15 bg-white">
              <PawPrintIcon className="size-10" />
            </EmptyMedia>
            <EmptyTitle>No Image</EmptyTitle>
            <EmptyDescription>This monster has no image yet.</EmptyDescription>
            <EmptyContent>
              <Button onClick={() => open("imagen", { monster: species, id })}>
                Generate Image
              </Button>
            </EmptyContent>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <MonsterCard
      url={imageSrc}
      alt={species.name || `Species #${id}`}
      className="rounded-[15px] aspect-3/4 shadow-lg shadow-black/10"
    />
  );
}

export function SpeciesList({
  loading,
  species,
}: {
  loading: boolean;
  species: Species[];
}) {
  if (loading) {
    return <Skeleton className="w-full h-full" />;
  }

  if (!species?.length) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PawPrintIcon />
          </EmptyMedia>
          <EmptyTitle>No Monsters Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t create any monsters yet. Get started by creating
            your first monster.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold">Monsters ({species.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 mt-4">
        {species.map((item, index) => (
          <SpeciesCard key={index} id={index} species={item} />
        ))}
      </div>
      <GenerateImageDialog />
    </div>
  );
}
