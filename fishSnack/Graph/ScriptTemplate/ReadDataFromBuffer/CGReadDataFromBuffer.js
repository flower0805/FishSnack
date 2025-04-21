'use strict';
const APJS = require('../../../amazingpro');
const {BaseNode} = require('../Utils/BaseNode');
class CGReadDataFromBuffer extends BaseNode {
  getOutput(index) {
    const dataBuffer = this.inputs[0]();
    if (dataBuffer == null) {
      return null;
    }

    const bufferData = dataBuffer.data;
    const dataNumber = bufferData.size();

    switch (index) {
      case 0:
        return dataNumber > 0 ? bufferData.get(0) : null;
      case 1:
        return dataNumber > 1 ? bufferData.get(1) : null;
      case 2:
        return dataNumber > 2 ? bufferData.get(2) : null;
      case 3:
        return dataNumber > 3 ? bufferData.get(3) : null;
      default:
        return null;
    }
  }
}
exports.CGReadDataFromBuffer = CGReadDataFromBuffer;
