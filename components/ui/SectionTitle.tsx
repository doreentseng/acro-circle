import { ReactNode } from 'react';

type SectionTitleProps = {
  icon: ReactNode;
  title: string;
};

export default function SectionTitle({ icon, title }: SectionTitleProps) {
  return (
    <h3 className="font-semibold mb-3 flex items-center gap-2 text-[var(--foreground)]">
      <span className="text-pink-600 w-5 h-5 flex items-center justify-center">
        {icon}
      </span>
      {title}
    </h3>
  );
}
