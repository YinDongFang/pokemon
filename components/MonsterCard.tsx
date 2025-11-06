import { cn } from "@/lib/utils";
import { CloudAlertIcon } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "./ui/empty";
import { animated, useSpring } from "@react-spring/web";

export function MonsterCard({
  url,
  alt,
  className,
  children,
}: PropsWithChildren<{
  url: string;
  alt: string;
  className?: string;
}>) {
  const [imageError, setImageError] = useState(false);
  const [animatedStyle, spring] = useSpring(
    () => ({
      from: { transform: "rotateX(0deg) rotateY(0deg)" },
      config: { duration: 100 },
    }),
    []
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const { width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((offsetX - width / 2) / width) * 60;
    const y = ((offsetY - height / 2) / height) * 35;
    spring.start({ transform: `rotateX(${-y}deg) rotateY(${x}deg)` });
  };

  const handleMouseLeave = () => {
    spring.start({ transform: "rotateX(0deg) rotateY(0deg)" });
  };

  const image = imageError ? (
    <div
      className={cn(
        "bg-gray-100 aspect-3/4 flex items-center justify-center",
        className
      )}
    >
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-15 bg-white">
            <CloudAlertIcon className="size-10" />
          </EmptyMedia>
          <EmptyTitle>Error</EmptyTitle>
          <EmptyDescription>Image loading failed</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  ) : (
    <img
      className="w-full h-full block"
      src={url}
      alt={alt}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );

  return (
    <div className="relative perspective-midrange hover:z-1000 z-0">
      <animated.div
        className={cn(
          "relative overflow-hidden transition-[scale,translate] duration-300 hover:scale-110 hover:translate-y-[-10px]",
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={animatedStyle}
      >
        {image}
        <div className="absolute inset-0">{children}</div>
      </animated.div>
    </div>
  );
}
