import BackgroundVideo from "./components/BackgroundVideo"

function App() {
  return (
    <div className="relative min-h-screen text-white">
      <BackgroundVideo src="/BA.mp4" fallbackSrc="/BA.mov" />

      <section className="min-h-[90vh] px-6 pb-16 pt-28 md:px-12 lg:px-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-white/70">
            Palvos Thrive
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
            Websites that <span className="text-white/80">thrive.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80">
            We design with purpose and build with precision. A digital brand studio
            focused on story, clarity, and conversions.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black">
              Start a project
            </button>
            <button className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white">
              View our work
            </button>
          </div>
        </div>
      </section>

      <section className="bg-transparent px-6 py-20 md:px-12 lg:px-20" id="about">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold md:text-4xl">About us</h2>
          <p className="mt-4 text-lg text-white/80">
            Palvos Thrive builds company and personal websites that feel human,
            intentional, and sharp. Every project starts by aligning what you love,
            what you do best, and what the market needs.
          </p>
        </div>
      </section>

      <section className="bg-transparent px-6 pb-24 pt-10 md:px-12 lg:px-20" id="ikigai">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold md:text-4xl">Philosophy</h2>
          <p className="mt-4 text-lg text-white/80">
            Our Ikigai process blends brand strategy, visual craft, and performance.
            The result is a site that looks great and moves people to act.
          </p>
        </div>
      </section>
    </div>
  )
}

export default App
