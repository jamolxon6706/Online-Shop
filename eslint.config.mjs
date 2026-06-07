import nextConfig from "eslint-config-next";

const config = [
  ...nextConfig,
  {
    ignores: ["templates/**", ".venv/**"],
  },
  // React 19 / hooks plugin 7: these are stricter than typical Next.js + shadcn patterns
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react-hooks/static-components": "off",
      "react/no-unescaped-entities": "off",
    },
  },
];

export default config;
