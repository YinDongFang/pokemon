"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { DialogController } from "./DialogController";
import { useRequest } from "@/hooks/useRequest";
import { Species } from "@/app/types/contract";
import {
  Table,
  TableRow,
  TableHead,
  TableHeader,
  TableCell,
  TableBody,
} from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { useWriteContract } from "wagmi";
import { abi, address } from "@/contracts/species";
import { TYPES } from "@/lib/config";
import { toast } from "sonner";

export function CreateSpeciesDialog() {
  const [count, setCount] = useState<number>(1);
  const [selected, setSelected] = useState<Species[]>([]);

  const handleSelect = (item: Species) => {
    setSelected((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const { writeContractAsync } = useWriteContract();
  const { run: submit, loading: submitLoading } = useRequest(async () => {
    const calls = selected.map((item) => writeContractAsync({
      abi,
      address,
      functionName: "addSpecies",
      args: [{
        name: item.name,
        description: item.description,
        primaryType: TYPES.indexOf(item.primaryType),
        secondaryType: TYPES.indexOf(item.secondaryType),
        possibility: item.possibility,
        baseStats: {
          hp: item.baseStats.hp,
          attack: item.baseStats.attack,
          defense: item.baseStats.defense,
          sp_attack: item.baseStats.sp_attack,
          sp_defense: item.baseStats.sp_defense,
          speed: item.baseStats.speed,
        },
        evYield: {
          hp: item.evYield.hp,
          attack: item.evYield.attack,
          defense: item.evYield.defense,
          sp_attack: item.evYield.sp_attack,
          sp_defense: item.evYield.sp_defense,
          speed: item.evYield.speed,
        },
      }],
    }))
    return Promise.allSettled(calls);
  });

  const handleSubmit = async () => {
    if (selected.length === 0) return toast.error("Please select at least one species");
    submit();
  };

  const {
    run: create,
    loading,
    data,
  } = useRequest<{ data: Species[] }, any>(
    () =>
      fetch("/api/species/create", {
        method: "POST",
        body: JSON.stringify({ count }),
      }).then((res) => res.json()),
    { manual: true, initialValue: { data: [] } }
  );

  const handleCreate = async () => {
    if (count < 1 || count > 20) return toast.error("Count must be between 1 and 20");
    create(count);
  };

  return (
    <DialogController id="create">
      <Dialog>
        <DialogContent className="w-[1000px] max-w-full!">
          <DialogHeader>
            <DialogTitle>Create New Monster</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Label>Count</Label>
            <Input
              className="w-[150px]"
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              min={1}
              max={100}
            />
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? "Generating..." : "Generate"}
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Primary Type</TableHead>
                <TableHead>Secondary Type</TableHead>
                <TableHead>Possibility</TableHead>
                <TableHead>HP</TableHead>
                <TableHead>Attack</TableHead>
                <TableHead>Defense</TableHead>
                <TableHead>Sp. Attack</TableHead>
                <TableHead>Sp. Defense</TableHead>
                <TableHead>Speed</TableHead>
                <TableHead>EV HP</TableHead>
                <TableHead>EV Attack</TableHead>
                <TableHead>EV Defense</TableHead>
                <TableHead>EV Sp. Attack</TableHead>
                <TableHead>EV Sp. Defense</TableHead>
                <TableHead>EV Speed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((item: Species) => (
                <TableRow key={item.name}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(item)}
                      onCheckedChange={() => handleSelect(item)}
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell
                    className="max-w-[200px] truncate"
                    title={item.description}
                  >
                    {item.description}
                  </TableCell>
                  <TableCell>{item.primaryType}</TableCell>
                  <TableCell>{item.secondaryType}</TableCell>
                  <TableCell>{item.possibility}</TableCell>
                  <TableCell>{item.baseStats.hp}</TableCell>
                  <TableCell>{item.baseStats.attack}</TableCell>
                  <TableCell>{item.baseStats.defense}</TableCell>
                  <TableCell>{item.baseStats.sp_attack}</TableCell>
                  <TableCell>{item.baseStats.sp_defense}</TableCell>
                  <TableCell>{item.baseStats.speed}</TableCell>
                  <TableCell>{item.evYield.hp}</TableCell>
                  <TableCell>{item.evYield.attack}</TableCell>
                  <TableCell>{item.evYield.defense}</TableCell>
                  <TableCell>{item.evYield.sp_attack}</TableCell>
                  <TableCell>{item.evYield.sp_defense}</TableCell>
                  <TableCell>{item.evYield.speed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={submitLoading}>
              {submitLoading ? "Loading..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DialogController>
  );
}
