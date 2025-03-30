module.exports = {
  printWidth: 100,
  singleQuote: true,
  tabWidth: 2,
  bracketSameLine: false,
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  importOrder: [
    '<THIRD_PARTY_MODULES>', // External npm packages
    '^@/.*$', // Absolute imports (your internal modules)
    '^[./]', // Relative imports (local files)
  ],
  importOrderSeparation: true, // Insert blank lines between groups
  importOrderSortSpecifiers: true, // Sort named imports within brackets
  importOrderParserPlugins: ['typescript', 'jsx'], // Fix for `type` imports
};
