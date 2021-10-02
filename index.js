const { once } = require('events');
const { execFile } = require('child_process');
const { createInterface } = require('readline');
const Parser = require('./parser.js');

/**
 * @typedef {Object} ProcessInfo Contains information about the process.
 * @property {string} name The name of the process.
 * @property {number} pid The process identifier (PID).
 * @property {string} sessionName The session name.
 * @property {number} sessionNumber The session number.
 * @property {number} memUsage The memory usage of the process measured in bytes.
 * @property {string} status The process status. It can be 'Running', 'Suspended', 'Not Responding' or 'Unknown'.
 * @property {string} username The user name.
 * @property {number} cpuTime The CPU time usage of the process in seconds.
 * @property {string} windowTitle The title of the window in which the process is running.
 * @property {string[]} modules The DLL modules loaded for the process.
 * @property {string[]} services The services running in the process.
 * @property {string} packageName The package name.
 */

/**
 * Gets the processes on a local or remote computer.
 * @param {Object} options
 * @param {string} options.system The name or IP address of a remote computer.
 * @param {string} options.username The user name of the remote computer.
 * @param {string} options.password The password of the account that is specified in the username option.
 * @param {boolean|string} options.modules If true, lists all DLL modules loaded for each process. Default: false.
 * @param {boolean} options.services If true, lists all services running for each process. Default: false.
 * @param {boolean} options.apps If true, gets store apps. Default: false.
 * @param {boolean} options.verbose If true, gets detailed information for each process. Default: false.
 * @param {string[]} options.filters An array of filters.
 * @returns {Promise<ProcessInfo[]>}
 */
async function getProcesses(options = {}) {
    const args = ['/fo', 'csv', '/nh'];

    if (options.system) {
        args.push('/s', options.system);
        if (options.username) {
            args.push('/u', options.username);
            if (options.password) {
                args.push('/p', options.password);
            }
        }
    }

    if (options.modules) {
        args.push('/m');
        if (typeof options.modules === 'string') {
            args.push(options.modules);
        }
    } else if (options.services) {
        args.push('/svc');
    } else {
        if (options.apps) {
            args.push('/apps');
        }
        if (options.verbose) {
            args.push('/v');
        }
    }

    const filters = options.filters || [];

    for (let i = 0; i < filters.length; i++) {
        args.push('/fi', filters[i]);
    }

    const result = [];

    const parser = new Parser(options);

    try {
        const tl = execFile('tasklist.exe', args);

        const rl = createInterface({
            input: tl.stdout,
            crlfDelay: Infinity
        });

        rl.on('line', line => {
            if (line.startsWith('"')){
                result.push(parser.parse(line));
            }
        });

        await once(rl, 'close');
    } catch (e) {}

    return result;
}

/**
 * Finds a process using PID.
 * @param {number} pid The process ID.
 * @param {Object} options Accepts the same options as processlist.getProcesses().
 * @returns {Promise<ProcessInfo>}
 */
async function getProcessById(pid, options) {
    const processes = await getProcesses({
        ...options,
        filters: [`PID eq ${pid}`]
    });
    if (processes.length === 0) {
        return null;
    }
    return processes[0];
}

/**
 * Finds processes using the process name.
 * @param {string} name The process name.
 * @param {Object} options Accepts the same options as processlist.getProcesses().
 * @returns {Promise<ProcessInfo[]>}
 */
function getProcessesByName(name, options) {
    return getProcesses({
        ...options,
        filters: [`IMAGENAME eq ${name}`]
    });
}

module.exports = {
    getProcesses,
    getProcessById,
    getProcessesByName
};
