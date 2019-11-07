//VSCode dosen't like doing it the right way
import Arweave from '../node_modules/arweave/web/index';
import { ApiConfig } from '../node_modules/arweave/web/lib/api';

export let defaultConfig = {
	host: 'arweave.net',
	port: 1984,
	protocol: 'http',
	timeout: 3000,
	logging: false
};

/*function recurse(setup: ApiConfig) {
	let arweave = Arweave.init(setup);
	arweave.network.getPeers().then((peers) => {
		peers.forEach(ip => {
			let newDiv = document.createElement("div")
			newDiv.appendChild(document.createTextNode(ip));
			let button = document.createElement("input");
			button.type = "button";
			button.onclick = (mouse) =>
			{
				recurse({
					host: ip.split(':')[0],
					port: 1984,
					protocol: 'http',
					timeout: 20000,
					logging: false
				});
			}
			newDiv.appendChild(button);
			document.body.appendChild(newDiv);
		});
	},
	(err) => {
		console.log(err);
	});
}

recurse({
	host: 'arweave.net',
	port: 443,
	protocol: 'https',
	timeout: 20000,
	logging: false
});*/
