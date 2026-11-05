import { cookies } from 'next/headers';
import { COVER_COOKIE, COVERS, coverIndex, type Cover } from '@/app/ui/landing/covers';

// The cover you came in through: the last one chosen on the landing, Masquerade until then.
export async function enteredCover(): Promise<Cover> {
  return COVERS[coverIndex((await cookies()).get(COVER_COOKIE)?.value)];
}
