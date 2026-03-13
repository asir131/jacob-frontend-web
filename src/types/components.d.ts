import * as React from 'react';

// Generic component type with all HTML attributes + children
type CP<E extends React.ElementType = 'div'> = React.ComponentPropsWithRef<E> & {
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
};

// Button
declare module '@/components/ui/button' {
  export interface ButtonProps extends CP<'button'> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
  }
  export const Button: React.ForwardRefExoticComponent<ButtonProps>;
  export function buttonVariants(props?: { variant?: string; size?: string; className?: string }): string;
}

// Input
declare module '@/components/ui/input' {
  export const Input: React.ForwardRefExoticComponent<CP<'input'> & { type?: string }>;
}

// Badge
declare module '@/components/ui/badge' {
  export interface BadgeProps extends CP<'div'> {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  }
  export function Badge(props: BadgeProps): React.JSX.Element;
  export function badgeVariants(props?: { variant?: string }): string;
}

// Card
declare module '@/components/ui/card' {
  export const Card: React.ForwardRefExoticComponent<CP>;
  export const CardHeader: React.ForwardRefExoticComponent<CP>;
  export const CardTitle: React.ForwardRefExoticComponent<CP<'h3'>>;
  export const CardDescription: React.ForwardRefExoticComponent<CP<'p'>>;
  export const CardContent: React.ForwardRefExoticComponent<CP>;
  export const CardFooter: React.ForwardRefExoticComponent<CP>;
}

// Avatar
declare module '@/components/ui/avatar' {
  export const Avatar: React.ForwardRefExoticComponent<CP>;
  export const AvatarImage: React.ForwardRefExoticComponent<CP<'img'> & { src?: string; alt?: string }>;
  export const AvatarFallback: React.ForwardRefExoticComponent<CP>;
}

// Tabs
declare module '@/components/ui/tabs' {
  export const Tabs: React.FC<CP & { defaultValue?: string; value?: string; onValueChange?: (v: string) => void }>;
  export const TabsList: React.ForwardRefExoticComponent<CP>;
  export const TabsTrigger: React.ForwardRefExoticComponent<CP<'button'> & { value: string }>;
  export const TabsContent: React.ForwardRefExoticComponent<CP & { value: string }>;
}

// Select
declare module '@/components/ui/select' {
  export const Select: React.FC<{ children?: React.ReactNode; defaultValue?: string; value?: string; onValueChange?: (v: string) => void; required?: boolean }>;
  export const SelectGroup: React.FC<CP>;
  export const SelectValue: React.FC<{ placeholder?: string }>;
  export const SelectTrigger: React.ForwardRefExoticComponent<CP<'button'>>;
  export const SelectContent: React.ForwardRefExoticComponent<CP & { position?: string }>;
  export const SelectItem: React.ForwardRefExoticComponent<CP & { value: string }>;
}

// Checkbox
declare module '@/components/ui/checkbox' {
  export const Checkbox: React.ForwardRefExoticComponent<CP<'button'> & {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }>;
}

// RadioGroup
declare module '@/components/ui/radio-group' {
  export const RadioGroup: React.ForwardRefExoticComponent<CP & {
    defaultValue?: string;
    value?: string;
    onValueChange?: (v: string) => void;
  }>;
  export const RadioGroupItem: React.ForwardRefExoticComponent<CP<'button'> & {
    value: string;
    disabled?: boolean;
  }>;
}

// Slider
declare module '@/components/ui/slider' {
  export const Slider: React.ForwardRefExoticComponent<CP & {
    defaultValue?: number[];
    value?: number[];
    onValueChange?: (v: number[]) => void;
    min?: number;
    max?: number;
    step?: number;
  }>;
}

// Accordion
declare module '@/components/ui/accordion' {
  export const Accordion: React.FC<CP & { type: 'single' | 'multiple'; collapsible?: boolean }>;
  export const AccordionItem: React.ForwardRefExoticComponent<CP & { value: string }>;
  export const AccordionTrigger: React.ForwardRefExoticComponent<CP<'button'>>;
  export const AccordionContent: React.ForwardRefExoticComponent<CP>;
}

