// components/AccessibleSelect.tsx
import { ChevronDown } from "lucide-react";

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
};

export default function AccessibleSelect({ label, children, ...props }: Props) {
  return (
    <div className="space-y-2">
      <label htmlFor={props.id} className="text-sm font-medium text-white">
        {label}
      </label>
      <div className="relative">
        <select
          {...props}
          className="w-full appearance-none bg-background border border-border rounded-xl px-5 py-4 pr-12 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          {children}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}