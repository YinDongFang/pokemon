"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { SpeciesList } from "@/components/SpeciesList";
import { Button } from "@/components/ui/button";
import { CreateSpeciesDialog } from "@/components/CreateSpeciesDialog";
import useDialogStore from "@/store/dialogStore";
import { useReadContract } from "wagmi";
import { abi, address } from "@/contracts/species";
import { Species } from "../types/contract";
import { Sparkles, Zap } from "lucide-react";

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
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl"></div>
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/10">
        <div className="container flex items-center py-5 justify-between mx-auto px-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-linear-to-r from-yellow-400 to-orange-400 rounded-lg blur opacity-50"></div>
              <div className="relative bg-linear-to-r from-yellow-400 to-orange-400 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-lg">
              Monsters
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-6 flex items-center gap-3">
          <Button
            onClick={() => open("create")}
            className="bg-linear-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Zap className="w-4 h-4 mr-2" />
            Create Monster
          </Button>
          <Button
            variant="outline"
            className="ml-2 bg-white/90 backdrop-blur-sm border-2 border-white/50 hover:bg-white hover:shadow-lg transition-all duration-300 font-semibold"
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        </div>
        <SpeciesList loading={loading} species={species as Species[]} />
      </main>
      <CreateSpeciesDialog />
    </div>
  );
}
