#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

function parseArgs(argv) {
    const args = { in: null, out: 'public/questions.json', append: false }
    for (let i = 2; i < argv.length; i++) {
        const a = argv[i]
        if (a === '--append') args.append = true
        else if (a === '--in' || a === '-i') args.in = argv[++i]
        else if (a === '--out' || a === '-o') args.out = argv[++i]
    }
    return args
}

function normalizeLine(line) {
    return line.replace(/\r/g, '').trim()
}

function parseRawTextToQuestions(rawText) {
    const lines = rawText.split('\n').map(normalizeLine)
    const questions = []

    let i = 0
    while (i < lines.length) {
        // Skip empty and metadata lines between questions
        while (
            i < lines.length && (
                lines[i] === '' ||
                /^Yes,\s*the\s*answer\s*is\s*correct\.?/i.test(lines[i]) ||
                /^Score:/i.test(lines[i]) ||
                /^Accepted Answers:/i.test(lines[i]) ||
                /^\d+\s*point(s)?$/i.test(lines[i])
            )
        ) i++
        if (i >= lines.length) break

        const question = lines[i++]
        if (!question) break

        const options = []
        while (
            i < lines.length &&
            lines[i] !== '' &&
            !/^Yes,\s*the\s*answer\s*is\s*correct\.?/i.test(lines[i]) &&
            !/^Accepted Answers:/i.test(lines[i]) &&
            !/^Score:/i.test(lines[i]) &&
            !/^\d+\s*point(s)?$/i.test(lines[i])
        ) {
            options.push(lines[i])
            i++
        }

        // Advance to Accepted Answers
        while (
            i < lines.length &&
            !/^Accepted Answers:/i.test(lines[i])
        ) {
            // skip metadata
            if (
                lines[i] === '' ||
                /^Yes,\s*the\s*answer\s*is\s*correct\.?/i.test(lines[i]) ||
                /^Score:/i.test(lines[i]) ||
                /^\d+\s*point(s)?$/i.test(lines[i])
            ) {
                i++
                continue
            }
            i++
        }
        if (i >= lines.length) {
            // No accepted answer found; skip this entry if malformed
            continue
        }

        // 'Accepted Answers:' line
        i++
        // Next non-empty line is the correct answer
        while (i < lines.length && lines[i] === '') i++
        const answer = i < lines.length ? lines[i] : ''

        // Move past the answer line
        i++

        // Skip any trailing metadata like '1 point' before next question
        while (
            i < lines.length && (
                lines[i] === '' ||
                /^Score:/i.test(lines[i]) ||
                /^\d+\s*point(s)?$/i.test(lines[i])
            )
        ) i++

        if (question && options.length > 0 && answer) {
            questions.push({ question, options, answer })
        }
    }

    return questions
}

function readStdin() {
    return new Promise((resolve, reject) => {
        let data = ''
        process.stdin.setEncoding('utf8')
        process.stdin.on('data', (chunk) => (data += chunk))
        process.stdin.on('end', () => resolve(data))
        process.stdin.on('error', reject)
    })
}

async function main() {
    const args = parseArgs(process.argv)
    let rawText = ''

    if (args.in) {
        rawText = fs.readFileSync(args.in, 'utf8')
    } else {
        // Read from stdin
        rawText = await readStdin()
    }

    const parsed = parseRawTextToQuestions(rawText)
    const outPath = path.resolve(process.cwd(), args.out)

    let existing = []
    if (args.append && fs.existsSync(outPath)) {
        try {
            existing = JSON.parse(fs.readFileSync(outPath, 'utf8'))
            if (!Array.isArray(existing)) existing = []
        } catch {
            existing = []
        }
    }

    const merged = args.append ? [...existing, ...parsed] : parsed
    fs.mkdirSync(path.dirname(outPath), { recursive: true })
    fs.writeFileSync(outPath, JSON.stringify(merged, null, 2) + '\n', 'utf8')

    console.log(`Wrote ${parsed.length} question(s) to ${args.out}${args.append ? ' (appended)' : ''}.`)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})


