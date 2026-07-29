import { galleryImages } from "@/data/images";
import { MediaFrame } from "@/components/MediaFrame";

const layout = [
  { span: "col-span-2 md:col-span-3", aspect: "aspect-[4/3]" },
  { span: "col-span-2 md:col-span-3", aspect: "aspect-[4/3]" },
  { span: "col-span-1 md:col-span-2", aspect: "aspect-square" },
  { span: "col-span-1 md:col-span-2", aspect: "aspect-square" },
  { span: "col-span-1 md:col-span-2", aspect: "aspect-square" },
  { span: "col-span-1 md:col-span-2", aspect: "aspect-square" },
];

export function Gallery() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-6 md:gap-5">
      {galleryImages.slice(0, layout.length).map((image, index) => (
        <MediaFrame
          key={image.src}
          src={image.src}
          alt={image.alt}
          aspect={layout[index].aspect}
          delay={index * 0.06}
          className={layout[index].span}
        />
      ))}
    </div>
  );
}
