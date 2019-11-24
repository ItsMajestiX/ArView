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
const nodegraph_1 = require("./nodegraph");
const fs = require("fs");
function foo(a) {
    a.push('a');
}
function app() {
    return __awaiter(this, void 0, void 0, function* () {
        let nodeGraph = new nodegraph_1.NodeGraph();
        yield nodeGraph.create();
        fs.writeFile('data.json', JSON.stringify(nodeGraph), () => { });
        console.log(JSON.stringify(nodeGraph));
    });
}
exports.app = app;
app();
//# sourceMappingURL=app.js.map