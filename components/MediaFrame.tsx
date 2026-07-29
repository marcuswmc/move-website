import Image from "next/image";
import { Reveal } from "@/components/Reveal";

type MediaFrameProps = {
  src: string;
  alt: string;
  caption?: string;
  aspect?: string;
  className?: string;
  priority?: boolean;
  delay?: number;
};

export function MediaFrame({ src, alt, caption, aspect = "aspect-[4/5]", className = "", priority, delay }: MediaFrameProps) {
  return (
    <Reveal delay={delay} className={className}>
      <figure className={`group relative ${aspect} overflow-hidden rounded-soft bg-move-black/5`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        {caption && (
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 py-4 text-sm font-medium text-white/90">
            {caption}
          </figcaption>
        )}
      </figure>
    </Reveal>
  );
}
