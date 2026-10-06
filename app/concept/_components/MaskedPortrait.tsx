import Image from 'next/image';

type Props = {
  src: string;
  width: number;
  height: number;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
};

/*
  The Masquerade as an image treatment: portraits show as a blood-red
  duotone and drop the mask on hover or keyboard focus.
*/
export default function MaskedPortrait({
  src,
  width,
  height,
  alt,
  sizes,
  preload,
  className = '',
}: Props) {
  return (
    <div
      tabIndex={0}
      className={`group/mask relative isolate overflow-hidden bg-night outline-offset-4 focus-visible:outline-2 focus-visible:outline-blood ${className}`}
    >
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        sizes={sizes}
        preload={preload}
        className='h-full w-full object-cover brightness-110 contrast-[1.35] grayscale transition duration-700 ease-out group-hover/mask:scale-[1.03] group-hover/mask:brightness-100 group-hover/mask:contrast-100 group-hover/mask:grayscale-0 group-focus-visible/mask:brightness-100 group-focus-visible/mask:contrast-100 group-focus-visible/mask:grayscale-0'
      />
      <div className='absolute inset-0 bg-blood opacity-75 mix-blend-multiply transition-opacity duration-700 group-hover/mask:opacity-0 group-focus-visible/mask:opacity-0' />
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(10_9_9/0.7))]' />
    </div>
  );
}
