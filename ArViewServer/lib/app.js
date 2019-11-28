"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const args_1 = require("./args");
const fs = require("fs");
const nodegraph_1 = require("./nodegraph");
//https://stackoverflow.com/a/49957219/10720080
function sleep(millis) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => setTimeout(resolve, millis));
    });
}
function app() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.existsSync(args_1.argv.s)) {
            fs.mkdirSync(args_1.argv.s);
        }
        while (true) {
            let graph = new nodegraph_1.NodeGraph();
            yield graph.create(args_1.argv.i + ':' + args_1.argv.p, args_1.argv.h);
            let found = false;
            let fileID = 0;
            while (!found) {
                if (fs.existsSync(args_1.argv.s + '/' + 'graph' + fileID + '.json')) {
                    fileID += 1;
                }
                else {
                    found = true;
                }
            }
            fs.writeFileSync(args_1.argv.s + '/' + 'graph' + fileID + '.json', JSON.stringify(graph));
            yield sleep(args_1.argv.d * 1000);
        }
    });
}
exports.app = app;
app();
//# sourceMappingURL=app.js.map