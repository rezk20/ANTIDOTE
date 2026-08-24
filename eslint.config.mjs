import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Security boundary rule: prevent privileged scripts/ imports in runtime app and lib code.
  {
    files: ["app/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/scripts/*", "../scripts/*", "../../scripts/*", "scripts/*"],
              message:
                "Security violation: scripts/ contains privileged service-role logic and cannot be imported by runtime app code.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;

