import type { IUtil } from "~types";

const getQueries: IUtil = (ctx) => {
  const usesRateLimit = ctx.installers.includes("Upstash Ratelimit");
  const useAuth = ctx.installers.includes("AuthJS");
  return `import { query$ } from "@prpc/solid";
import { z } from "zod";${
    useAuth || usesRateLimit
      ? `\nimport { ${
          useAuth && usesRateLimit
            ? "authMw, rateLimitMW"
            : useAuth
            ? "authMw"
            : "rateLimitMW"
        } } from "./middleware";`
      : ""
  }
  
export const helloQuery = query$({
  queryFn: ({ payload }) => {
    return \`server says hello: \${payload.name}\`;
  },
  key: "hello",
  schema: z.object({ name: z.string() }),
});${
    useAuth
      ? `\n\nexport const protectedQuery = query$({
  queryFn: ({ ctx$ }) => {
    return \`protected -\${ctx$.session.user.name}\`;
  },
  key: "protected-1",
  middlewares: [authMw],
});
`
      : ""
  }${
    usesRateLimit
      ? `\n\nexport const rateLimitedQuery = query$({
  queryFn: () => {
    return "You are not limited, yay!";
  },
  key: "limited",
  middlewares: [rateLimitMW],
});`
      : ""
  }
`;
};

export default getQueries;
