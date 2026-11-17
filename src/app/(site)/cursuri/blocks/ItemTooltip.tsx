"use client";

import React, { useState } from "react";
import IconButton from "@/components/ui/icon-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * The "i" button next to a price name, opening the price item's tooltip
 * (Prețuri: "Tooltip"). Tap toggles it, so it also works on phones. Shared by
 * the Cursuri price cards and the price box of the registration form.
 */
const ItemTooltip: React.FC<{ text: string }> = ({ text }) => {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <IconButton
          icon="info"
          label="Detalii"
          size="sm"
          onClick={() => setOpen((v) => !v)}
          className="-my-3 -mx-3 text-secondary"
        />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-60">
        {text}
      </TooltipContent>
    </Tooltip>
  );
};

export default ItemTooltip;
