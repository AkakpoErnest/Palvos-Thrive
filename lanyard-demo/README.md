# Lanyard Demo

This project was set up to use `npx shadcn add @react-bits/Lanyard-JS-CSS`.

## What was done

1. **Created** a Vite + React + TypeScript project in `lanyard-demo/`
2. **Configured** Tailwind CSS v4 and shadcn/ui
3. **Ran** `npx shadcn add @react-bits/Lanyard-JS-CSS` successfully
4. **Added** the @react-bits registry to `components.json`
5. **Installed** the Lanyard assets:
   - `src/components/card.glb` – 3D model
   - `src/components/lanyard.png` – texture image

## Running the app

```bash
cd lanyard-demo
npm run dev
```

## Using the full Lanyard component

The shadcn registry only provides the **assets** for the Lanyard component. The React component code is not included. To use the full 3D Lanyard:

1. Visit [reactbits.dev/components/lanyard](https://reactbits.dev/components/lanyard)
2. Open the **Code** tab and copy the component code
3. Install dependencies:
   ```bash
   npm install @react-three/fiber @react-three/drei @react-three/rapier three
   ```
4. Paste the component into your project (e.g. `src/components/Lanyard.tsx`)
5. Use it: `<Lanyard />`

## Project structure

```
lanyard-demo/
├── src/
│   ├── components/    # Lanyard assets (card.glb, lanyard.png)
│   ├── lib/          # shadcn utils
│   └── App.tsx
├── components.json   # shadcn config (includes @react-bits registry)
└── package.json
```