// Dialog
declare module '@/components/ui/dialog' {
  export const Dialog: React.FC<CP & { open?: boolean; onOpenChange?: (open: boolean) => void }>;
  export const DialogTrigger: React.ForwardRefExoticComponent<CP<'button'> & { asChild?: boolean }>;
  export const DialogContent: React.ForwardRefExoticComponent<CP>;
  export const DialogHeader: React.FC<CP>;
  export const DialogFooter: React.FC<CP>;
  export const DialogTitle: React.ForwardRefExoticComponent<CP>;
  export const DialogDescription: React.ForwardRefExoticComponent<CP>;
  export const DialogClose: React.ForwardRefExoticComponent<CP<'button'>>;
  export const DialogPortal: React.FC<CP>;
  export const DialogOverlay: React.ForwardRefExoticComponent<CP>;
}

// DropdownMenu
declare module '@/components/ui/dropdown-menu' {
  export const DropdownMenu: React.FC<CP>;
  export const DropdownMenuTrigger: React.ForwardRefExoticComponent<CP<'button'> & { asChild?: boolean }>;
  export const DropdownMenuContent: React.ForwardRefExoticComponent<CP & { align?: string; sideOffset?: number }>;
  export const DropdownMenuItem: React.ForwardRefExoticComponent<CP & { inset?: boolean }>;
  export const DropdownMenuSeparator: React.ForwardRefExoticComponent<CP>;
  export const DropdownMenuLabel: React.ForwardRefExoticComponent<CP & { inset?: boolean }>;
  export const DropdownMenuGroup: React.FC<CP>;
  export const DropdownMenuPortal: React.FC<CP>;
  export const DropdownMenuSub: React.FC<CP>;
  export const DropdownMenuRadioGroup: React.FC<CP>;
}

// Popover
declare module '@/components/ui/popover' {
  export const Popover: React.FC<CP>;
  export const PopoverTrigger: React.ForwardRefExoticComponent<CP<'button'> & { asChild?: boolean }>;
  export const PopoverContent: React.ForwardRefExoticComponent<CP & { align?: string; sideOffset?: number }>;
}

// ScrollArea
declare module '@/components/ui/scroll-area' {
  export const ScrollArea: React.ForwardRefExoticComponent<CP>;
  export const ScrollBar: React.ForwardRefExoticComponent<CP & { orientation?: string }>;
}

// Sheet
declare module '@/components/ui/sheet' {
  export const Sheet: React.FC<CP & { open?: boolean; onOpenChange?: (open: boolean) => void }>;
  export const SheetTrigger: React.ForwardRefExoticComponent<CP<'button'> & { asChild?: boolean }>;
  export const SheetContent: React.ForwardRefExoticComponent<CP & { side?: 'top' | 'bottom' | 'left' | 'right' }>;
  export const SheetHeader: React.FC<CP>;
  export const SheetFooter: React.FC<CP>;
  export const SheetTitle: React.ForwardRefExoticComponent<CP>;
  export const SheetDescription: React.ForwardRefExoticComponent<CP>;
  export const SheetClose: React.ForwardRefExoticComponent<CP<'button'>>;
  export const SheetPortal: React.FC<CP>;
  export const SheetOverlay: React.ForwardRefExoticComponent<CP>;
}

// Table
declare module '@/components/ui/table' {
  export const Table: React.ForwardRefExoticComponent<CP<'table'>>;
  export const TableHeader: React.ForwardRefExoticComponent<CP<'thead'>>;
  export const TableBody: React.ForwardRefExoticComponent<CP<'tbody'>>;
  export const TableFooter: React.ForwardRefExoticComponent<CP<'tfoot'>>;
  export const TableRow: React.ForwardRefExoticComponent<CP<'tr'>>;
  export const TableHead: React.ForwardRefExoticComponent<CP<'th'>>;
  export const TableCell: React.ForwardRefExoticComponent<CP<'td'>>;
  export const TableCaption: React.ForwardRefExoticComponent<CP<'caption'>>;
}

// Calendar
declare module '@/components/ui/calendar' {
  export function Calendar(props: CP & {
    mode?: string;
    selected?: Date | Date[];
    onSelect?: (date: Date | undefined) => void;
    initialFocus?: boolean;
    classNames?: Record<string, string>;
    showOutsideDays?: boolean;
    [key: string]: any;
  }): React.JSX.Element;
}
