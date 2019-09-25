const program = require('commander')
const path = require('path')
const pkg = require('../../package.json')
const server = require('../server')

const config = getConfig()

function run() {
    program
        .version(pkg.version)
        .option('-i, --input-spec <path>', 'path to specification file',
            process.env.SWAGGERQL_INPUT_SPEC || config.get('inputSpec'))
        .option('-p, --port <number>', 'http port to start server',
            process.env.SWAGGERQL_PORT || config.get('port'))
        .option('-d, --client <name>', 'name of client SQL driver',
            process.env.SWAGGERQL_CLIENT || config.get('client'))
        .option('-c, --connection <dsn|json>', 'connection options to the appropriate database client',
            process.env.SWAGGERQL_CONNECTION || config.get('connection'))
        .action(async (cmd) => server.run(options(cmd.opts())))
        .parse(process.argv)
}

function getConfig() {
    const config = require('config')

    if (require.resolve('../../config/default').indexOf(path.join(process.cwd(), 'config')) === 0) {
        return config
    }
    const defaults = require('../../config/default')

    return config.util.makeImmutable(config.util.extendDeep(defaults, config))
}

function options(opts) {
    const options = config.util.cloneDeep(opts)

    if (typeof options.connection === 'string') {
        try {
            options.connection = JSON.parse(options.connection)
        } catch (err) {
            // it's string, do nothing
        }
    }

    return config.util.makeImmutable(config.util.extendDeep(config.util.toObject(), options))
}

module.exports.run = run
