import tseslint from "typescript-eslint"
import nextPlugin from "@next/eslint-plugin-next"
import reactHooksPlugin from "eslint-plugin-react-hooks"

// Build a flat config that covers:
//   - TypeScript type-checking via typescript-eslint
//   - Next.js core-web-vitals rules via @next/eslint-plugin-next
//   - React hooks rules via eslint-plugin-react-hooks
// eslint-plugin-react@7.x (shipped by eslint-config-next) is NOT included here
// because it creates circular references that crash ESLint 10's config validator.

const eslintConfig = tseslint.config(
  { ignores: [".claude/**", ".next/**", "node_modules/**"] },
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
)

export default eslintConfig
