import { canvas, node, version } from './index';
import Arweave from '../node_modules/arweave/web/index';
import { defaultConfig } from './arweave';
import { JWKInterface } from '../node_modules/arweave/web/lib/wallet';
import Transaction from '../node_modules/arweave/web/lib/transaction';

//https://stackoverflow.com/a/15832662/10720080
function downloadURI(uri: string, name: string) {
    let link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

//https://stackoverflow.com/a/40718205/10720080
function isJWK(pet: JWKInterface): pet is JWKInterface {
    //Uncommon name
    return (<JWKInterface>pet).kty !== undefined;
}

async function createConfirmMessage(data: Transaction, ar: Arweave, key: JWKInterface): Promise<string> {
    let addr = await ar.wallets.jwkToAddress(key);
    let bal = await ar.wallets.getBalance(addr);
    return "You are about to submit this graph to Arweave. The cost of this action will be " 
    + data.reward + " winston/" 
    + ar.ar.winstonToAr(data.reward) +  " AR. Your current account balance is "
    + bal + " winston/"
    + ar.ar.winstonToAr(bal) + " AR. Proceed?";
}

export function onExport(ev: Event): void {
    let target = ev.target as HTMLButtonElement;
    let selector = document.getElementById("wallet") as HTMLInputElement;
    if (selector.files.length === 0) {
        alert("Please upload a wallet first.");
    }
    else {
        let reader = new FileReader();
        if (!(selector.files[0].type === "application/json")) {
            alert("That is not a JSON file. Please try again.");
        }
        reader.onerror = (ev: ProgressEvent<FileReader>) => {
            alert("Wallet loading failed. Please try again.");
        };
        reader.onload = async (ev: ProgressEvent<FileReader>) => {
            try {
                let key = JSON.parse(ev.target.result as string);
                if (isJWK(key)) {
                    let arweave = Arweave.init(defaultConfig);
                    canvas.getObjects().forEach(element => {
                        let targ = node.findObj(element);
                        if (targ) {
                            targ.onHover(null);
                        }
                    });
                    let data = await arweave.createTransaction({
                        data: new Buffer(canvas.toDataURL({
                            format: 'jpeg',
                            enableRetinaScaling: true
                        }).split(',')[1], 'base64')
                    }, key);
                    canvas.getObjects().forEach(element => {
                        let targ = node.findObj(element);
                        if (targ) {
                            targ.offHover(null);
                        }
                    });
                    data.addTag('Content-Type', 'image/jpeg');
                    data.addTag('User-Agent', 'ArView/' + version);
                    if (confirm(await createConfirmMessage(data, arweave, key))) {
                        await arweave.transactions.sign(data, key);
                        let response = await arweave.transactions.post(data);
                        if (response.status === 200) {
                            alert("Transaction successful. Transaction ID: " + data.id);
                            window.location.href = "https://arweave.net/" + data.id;
                        }
                    }
                }
                else {
                    throw new Error();
                }
            } catch (error) {
                console.error(error);
                alert("Error submitting transaction. Please try again.");
            }
        };
        reader.readAsText(selector.files[0]);
    }
}

export function onDownload() {
    canvas.getObjects().forEach(element => {
        let targ = node.findObj(element);
        if (targ) {
            targ.onHover(null);
        }
    });
    canvas.renderAll();
    downloadURI(canvas.toDataURL({
        format: 'jpeg',
        enableRetinaScaling: true
    }), 'view.jpeg');
    canvas.getObjects().forEach(element => {
        let targ = node.findObj(element);
        if (targ) {
            targ.offHover(null);
        }
    });
    canvas.renderAll();
}