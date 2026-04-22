import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  files: ["**/*.{ts,tsx}"],

  rules: {
    // TypeScript rules
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/ban-ts-comment": "error",
    "@typescript-eslint/prefer-as-const": "error",
    "@typescript-eslint/no-unused-disable-directive": "error",
    
    // React rules
    "react-hooks/exhaustive-deps": "error",
    "react-hooks/purity": "error",
    "react/no-unescaped-entities": "error",
    "react/display-name": "error",
    "react/prop-types": "error",
    "react-compiler/react-compiler": "error",
    
    // Next.js rules
    "@next/next/no-img-element": "error",
    "@next/next/no-html-link-for-pages": "error",
    
    // General JavaScript rules
    "prefer-const": "error",
    "no-unused-vars": "error",
    "no-console": "error",
    "no-debugger": "error",
    "no-empty": "error",
    "no-irregular-whitespace": "error",
    "no-case-declarations": "error",
    "no-fallthrough": "error",
    "no-mixed-spaces-and-tabs": "error",
    "no-redeclare": "error",
    "no-undef": "error",
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
}];

export default eslintConfig;
