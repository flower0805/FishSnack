'use strict';
const APJS = require('../../../amazingpro');
const {BaseNode} = require('../Utils/BaseNode');
const {EffectReset} = require('../../../EffectReset');
class CGSetVisualEffect extends BaseNode {
  constructor() {
    super();
    this.vfxPropertySheetNameMap = {
      Texture: 'texmap',
      Double: 'floatmap',
      Int: 'intmap',
      Bool: 'intmap',
      Vector2f: 'vec2map',
      Vector3f: 'vec4map',
      Vector4f: 'vec4map',
      Color: 'vec4map',
    };
    this.vfxSetterMap = {
      Texture: 'setTex',
      Double: 'setFloat',
      Int: 'setInt',
      Bool: 'setInt',
      Vector2f: 'setVec2',
      Vector3f: 'setVec4',
      Vector4f: 'setVec4',
      Color: 'setVec4',
    };
    this.vfxGetterMap = {
      Texture: 'getTex',
      Double: 'getFloat',
      Int: 'getInt',
      Bool: 'getInt',
      Vector2f: 'getVec2',
      Vector3f: 'getVec4',
      Vector4f: 'getVec4',
      Color: 'getVec4',
    };
  }

  beforeStart(sys) {
    this.sys = sys;
  }

  transValueType(value) {
    if (this.valueType === 'Color' && value instanceof APJS.Color) {
      return new APJS.Vector4f(value.r, value.g, value.b, value.a);
    } else if (this.valueType === 'Bool') {
      return value ? 1 : 0;
    } else if (this.valueType === 'Vector3f' && value instanceof APJS.Vector3f) {
      return new APJS.Vector4f(value.x, value.y, value.z, 0.0);
    } else {
      return value;
    }
  }

  setUniformValue(vfxProfile, contextIndex, uniformName, vfxUniform) {
    const propertySheetHasIntAsFloat =
      (this.valueType === 'Bool' || this.valueType === 'Int') &&
      vfxProfile.getCtxBlock(contextIndex).exposeProperties.floatmap.has(uniformName);
    const propertySheetHasIntUniform = vfxProfile.getCtxBlock(contextIndex).exposeProperties.intmap.has(uniformName);
    if (
      !EffectReset.getInstance().propertyInitValueMap.has(
        vfxProfile.guid.toString() + '|' + contextIndex.toString() + '|' + uniformName
      )
    ) {
      const callBackFuncMap = new Map();
      if (propertySheetHasIntUniform && !propertySheetHasIntAsFloat) {
        callBackFuncMap.set(
          (_vfxProfile, _contextId, _intUniformName, _intUniformValue) =>
            _vfxProfile.getCtxBlock(_contextId).exposeProperties.setInt(_intUniformName, _intUniformValue),
          [contextIndex, uniformName, vfxProfile.getCtxBlock(contextIndex).exposeProperties.getInt(uniformName)]
        );
      } else if (propertySheetHasIntAsFloat) {
        callBackFuncMap.set(
          (_vfxProfile, _contextId, _intUniformName, _intUniformValue) =>
            _vfxProfile.getCtxBlock(_contextId).exposeProperties.setFloat(_intUniformName, _intUniformValue),
          [contextIndex, uniformName, vfxProfile.getCtxBlock(contextIndex).exposeProperties.getFloat(uniformName)]
        );
      } else {
        const propertySheet =
          vfxProfile.getCtxBlock(contextIndex).exposeProperties[this.vfxPropertySheetNameMap[this.valueType]];
        if (propertySheet.has(uniformName)) {
          callBackFuncMap.set(
            (_vfxProfile, _contextId, _uniformName, _uniformValue) =>
              _vfxProfile
                .getCtxBlock(_contextId)
                .exposeProperties[this.vfxSetterMap[this.valueType]](_uniformName, _uniformValue),
            [
              contextIndex,
              uniformName,
              vfxProfile.getCtxBlock(contextIndex).exposeProperties[this.vfxGetterMap[this.valueType]](uniformName),
            ]
          );
        }
      }
      EffectReset.getInstance().propertyInitValueMap.set(
        vfxProfile.guid.toString() + '|' + contextIndex.toString() + '|' + uniformName,
        callBackFuncMap
      );
    }
    // Handling the int edge case
    if (propertySheetHasIntUniform && !propertySheetHasIntAsFloat) {
      vfxProfile.getCtxBlock(contextIndex).exposeProperties.setInt(uniformName, Math.round(vfxUniform));
    } else if (propertySheetHasIntAsFloat) {
      vfxProfile.getCtxBlock(contextIndex).exposeProperties.setFloat(uniformName, Math.round(vfxUniform));
    } else {
      const propertySheet =
        vfxProfile.getCtxBlock(contextIndex).exposeProperties[this.vfxPropertySheetNameMap[this.valueType]];
      if (propertySheet.has(uniformName)) {
        vfxProfile
          .getCtxBlock(contextIndex)
          .exposeProperties[this.vfxSetterMap[this.valueType]](uniformName, vfxUniform);
      }
    }
  }

