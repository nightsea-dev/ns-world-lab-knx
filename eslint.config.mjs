import nx from '@nx/eslint-plugin'

export default [
    ...nx.configs['flat/base'],
    ...nx.configs['flat/typescript'],
    ...nx.configs['flat/javascript'],
    {
        ignores: ['**/dist', '**/vite.config.*.timestamp*'],
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            '@nx/enforce-module-boundaries': [
                'error',
                {
                    enforceBuildableLibDependency: true,
                    allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
                    depConstraints: [
                        // {
                        //     sourceTag: '*',
                        //     onlyDependOnLibsWithTags: ['*'],
                        // },

                        // apps -> web, logic, types
                        {
                            sourceTag: 'layer:app',
                            onlyDependOnLibsWithTags: ['layer:lib'],
                        },

                        // web -> logic, types
                        {
                            sourceTag: 'lib:web',
                            onlyDependOnLibsWithTags: ['lib:logic', 'lib:types'],
                        },

                        // logic -> types
                        {
                            sourceTag: 'lib:logic',
                            onlyDependOnLibsWithTags: ['lib:types'],
                        },

                        // types -> nothing
                        {
                            sourceTag: 'lib:types',
                            onlyDependOnLibsWithTags: [],
                        },

                    ],
                },
            ],
        },
    },
    {
        files: [
            '**/*.ts',
            '**/*.tsx',
            '**/*.cts',
            '**/*.mts',
            '**/*.js',
            '**/*.jsx',
            '**/*.cjs',
            '**/*.mjs',
        ],
        // Override or add rules here
        rules: {},
    },
]
