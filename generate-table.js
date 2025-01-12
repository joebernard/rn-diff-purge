#!/usr/bin/env node

const table = require('markdown-table')
const R = require('ramda')
const semver = require('semver')
const getStdin = require('get-stdin')


const RepoUrl='https://github.com/pvinis/rn-diff-purge'


const generateTable = async () => {
    const isBig = R.contains('--big', process.argv)
    const input = await getStdin()
    const versions = R.dropLast(1, R.split('\n')(input))

    // words or phrases of length 12
    const comments = [
        'react native',
        'this is cool',
        'purge time!!',
        'i love diffs',
        'diffs == fun',
        'rn core team',
    ]

    const diffTable = [
        ['From->To', ...comments[Math.floor(Math.random() * comments.length)] .toUpperCase() .split('')],
        ...R.map(fromVersion => {
            const length = versions.length
            return [
                fromVersion,
                ...R.pipe(
                    R.map(idx => {
                        const toVersion = versions[idx]
                        if (semver.eq(fromVersion, toVersion)) {
                            return 'X'
                        }
                        if (semver.gt(fromVersion, toVersion)) {
                            return '-'
                        }
                        return isBig
                        ? `[->${toVersion}](${RepoUrl}/compare/version/${fromVersion}..version/${toVersion}) [core](https://github.com/facebook/react-native/compare/v${fromVersion}...v${toVersion})` 
                        : `[->${toVersion}](${RepoUrl}/compare/version/${fromVersion}..version/${toVersion})`
                    }),
                )(R.range(0, length)),
            ]
        }, versions),
    ]

    console.log(table(diffTable))
}


(async () => {
    await generateTable()
})()
