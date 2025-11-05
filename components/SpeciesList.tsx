"use client";

import { useEffect, useState } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { Species } from "@/app/types/contract";
import { abi, address } from "@/contracts/species";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { ArrowUpRightIcon, PawPrintIcon } from "lucide-react";

interface SpeciesCardProps {
  id: number;
  species: Species;
  imageUrl?: string;
  metadata?: any;
}

function SpeciesCard({ id, species, imageUrl }: SpeciesCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = "";

  return (
    <div className="species-card">
      <div className="species-card-header">
        <h3>{species.name || `Species #${id}`}</h3>
        {species.possibility > 0 && (
          <span className="rarity">Rarity: {species.possibility}</span>
        )}
      </div>

      <div className="species-card-image">
        {!imageError ? (
          <img
            src={imageSrc}
            alt={species.name || `Species #${id}`}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="image-placeholder">
            <span>No Image</span>
          </div>
        )}
      </div>

      <div className="species-card-body">
        <div className="types">
          <span className="type primary">Type: {species.primaryType}</span>
          {species.secondaryType > 0 && (
            <span className="type secondary">/{species.secondaryType}</span>
          )}
        </div>

        <div className="stats">
          <h4>Base Stats</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">HP</span>
              <span className="stat-value">{species.baseStats.hp}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">ATK</span>
              <span className="stat-value">{species.baseStats.attack}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">DEF</span>
              <span className="stat-value">{species.baseStats.defense}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">SP.ATK</span>
              <span className="stat-value">{species.baseStats.sp_attack}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">SP.DEF</span>
              <span className="stat-value">{species.baseStats.sp_defense}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">SPD</span>
              <span className="stat-value">{species.baseStats.speed}</span>
            </div>
          </div>
        </div>

        <div className="ev-yield">
          <h4>EV Yield</h4>
          <div className="ev-grid">
            <span>HP: {species.evYield.hp}</span>
            <span>ATK: {species.evYield.attack}</span>
            <span>DEF: {species.evYield.defense}</span>
            <span>SP.ATK: {species.evYield.sp_attack}</span>
            <span>SP.DEF: {species.evYield.sp_defense}</span>
            <span>SPD: {species.evYield.speed}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SpeciesList() {
  const [speciesData, setSpeciesData] = useState<
    Array<{ id: number; species: Species }>
  >([]);
  // 读取物种总数
  const { data: speciesCount } = useReadContract({
    address,
    abi,
    functionName: "speciesCount",
  });

  // 创建批量读取请求
  const contractReads = speciesCount
    ? Array.from({ length: Number(speciesCount) }, (_, i) => ({
        address,
        abi,
        functionName: "getSpecies" as const,
        args: [BigInt(i)] as const,
      }))
    : [];

  const { data: speciesResults, isLoading } = useReadContracts({
    contracts: contractReads,
    query: {
      enabled: contractReads.length > 0,
    },
  });

  useEffect(() => {
    if (speciesResults && speciesCount) {
      const data = speciesResults
        .map((result, index) => {
          if (result.status === "success" && result.result) {
            const species = result.result as Species;
            return {
              id: index,
              species,
            };
          }
          return null;
        })
        .filter(Boolean) as Array<{ id: number; species: Species }>;

      setSpeciesData(data);
    }
  }, [speciesResults, speciesCount]);

  if (isLoading) {
    return <Skeleton className="w-full h-full" />;
  }

  if (!speciesCount) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PawPrintIcon />
          </EmptyMedia>
          <EmptyTitle>No Monsters Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any monsters yet. Get started by creating
            your first monster.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="species-list">
      <h2>Pokemon Species ({speciesData.length})</h2>
      <div className="species-grid">
        {speciesData.map(({ id, species }) => (
          <SpeciesCard
            key={id}
            id={id}
            species={species}
            imageUrl={undefined}
          />
        ))}
      </div>
    </div>
  );
}
