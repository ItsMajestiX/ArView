# ArViewServer
An app to collect node data and upload it to Arweave.

# Install

`npm install -g @itsmajestix/arview`

# Run
`arview-server`

# Options
`-b`, `--min_bal`: Minimum balance of wallet to send graph in winston. 
*Default: 15000000000*

`-d`, `--delay`: Time to wait in seconds before creating a new graph.
*Default: 21600*

`-i`, `--ip`: IP of node to start graph from.
*Default: `arweave.net`*

`-p`, `--port`: Port of node to start graph from.
*Default: 443*

`-h`, `--protocol`: Protocol of node to start graph from.
*Options: ['http', 'https'].
Default: `'https'`*

`-ig`, `--ip_gatewat`: IP of gateway to use.
*Default: `arweave.net`*

`-t`, `--timeout`: Timeout of nodes in ms.
*Default: 3000*

`-tg`, `--timeout_gateway`: Timeout of gateway in ms.
*Default: 120000*

`-k`, `--key`: Path to key file.
*Default: `'.'`*

`-s`, `--save`: Path to save finished graphs to.
*Default: `'graphs'`*

`-r`, `--refresh`: Seconds to wait before checking balance again.
*Default: 30*

`-m`, `--max`: Maximum number of graphs to send. Set to 0 for no limit.
*Default: 0*
