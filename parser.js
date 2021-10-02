const defaultFields = ['name', 'pid', 'sessionName', 'sessionNumber', 'memUsage'];

const modulesFields = ['name', 'pid', 'modules'];

const servicesFields = ['name', 'pid', 'services'];

const appsFields = ['name', 'pid', 'memUsage', 'packageName'];

const verboseFields = [...defaultFields, 'status', 'username', 'cpuTime', 'windowTitle'];

const appsVerboseFields = [...verboseFields, 'packageName'];

const types = {
    name: 'string',
    pid: 'number',
    sessioName: 'string',
    sessionNumber: 'number',
    memUsage: 'memory',
    modules: 'array',
    services: 'array',
    packageName: 'string',
    status: 'string',
    username: 'string',
    cpuTime: 'time',
    windowTitle: 'string'
};

const toSeconds = string => {
    const [h, m, s] = string.split(':');
    return 3600 * h + 60 * m + Number(s);
};

class Parser {
    constructor (options = {}) {
        if (options.modules) {
            this.fields = modulesFields;
        } else if (options.services) {
            this.fields = servicesFields;
        } else if (options.apps) {
            if (options.verbose) {
                this.fields = appsVerboseFields;
            } else {
                this.fields = appsFields;
            }
        } else if (options.verbose) {
            this.fields = verboseFields;
        } else {
            this.fields = defaultFields;
        }
    }

    parse(string) {
        return string.slice(1, -1).split('","').reduce((obj, value, index) => {
            const field = this.fields[index];
            switch (types[field]) {
                case 'number':
                    obj[field] = Number(value);
                    break;
                case 'array':
                    obj[field] = value.split(',');
                    break;
                case 'memory':
                    obj[field] = value.replace(/\D/g, '') * 1024;
                    break;
                case 'time':
                    obj[field] = toSeconds(value);
                    break;
                default:
                    obj[field] = value;
            }
            return obj;
        }, {});
    }
}

module.exports = Parser;