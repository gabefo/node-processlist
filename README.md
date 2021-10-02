# Table of contents

* [Process list](#process-list)
  * [Instalation](#instalation)
  * [Usage](#usage)
  * [API](#api)
    * [Process information](#process-information)
      * [processinfo.name](#processinfoname)
      * [processinfo.pid](#processinfopid)
      * [processinfo.sessionName](#processinfosessionname)
      * [processinfo.sessionNumber](#processinfosessionnumber)
      * [processinfo.memUsage](#processinfomemusage)
      * [processinfo.status](#processinfostatus)
      * [processinfo.userName](#processinfousername)
      * [processinfo.cpuTime](#processinfocputime)
      * [processinfo.windowTitle](#processinfowindowtitle)
      * [processinfo.modules](#processinfomodules)
      * [processinfo.services](#processinfoservices)
      * [processinfo.packageName](#processinfopackagename)
    * [Filters](#filters)
      * [Filter names, operators and values](#filter-names-operators-and-values)
      * [Example: Get processes with a memory usage greater than a specified value](#example-get-processes-with-a-memory-usage-greater-than-a-specified-value)
      * [Example: Get processes by window title](#example-get-processes-by-window-title)
    * [processlist.getProcesses([options])](#processlistgetprocessesoptions)
    * [processlist.getProcessById(pid[, options])](#processlistgetprocessbyidpid-options)
    * [processlist.getProcessesByName(name[, options])](#processlistgetprocessesbynamename-options)

## Process list

The `node-processlist` module provides detailed information about processes. It uses the [tasklist command](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/tasklist) to get a list of currently running processes on Windows.

## Installation

```sh
npm install node-processlist
```

## Usage

The `node-processlist` module can be accessed using:

```js
// CommonJS
const processlist = require('node-processlist');
```

or:

```js
// ES6 Modules
import processlist from 'node-processlist';
```

## API

### Process information

* [&lt;Object&gt;][4]

The `ProcessInfo` object contains information about the process.

By default, only the following properties are availabe:

* `name`
* `pid`
* `sessionName`
* `sessionNumber`
* `memUsage`

When [processlist.getProcesses()](#processlistgetprocessesoptions) is called with the `modules` option set to `true`, the object will contain the following properties:

* `name`
* `pid`
* `modules`

When that method is called with the `services` option set to `true`, the object will contain the following properties:

* `name`
* `pid`
* `services`

When that method is called with the `apps` option set to `true`, the object will contain the following properties:

* `name`
* `pid`
* `memUsage`
* `packageName`

When that method is called with the `verbose` option set to `true`, the object will contain the following properties:

* `name`
* `pid`
* `sessionName`
* `sessionNumber`
* `memUsage`
* `status`
* `username`
* `cpuTime`
* `windowTitle`

Additionally, if the `apps` option is also `true`, the `packageName` property is included.

#### processinfo.name

* [&lt;string&gt;][3]

The name of the process.

#### processinfo.pid

* [&lt;number&gt;][2]

The process identifier (PID).

#### processinfo.sessionName

* [&lt;string&gt;][3]

The session name.

#### processinfo.sessionNumber

* [&lt;number&gt;][2]

The session number.

#### processinfo.memUsage

* [&lt;number&gt;][2]

The memory usage of the process measured in bytes.

#### processinfo.status

* [&lt;string&gt;][3]

The process status. It can be `'Running'`, `'Suspended'`, `'Not Responding'` or `'Unknown'`.

#### processinfo.username

* [&lt;string&gt;][3]

The user name.

#### processinfo.cpuTime

* [&lt;number&gt;][2]

The CPU time usage of the process in seconds.

#### processinfo.windowTitle

* [&lt;string&gt;][3]

The title of the window in which the process is running.

#### processinfo.modules

* [&lt;string[]&gt;][3]

The DLL modules loaded for the process.

#### processinfo.services

* [&lt;string[]&gt;][3]

The services running in the process.

#### processinfo.packageName

* [&lt;string&gt;][3]

The package name.

### Filters

Filters specify the types of processes to include in or exclude from the match.

#### Filter names, operators and values

| Filter Name   | Valid Operators                    | Valid value(s)                                                                                      |
| ------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| `STATUS`      | `eq`, `ne`                         | `Running \| Not Responding \| Unknown`. This filter isn't supported if you specify a remote system. |
| `IMAGENAME`   | `eq`, `ne`                         | Image name                                                                                          |
| `PID`         | `eq`, `ne`, `gt`, `lt`, `ge`, `le` | PID value                                                                                           |
| `SESSION`     | `eq`, `ne`, `gt`, `lt`, `ge`, `le` | Session number                                                                                      |
| `SESSIONNAME` | `eq`, `ne`                         | Session name                                                                                        |
| `CPUTIME`     | `eq`, `ne`, `gt`, `lt`, `ge`, `le` | CPU time in the format HH:MM:SS, where MM and SS are between 0 and 59 and HH is any unsigned number |
| `MEMUSAGE`    | `eq`, `ne`, `gt`, `lt`, `ge`, `le` | Memory usage in KB                                                                                  |
| `USERNAME`    | `eq`, `ne`                         | Any valid user name (`<user>` or `<domain\user>`)                                                   |
| `SERVICES`    | `eq`, `ne`                         | Service name                                                                                        |
| `WINDOWTITLE` | `eq`, `ne`                         | Window title. This filter isn't supported if you specify a remote system.                           |
| `MODULES`     | `eq`, `ne`                         | DLL name                                                                                            |

#### Example: Get processes with a memory usage greater than a specified value

The following example gets all processes that have a memory usage greater than 20 MB. It uses the `MEMUSAGE` filter, which finds processes using the `memUsage` property. The `gt` operator gets only the processes with a value greater than 20,000 KB.

```js
import { getProcesses } from 'node-processlist';

(async () => {
  const processes = await getProcesses({
    filters: ['MEMUSAGE gt 20000']
  });

  console.log(processes);
  /*
  Prints:

  [
    {
      name: 'svchost.exe',
      pid: 664,
      sessionName: 'Services',
      sessionNumber: 0,
      memUsage: 32534528
    },
    ...
  ]
  */
})();
```

#### Example: Get processes by window title

The following example gets all processes that have a window title that begins with `'Microsoft'`.

```js
import { getProcesses } from 'node-processlist';

(async () => {
  const processes = await getProcesses({
    filters: ['WINDOWTITLE eq Microsoft*']
  });

  console.log(processes);
  /*
  Prints:

  [
    {
      name: 'TextInputHost.exe',
      pid: 14164,
      sessionName: 'Console',
      sessionNumber: 4,
      memUsage: 46342144
    },
    ...
  ]
  */
})();
```

### processlist.getProcesses([options])

* `options` [&lt;Object&gt;][4]
  * `system` [&lt;string&gt;][3] The name or IP address of a remote computer.
  * `username` [&lt;string&gt;][3] The user name of the remote computer.
  * `password` [&lt;string&gt;][3] The password of the account that is specified in the `username` option.
  * `modules` [&lt;boolean&gt;][1] | [&lt;string&gt;][3] If `true`, lists all DLL modules loaded for each process. **Default**: `false`.
  * `services` [&lt;boolean&gt;][1] If `true`, lists all services running for each process. **Default**: `false`.
  * `apps` [&lt;boolean&gt;][1] If `true`, gets store apps. **Default**: `false`.
  * `verbose` [&lt;boolean&gt;][1] If `true`, gets detailed information for each process. **Default**: `false`.
  * `filters` [&lt;string[]&gt;][3] An array of filters.
* Returns: A [&lt;Promise&gt;][5] that will be resolved with an array of [&lt;ProcessInfo&gt;](#process-information) objects.

Gets the processes on a local or remote computer.

The `modules`, `services` and `apps` options can not be used together.

The `verbose` option only works when `modules` and `services` options are `false`.

The following example gets the modules loaded for each process:

```js
import { getProcesses } from 'node-processlist';

(async () => {
  const processes = await getProcesses({ modules: true });

  console.log(processes);
  /*
  Prints:

  [
    {
      name: 'tasklist.exe',
      pid: 13520,
      modules: [
        'ntdll.dll',      'KERNEL32.DLL',       'KERNELBASE.dll',
        'ADVAPI32.dll',   'msvcrt.dll',         'sechost.dll',
        'RPCRT4.dll',     'USER32.dll',         'win32u.dll',
        'GDI32.dll',      'gdi32full.dll',      'msvcp_win.dll',
        'ucrtbase.dll',   'OLEAUT32.dll',       'combase.dll',
        'WS2_32.dll',     'SHLWAPI.dll',        'VERSION.dll',
        'framedynos.dll', 'dbghelp.dll',        'SspiCli.dll',
        'srvcli.dll',     'netutils.dll',       'MPR.dll',
        'IMM32.DLL',      'kernel.appcore.dll', 'bcryptPrimitives.dll',
        'clbcatq.dll',    'wbemprox.dll',       'wbemcomn.dll',
        'Winsta.dll',     'wbemsvc.dll',        'fastprox.dll',
        'amsi.dll',       'USERENV.dll',        'profapi.dll',
        'MpOav.dll',      'ole32.dll',          'AMSIExt.dll',
        'WINTRUST.dll',   'PSAPI.DLL',          'CRYPT32.dll',
        'SHELL32.dll',    'MSASN1.dll',         'mccoreps.dll',
        'CRYPTSP.dll',    'rsaenh.dll',         'bcrypt.dll',
        'CRYPTBASE.dll',  'imagehlp.dll',       'gpapi.dll',
        'cryptnet.dll',   'mfevtpa.dll',        'mfehida.dll',
        'mfemmsa.dll',    'sxs.dll',            'windows.storage.dll',
        'Wldp.dll',       'SHCORE.dll',         'wmiutils.dll'
      ]
    },
    ...
  ]
  */
})();
```

### processlist.getProcessById(pid[, options])

* `pid` [&lt;number&gt;][2] The process ID.
* `options` [&lt;Object&gt;][4] Accepts the same options as [processlist.getProcesses()](#processlistgetprocessesoptions).
* Returns: A [&lt;Promise&gt;][5] that will be resolved with a [&lt;ProcessInfo&gt;](#process-information) object, or `null` if there is no process with the specified `pid`.

Finds a process using PID.

The following example uses the process ID to get detailed information about the process:

```js
import { getProcessById } from 'node-processlist';

(async () => {
  const processinfo = await getProcessById(14164, { verbose: true });

  console.log(processinfo);
  /*
  Prints:

  {
    name: 'TextInputHost.exe',
    pid: 14164,
    sessionName: 'Console',
    sessionNumber: 4,
    memUsage: 46395392,
    status: 'Running',
    username: 'MYCOMPUTER\\gabri',
    cpuTime: 2,
    windowTitle: 'Microsoft Text Input Application'
  }
  */
})();
```

### processlist.getProcessesByName(name[, options])

* `name` [&lt;string&gt;][3] The process name.
* `options` [&lt;Object&gt;][4] Accepts the same options as [processlist.getProcesses()](#processlistgetprocessesoptions).
* Returns: A [&lt;Promise&gt;][5] that will be resolved with an array of [&lt;ProcessInfo&gt;](#process-information) objects.

Finds processes using the process name.

The following example displays all Explorer.exe (Explorer) processes:

```js
import { getProcessesByName } from 'node-processlist';

(async () => {
  const processes = await getProcessesByName('explorer.exe');

  console.log(processes);
  /*
  Prints:

  [
    {
      name: 'explorer.exe',
      pid: 8328,
      sessionName: 'Console',
      sessionNumber: 4,
      memUsage: 140410880
    },
    ...
  ]
  */
})();
```

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#boolean_type
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#number_type
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#string_type
[4]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[5]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
