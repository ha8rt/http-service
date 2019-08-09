"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./body/body"));
// export * from "./config/config";
__export(require("./http.service/http.service"));
__export(require("./service/obs"));
__export(require("./service/query"));
__export(require("./service/service"));