  execute() {
    const vfxProfile = this.inputs[1]();
    const uniformName = this.inputs[2]();
    const isSpawnParam = this.inputs[3]();
    const uniformValue = this.inputs[4]();

    if (
      vfxProfile === null ||
      vfxProfile === undefined ||
      uniformName === null ||
      uniformName === undefined ||
      isSpawnParam === null ||
      isSpawnParam === undefined ||
      uniformValue === null ||
      uniformValue === undefined
    ) {
      return;
    }

    const vfxUniform = this.transValueType(uniformValue);
    const contextCount = vfxProfile.ctxBlocks.size();

    if (isSpawnParam) {
      const contexIndex = parseInt(uniformName.split('_')[1]);
      const spawnUniformName = uniformName.split('_')[0];
      const lowercaseSapwnParamName = spawnUniformName.toLowerCase();
      this.valueType = 'Double';
      if (lowercaseSapwnParamName === 'spawnrate') {
        const spawnRate = vfxUniform;
        const delay = spawnRate > 30 ? 0.0 : 1 / spawnRate + 0.00001;
        const actualRate = spawnRate > 30 ? spawnRate / 30 : 1;
        this.setUniformValue(vfxProfile, contexIndex, 'spawnRateMin', actualRate - 0.0001);
        this.setUniformValue(vfxProfile, contexIndex, 'spawnRateMax', actualRate + 0.0001);
        this.setUniformValue(vfxProfile, contexIndex, 'delayMin', delay);
        this.setUniformValue(vfxProfile, contexIndex, 'delayMax', delay);
        this.setUniformValue(vfxProfile, contexIndex, 'originalSpawnRate', spawnRate);
      } else if (lowercaseSapwnParamName === 'burstcount') {
        const spawnRate = vfxUniform;
        this.setUniformValue(vfxProfile, contexIndex, 'spawnRateMin', spawnRate - 0.0001);
        this.setUniformValue(vfxProfile, contexIndex, 'spawnRateMax', spawnRate + 0.0001);
      } else if (lowercaseSapwnParamName === 'burstdelay') {
        const delay = vfxUniform;
        this.setUniformValue(vfxProfile, contexIndex, 'delayMin', delay);
        this.setUniformValue(vfxProfile, contexIndex, 'delayMax', delay);
      } else if (lowercaseSapwnParamName === 'spawnratemin') {
        const spawnRate = vfxUniform;
        this.setUniformValue(vfxProfile, contexIndex, 'spawnRateMin', spawnRate - 0.0001);
      } else if (lowercaseSapwnParamName === 'spawnratemax') {
        const spawnRate = vfxUniform;
        this.setUniformValue(vfxProfile, contexIndex, 'spawnRateMax', spawnRate + 0.0001);
      } else if (lowercaseSapwnParamName === 'delaymin') {
        const delay = vfxUniform;
        this.setUniformValue(vfxProfile, contexIndex, 'delayMin', delay);
      } else if (lowercaseSapwnParamName === 'delaymax') {
        const delay = vfxUniform;
        this.setUniformValue(vfxProfile, contexIndex, 'delayMax', delay);
      } else {
        this.setUniformValue(vfxProfile, contexIndex, spawnUniformName, vfxUniform);
      }
    } else {
      for (let contextIndex = 0; contextIndex < contextCount; contextIndex++) {
        this.setUniformValue(vfxProfile, contextIndex, uniformName, vfxUniform);
      }
    }
    if (this.nexts[0]) {
      this.nexts[0]();
    }
  }
}

exports.CGSetVisualEffect = CGSetVisualEffect;
