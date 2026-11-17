type SmallButtonProps = {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** The name a screen reader hears when the visible text is the same on every row. */
  label?: string;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "children" | "className">;

const SMALL =
  "flex min-h-(--portal-tap) items-center border-control border-line bg-surface-raised px-(--portal-small-btn-pad-x) text-(length:--portal-text-14) font-bold text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-(--focus-offset) focus-visible:outline-focus";

/** The compact outline button of a list row ("Mută", "Scoate"). */
export function SmallButton({ children, onClick, label, className, ...rest }: SmallButtonProps) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className={className ? `${SMALL} ${className}` : SMALL} {...rest}>
      {children}
    </button>
  );
}
