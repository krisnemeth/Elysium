import RememberPlace from '@/app/ui/dashboard/RememberPlace';

export default function VaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RememberPlace />
      {children}
    </>
  );
}
