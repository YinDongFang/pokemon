"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
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

export function CreateSpeciesDialog() {
  const [count, setCount] = useState<number>(1);

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
            <Button onClick={() => create(count)} disabled={loading}>
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
                      checked={item.isSelected}
                      onCheckedChange={() =>
                        setIsSelected(item.name, !item.isSelected)
                      }
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
        </DialogContent>
      </Dialog>
    </DialogController>
  );
}
