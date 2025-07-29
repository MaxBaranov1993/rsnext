"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CarouselProps {
  children: React.ReactNode
  className?: string
  showArrows?: boolean
  showIndicators?: boolean
  autoPlay?: boolean
  interval?: number
  enableSwipe?: boolean
}

interface CarouselContextValue {
  currentSlide: number
  totalSlides: number
  goToSlide: (index: number) => void
  nextSlide: () => void
  prevSlide: () => void
}

const CarouselContext = React.createContext<CarouselContextValue | undefined>(undefined)

export function Carousel({
  children,
  className,
  showArrows = false,
  showIndicators = true,
  autoPlay = false,
  interval = 5000,
  enableSwipe = true,
}: CarouselProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [totalSlides, setTotalSlides] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)
  const [startX, setStartX] = React.useState(0)
  const [translateX, setTranslateX] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const carouselRef = React.useRef<HTMLDivElement>(null)

  const goToSlide = React.useCallback((index: number) => {
    setCurrentSlide(index)
    setTranslateX(0)
  }, [])

  const nextSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
    setTranslateX(0)
  }, [totalSlides])

  const prevSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    setTranslateX(0)
  }, [totalSlides])

  // Touch/Mouse handlers for swipe
  const handleTouchStart = React.useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!enableSwipe) return
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    setStartX(clientX)
  }, [enableSwipe])

  const handleTouchMove = React.useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!enableSwipe || !isDragging) return
    e.preventDefault()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const diff = clientX - startX
    setTranslateX(diff)
  }, [enableSwipe, isDragging, startX])

  const handleTouchEnd = React.useCallback(() => {
    if (!enableSwipe || !isDragging) return
    setIsDragging(false)
    
    if (Math.abs(translateX) > 50) {
      if (translateX > 0) {
        prevSlide()
      } else {
        nextSlide()
      }
    } else {
      setTranslateX(0)
    }
  }, [enableSwipe, isDragging, translateX, prevSlide, nextSlide])

  // Auto-play functionality
  React.useEffect(() => {
    if (!autoPlay || totalSlides <= 1) return

    const timer = setInterval(() => {
      nextSlide()
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, nextSlide, totalSlides])

  // Update total slides count
  React.useEffect(() => {
    if (containerRef.current) {
      const slides = containerRef.current.children
      setTotalSlides(slides.length)
    }
  }, [children])

  const contextValue = React.useMemo(
    () => ({
      currentSlide,
      totalSlides,
      goToSlide,
      nextSlide,
      prevSlide,
    }),
    [currentSlide, totalSlides, goToSlide, nextSlide, prevSlide]
  )

  return (
    <CarouselContext.Provider value={contextValue}>
      <div className={cn("relative overflow-hidden", className)}>
        <div
          ref={carouselRef}
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(calc(-${currentSlide * 100}% + ${translateX}px))`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          <div ref={containerRef} className="flex w-full">
            {children}
          </div>
        </div>

        {showArrows && totalSlides > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous slide</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next slide</span>
            </Button>
          </>
        )}

        {showIndicators && totalSlides > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  index === currentSlide
                    ? "bg-primary"
                    : "bg-primary/50 hover:bg-primary/75"
                )}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </CarouselContext.Provider>
  )
}

export function CarouselItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex-shrink-0 w-full", className)}>
      {children}
    </div>
  )
}

export function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a Carousel component")
  }
  return context
}