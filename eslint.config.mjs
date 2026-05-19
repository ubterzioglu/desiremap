import { fileURLToPath } from "url";
import path from "path";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import tailwindcss from "eslint-plugin-tailwindcss";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eslintConfig = [
  ...nextCoreWebVitals, 
  ...nextTypescript,
  ...tailwindcss.configs["flat/recommended"],
  {
    // Tailwind v4: CSS-based config (not tailwind.config.ts)
    settings: {
      tailwindcss: {
        config: path.join(__dirname, "src/app/globals.css"),
      },
    },
  },
  {
  files: ["**/*.{ts,tsx}"],

  linterOptions: {
    reportUnusedDisableDirectives: "error",
  },

  rules: {
    // Tailwind CSS rules (strict — errors, not warnings)
    "tailwindcss/classnames-order": "error",
    "tailwindcss/enforces-negative-arbitrary-values": "error",
    "tailwindcss/enforces-shorthand": "error",
    "tailwindcss/migration-from-tailwind-2": "off",
    "tailwindcss/no-arbitrary-value": "off",
    "tailwindcss/no-contradicting-classname": "error",
    "tailwindcss/no-custom-classname": ["error", {
      whitelist: [
        // @tailwindcss/typography element modifiers (prose-h2:, prose-headings:, etc.)
        "prose-.+",
        "(hover|focus|dark):prose-.+",
        // SEO speakable JSON-LD marker classes
        "speakable-.+",
      ],
    }],
    "tailwindcss/no-unnecessary-arbitrary-value": "error",

    // TypeScript rules
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/ban-ts-comment": "error",
    "@typescript-eslint/prefer-as-const": "error",
    
    // React rules
    "react-hooks/exhaustive-deps": "error",
    "react/no-unescaped-entities": "error",
    "react/display-name": "error",
    "react/prop-types": "off",
    
    // Next.js rules
    "@next/next/no-img-element": "error",
    "@next/next/no-html-link-for-pages": "error",
    
    // General JavaScript rules
    "prefer-const": "error",
    "no-unused-vars": "off",
    "no-console": "error",
    "no-debugger": "error",
    "no-empty": "error",
    "no-irregular-whitespace": "error",
    "no-case-declarations": "error",
    "no-fallthrough": "error",
    "no-mixed-spaces-and-tabs": "error",
    "no-redeclare": "off",
    "no-undef": "off",
    "no-unreachable": "error",
    "no-useless-escape": "error",

    /**
     * DOSYA BOYUTU
     */
    "max-lines": [
      "warn",
      {
        max: 400,
        skipBlankLines: true,
        skipComments: true,
      },
    ],

    /**
     * COMPONENT / FUNCTION BOYUTU
     */
    "max-lines-per-function": [
      "warn",
      {
        max: 150,
        skipBlankLines: true,
        skipComments: true,
      },
    ],

    /**
     * COMPLEXITY
     */
    "complexity": [
      "warn",
      15
    ],

    /**
     * STATEMENT COUNT
     */
    "max-statements": [
      "warn",
      40
    ],

    /**
     * NESTING
     */
    "max-depth": [
      "warn",
      3
    ],
  },
}, {
  files: ["e2e/**/*.ts"],
  rules: {
    "no-console": "off",
  },
}, {
  // Existing large SEO/pages/components. Keep global metric rules active for new code.
  files: [
    "e2e/schema-smoke.spec.ts",
    "src/app/**/blog/**/page.tsx",
    "src/app/**/bordell/**/page.tsx",
    "src/app/**/bordell/**/ProductDetailPageContent.tsx",
    "src/app/**/bordell/**/ProductSEOContent.tsx",
    "src/app/**/stadt/**/page.tsx",

    "src/components/bordell/ProductDetailPageContent.tsx",
    "src/components/bordell/ProductSEOContent.tsx",
    "src/components/listings/ReservationModal.tsx",
    "src/lib/api.ts",
    "src/lib/backend-client.ts",
    "src/lib/structuredData.ts",
    "src/proxy.ts",
  ],
  rules: {
    "max-lines": "off",
    "max-lines-per-function": "off",
    "complexity": "off",
    "max-statements": "off",
    "max-depth": "off",
  },

}, {
  ignores: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "examples/**",
    "skills",
    ".claude/**",
    ".cline/**",
    ".factory/**",
    ".kilocode/**",
    ".agent/**",
    ".agents/**",
    "src/components/ui/**"
  ]
},
prettierConfig];

export default eslintConfig;
