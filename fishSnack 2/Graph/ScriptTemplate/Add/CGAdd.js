"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CGAdd = void 0;
const ScriptNodeAPI_1 = require('../Utils/ScriptNodeAPI');
const APJS = __importStar(require('../../../amazingpro'));
class CGAdd extends ScriptNodeAPI_1.BaseNode {
    constructor() {
        super();
    }
    getOutput(index) {
        const curType = this.valueType;
        if (!curType) {
            return null;
        }
        if (curType == 'Int' || curType == 'Double') {
            let result = 0.0;
            for (let k = 0; k < this.inputs.length; ++k) {
                const op = this.inputs[k]();
                if (op == null) {
                    return null;
                }
                result += op;
            }
            return result;
        }
        else if (curType == 'Vector2f') {
            let resultX = 0.0;
            let resultY = 0.0;
            for (let k = 0; k < this.inputs.length; ++k) {
                const op = this.inputs[k]();
                if (op == null) {
                    return null;
                }
                resultX += op.x;
                resultY += op.y;
            }
            return new APJS.Vector2f(resultX, resultY);
        }
        else if (curType == 'Vector3f') {
            let resultX = 0.0;
            let resultY = 0.0;
            let resultZ = 0.0;
            for (let k = 0; k < this.inputs.length; ++k) {
                const op = this.inputs[k]();
                if (op == null) {
                    return null;
                }
                resultX += op.x;
                resultY += op.y;
                resultZ += op.z;
            }
            return new APJS.Vector3f(resultX, resultY, resultZ);
        }
        else if (curType == 'Vector4f') {
            let resultX = 0.0;
            let resultY = 0.0;
            let resultZ = 0.0;
            let resultW = 0.0;
            for (let k = 0; k < this.inputs.length; ++k) {
                const op = this.inputs[k]();
                if (op == null) {
                    return null;
                }
                resultX += op.x;
                resultY += op.y;
                resultZ += op.z;
                resultW += op.w;
            }
            return new APJS.Vector4f(resultX, resultY, resultZ, resultW);
        }
        else {
            return null;
        }
    }
}
exports.CGAdd = CGAdd;
//# sourceMappingURL=CGAdd.js.map