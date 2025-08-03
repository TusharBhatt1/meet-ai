"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import React from "react";

type Option = { 
  label: string; 
  value: string; 
  children?: React.ReactNode;
};

interface ComboBoxProps {
  options: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
  onSelect?: (value: string) => void;
  onSearch?: (search: string) => void;
  placeholder?: string;
  className?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
}

export function ComboBox({
  options,
  value,
  onValueChange,
  onSelect,
  onSearch,
  placeholder = "Select an option...",
  className,
  searchPlaceholder = "Search...",
  emptyMessage = "No result found.",
  disabled = false,
}: ComboBoxProps) {
  const [open, setOpen] = useState(false);

  const selected = options?.find((opt) => opt.value === value);

  const handleSelect = (selectedValue: string) => {
    const newValue = selectedValue === value ? "" : selectedValue;
    onValueChange?.(newValue);
    onSelect?.(selectedValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-[250px] justify-between", className)}
        >
          {selected?.label || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput 
            placeholder={searchPlaceholder} 
            onValueChange={onSearch}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options?.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  onSelect={handleSelect}
                >
                  {opt.children || opt.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === opt.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}