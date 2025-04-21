'use strict';
const APJS = require('../../../amazingpro');
const {BaseNode} = require('../Utils/BaseNode');
const {getDefaultValue} = require('../Utils/GraphHelper');

const delaySetStates = {
  Idle: 0,
  Delay: 1,
  AfterDelay: 2,
};

class CGDelaySet extends BaseNode {
  constructor() {
    super();
    this.state = delaySetStates.Idle;
    this.currentSetValue = null;
    this.cachedSetValue = null;
    this.delayDuration = Number.MAX_VALUE;
  }

  execute(index) {
    this.cachedSetValue = this.inputs[1]();
    this.delayDuration = this.inputs[2]();
    this.currentSetValue = getDefaultValue(this.valueType);
    this.state = delaySetStates.Delay;

    if (this.nexts[0]) {
      this.nexts[0]();
    }
  }

  getOutput() {
    return this.currentSetValue;
  }

  onUpdate(sys, dt) {
    switch (this.state) {
      case delaySetStates.Delay:
        this.delayDuration = this.delayDuration - dt;

        if (this.delayDuration <= 0) {
          this.currentSetValue = this.cachedSetValue;
          this.state = delaySetStates.AfterDelay;
          this.delayDuration = Number.MAX_VALUE;
          return;
        }

        break;
      case delaySetStates.AfterDelay:
        if (this.nexts[1]) {
          this.nexts[1]();
        }
        break;
      default:
        break;
    }
  }

  resetOnRecord(sys) {
    this.state = delaySetStates.Idle;
    this.cachedSetValue = getDefaultValue(this.valueType);
    this.currentSetValue = getDefaultValue(this.valueType);
    this.delayDuration = Number.MAX_VALUE;
  }
}
exports.CGDelaySet = CGDelaySet;
