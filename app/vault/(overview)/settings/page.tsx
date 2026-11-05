import type { Metadata } from 'next';
import SettingsPage from '@/app/ui/social/SettingsPage';

export const metadata: Metadata = { title: 'Settings' };

export default function Settings() {
  return <SettingsPage />;
}
