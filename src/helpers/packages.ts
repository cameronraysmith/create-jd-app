const packages = {
  dev: {
    // adapters
    "solid-start-vercel": "^0.2.30",
    // tailwind
    tailwindcss: "^3.2.7",
    postcss: "^8.4.21",
    autoprefixer: "^10.4.13",
    // prisma
    prisma: "^4.10.1",
  },
  normal: {
    // prisma
    "@prisma/client": "^4.10.1",
    // prpc
    "@prpc/solid": "^0.2.35",
    "@prpc/vite": "^0.3.21",
    // trpc
    "@tanstack/solid-query": "^5.0.0-beta.15",
    "@trpc/client": "^10.12.0",
    "@trpc/server": "^10.12.0",
    "solid-start-trpc": "^0.0.16",
    "solid-trpc": "^0.0.12-rc.3",
    "solid-trpc->ssr": "0.1.0-sssr.8",
    // next auth
    "@solid-mediakit/auth": "^1.0.0",
    "@auth/core": "^0.10.0",
    "@auth/prisma-adapter": "^1.0.1",
    // upstash ratelimit
    "@upstash/ratelimit": "^0.3.5",
    "@upstash/redis": "^1.20.0",
  },
};

export type IPkgs = typeof packages;
export type KeyOrKeyArray<K extends keyof IPkgs> =
  | keyof IPkgs[K]
  | (keyof IPkgs[K])[];

export function withPackages(optIn: { [K in keyof IPkgs]?: KeyOrKeyArray<K> }) {
  const devs: { [K in keyof IPkgs["dev"]]?: string } = {};
  const normals: { [K in keyof IPkgs["normal"]]?: string } = {};
  for (const keyType in optIn) {
    type OptIn = keyof typeof optIn;
    const __curr = optIn[keyType as OptIn];
    const arrOptIn = Array.isArray(__curr) ? __curr : [__curr];
    for (const curr of arrOptIn) {
      const name = curr?.includes("->") ? curr.split("->")[0] : curr;
      if (keyType === "dev") {
        devs[name as keyof typeof devs] =
          packages.dev[curr as keyof typeof packages.dev];
      } else {
        normals[name as keyof typeof normals] =
          packages.normal[curr as keyof typeof packages.normal];
      }
    }
  }
  return [normals, devs];
}

export type IExpectedPackages = ReturnType<typeof withPackages>;
