import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'node_modules/**',
    'dist/**',
    'Documentation/**',
    'Documentation_Pro/**',
    'docs/**',
    'examples/**',
    'prisma/**',
    'scripts/**',
    '*.md',
    '**/*.md',
  ],
})
