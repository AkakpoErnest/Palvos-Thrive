import lanyardImg from "./components/lanyard.png"

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <h1 className="text-3xl font-bold mb-4">Lanyard Demo</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        <code>npx shadcn add @react-bits/Lanyard-JS-CSS</code> has been run successfully.
        The Lanyard assets (card.glb, lanyard.png) are in <code>src/components/</code>.
      </p>
      <div className="flex gap-4">
        <img
          src={lanyardImg}
          alt="Lanyard"
          className="w-48 h-auto rounded-lg border border-border"
        />
      </div>
      <p className="text-sm text-muted-foreground mt-8 text-center max-w-lg">
        The full 3D Lanyard component uses Three.js, @react-three/fiber, and physics libraries.
        To use it, copy the component code from{" "}
        <a
          href="https://reactbits.dev/components/lanyard"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          reactbits.dev/components/lanyard
        </a>{" "}
        and install: <code>@react-three/fiber @react-three/drei @react-three/rapier three</code>
      </p>
    </div>
  )
}

export default App
