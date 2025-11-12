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
  const [animatedProperties, spring] = useSpring(
    () => ({
      from: {
        "--x": 0.5,
        "--y": 0.5,
        "--rotateX": "0deg",
        "--rotateY": "0deg",
        "--px": "50%",
        "--py": "50%",
        "--distance": 0,
      },
      config: { duration: 100 },
    }),
    []
  );
  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const { width, height } = e.currentTarget.getBoundingClientRect();
    const x = offsetX / width;
    const y = offsetY / height;
    const centerX = x - 0.5;
    const centerY = y - 0.5;
    const ry = centerX * 60;
    const rx = -centerY * 35;
    spring.start({
      "--rotateX": `${rx}deg`,
      "--rotateY": `${ry}deg`,
      "--x": x,
      "--y": y,
      "--px": `${x * 100}%`,
      "--py": `${y * 100}%`,
      "--distance": Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2)),
    });
  };

  const handleMouseLeave = () => {
    spring.start({
      "--rotateX": "0deg",
      "--rotateY": "0deg",
      "--x": 0.5,
      "--y": 0.5,
      "--px": "50%",
      "--py": "50%",
      "--distance": 0,
    });
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
    <animated.div
      className="relative perspective-midrange hover:z-1000 z-0"
      style={animatedProperties as any}
    >
      <div
        className={cn(
          "relative overflow-hidden transition-[scale,translate] duration-300 hover:scale-110 hover:translate-y-[-10px]",
          className
        )}
        style={{
          transform: `rotateX(var(--rotateX)) rotateY(var(--rotateY))`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {image}
        <div
          className="absolute inset-0"
          style={
            {
              "--r-clr-1": "hsl(0, 57%, 37%)",
              "--r-clr-2": "hsl(40, 53%, 39%)",
              "--r-clr-3": "hsl(90, 60%, 35%)",
              "--r-clr-4": "hsl(180, 60%, 35%)",
              "--r-clr-5": "hsl(180, 60%, 35%)",
              "--r-clr-6": "hsl(210, 57%, 39%)",
              "--r-clr-7": "hsl(280, 55%, 31%)",
              backgroundImage: `linear-gradient(-45deg, var(--r-clr-1), var(--r-clr-5)),
              linear-gradient(-30deg, var(--r-clr-1), var(--r-clr-2), var(--r-clr-3), var(--r-clr-4), var(--r-clr-5), var(--r-clr-6), var(--r-clr-7), var(--r-clr-1), var(--r-clr-2), var(--r-clr-3), var(--r-clr-4), var(--r-clr-5), var(--r-clr-6), var(--r-clr-7), var(--r-clr-1), var(--r-clr-2), var(--r-clr-3), var(--r-clr-4), var(--r-clr-5), var(--r-clr-6), var(--r-clr-7), var(--r-clr-1))`,
              backgroundBlendMode: "luminosity, soft-light",
              backgroundSize: `200% 200%,
              400% 400%`,
              backgroundPosition: `calc(25% + (50% * var(--x))) calc(25% + (50% * var(--y))),
                calc(25% + (var(--px) / 200 * 100%)) calc(25% + (var(--py) / 2))`,
              filter:
                "brightness(calc((var(--distance) * 0.5) + .5)) contrast(2) saturate(1)",
              opacity: "var(--distance)",
              mixBlendMode: "plus-lighter",
            } as any
          }
        />
        <div className="absolute inset-0">{children}</div>
      </div>
    </animated.div>
  );
}
