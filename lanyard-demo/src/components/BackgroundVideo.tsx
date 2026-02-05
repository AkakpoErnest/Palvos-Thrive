import { motion, useScroll, useTransform } from "framer-motion"

type BackgroundVideoProps = {
  src: string
  fallbackSrc?: string
  overlayClassName?: string
}

function BackgroundVideo({ src, fallbackSrc, overlayClassName }: BackgroundVideoProps) {
  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const y = useTransform(scrollYProgress, [0, 1], [0, -120])

  return (
    <motion.div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ scale, y }}
      aria-hidden="true"
    >
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        {fallbackSrc ? <source src={fallbackSrc} type="video/quicktime" /> : null}
      </video>
      <div
        className={
          overlayClassName ??
          "absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/70"
        }
      />
    </motion.div>
  )
}

export default BackgroundVideo
