# ArView
Tool to see nodes on arweave network built on fabric.js.

Made for [arweave hackathon](https://gitcoin.co/issue/ArweaveTeam/Bounties/1/3184).

# Building
No extra steps needed:


```
git clone https://github.com/ItsMajestiX/ArView.git
cd ArView
npm install
npm run build
```

If you want to package it up for arweave:
```
npm install -g arweave-deploy
arweave package dist/index.html packaged.html
```
Keep in mind that exporting the canvas will not work if you just double click on the file to open it (tainted canvas). `python -m http.server` with Python 3 installed will do just fine for testing.


