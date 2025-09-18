import React, { useRef, useEffect, useState } from 'react';

interface LazyHistoryImageProps {
  src: string;
  alt: string;
  className?: string;
}

const LazyHistoryImage: React.FC<LazyHistoryImageProps> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if(imgRef.current) {
            observer.unobserve(imgRef.current);
          }
        }
      },
      { rootMargin: '100px' } 
    );

    const currentRef = imgRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div className="w-full h-full bg-gray-200">
        <img
            ref={imgRef}
            src={isInView ? src : undefined}
            alt={alt}
            className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsLoaded(true)}
            loading="lazy"
        />
    </div>
  );
};

export default LazyHistoryImage;
