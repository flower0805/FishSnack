const {BaseNode} = require('../Utils/BaseNode');
const APJS = require('../../../amazingpro');
class CGReset extends BaseNode {
  constructor() {
    super();
    this.sys = null;
    this.sysResetFlag = null;
    this.resetEndFlag = false;
    this.lockResetScene = false;
  }

  beforeStart(sys) {
    this.sys = sys;
  }

  onUpdate(sys) {
    if (this.sysResetFlag !== undefined && this.sysResetFlag !== null) {
      const settings = this.sys.APJScene.getSettings();
      settings.set('auto_reset_effect', this.sysResetFlag);
      this.sysResetFlag = null;
      this.lockResetScene = false;
    }
  }

  execute(index) {
    if (index === 0) {
      if (this.sys.APJScene) {
        if (this.lockResetScene === true) {
          return;
        }
        this.lockResetScene = true;
        const settings = this.sys.APJScene.getSettings();
        this.sysResetFlag = settings.get('auto_reset_effect');
        settings.set('auto_reset_effect', true);
        const event = new APJS.Event();
        const args = [];
        args.push(APJS.BEFEventType.BET_RECORD_VIDEO);
        args.push(APJS.BEF_RECODE_VEDIO_EVENT_CODE.RECODE_VEDIO_START);
        args.push('EFFECT_RESET');
        event.type = APJS.AppEventType.COMPAT_BEF;
        event.args = args;
        this.sys.APJScene.sendEvent(event);
        if (this.nexts[0] !== undefined) {
          this.nexts[0]();
        }
      }
      return;
    }
  }

  getOutput(index) {
    return null;
  }
}

exports.CGReset = CGReset;
