import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseSysParamEntity } from '../../entities/sys-param.entity';

@Injectable()
export class BaseService {
  constructor(
    @InjectRepository(BaseSysParamEntity)
    private readonly baseSysParamEntity: Repository<BaseSysParamEntity>,
  ) {}

  /**
   * 获取协议/文档内容 (与8081一致)
   */
  async getParam(key: string): Promise<{ content: string }> {
    const result = await this.baseSysParamEntity.findOneBy({ keyName: key });
    if (result) {
      return { content: result.data || '' };
    }
    return { content: '' };
  }

  /**
   * 获取 EPS 服务定义 (与8081一致)
   */
  async getEps(): Promise<any> {
    return [
      {
        module: 'user',
        info: { type: { name: 'user', description: '用户模块' } },
        api: [
          { method: 'POST', path: '/user/login/phone', summary: '手机号登录', prefix: '/app/user/login', ignoreToken: false },
          { method: 'POST', path: '/user/login/smsCode', summary: '发送短信', prefix: '/app/user/login', ignoreToken: false },
          { method: 'GET', path: '/user/login/captcha', summary: '图形验证码', prefix: '/app/user/login', ignoreToken: false },
          { method: 'POST', path: '/user/login/refreshToken', summary: '刷新Token', prefix: '/app/user/login', ignoreToken: false },
          { method: 'GET', path: '/user/info/person', summary: '获取用户信息', prefix: '/app/user/info', ignoreToken: false },
          { method: 'POST', path: '/user/info/updatePerson', summary: '更新用户信息', prefix: '/app/user/info', ignoreToken: false },
          { method: 'GET', path: '/user/comm/wxMpConfig', summary: '微信配置', prefix: '/app/user/comm', ignoreToken: true },
        ],
        columns: [],
        pageQueryOp: { keyWordLikeFields: [], fieldEq: [], fieldLike: [] },
        pageColumns: [],
        prefix: '/app/user',
      },
      {
        module: 'patient',
        info: { type: { name: 'patient', description: '患者模块' } },
        api: [
          { method: 'POST', path: '/patient/patientUser/getByUserId', summary: '获取就诊人列表', prefix: '/app/patient/patientUser', ignoreToken: false },
          { method: 'POST', path: '/patient/patientUser/getCurrentPatient', summary: '获取当前就诊人', prefix: '/app/patient/patientUser', ignoreToken: false },
          { method: 'POST', path: '/patient/patientUser/addPatientUser', summary: '添加就诊人', prefix: '/app/patient/patientUser', ignoreToken: false },
          { method: 'POST', path: '/patient/patientUser/updateDefault', summary: '设置默认就诊人', prefix: '/app/patient/patientUser', ignoreToken: false },
          { method: 'POST', path: '/patient/patientUser/delete', summary: '删除就诊人', prefix: '/app/patient/patientUser', ignoreToken: false },
          { method: 'POST', path: '/patient/patientInfo/update', summary: '更新患者信息', prefix: '/app/patient/patientInfo', ignoreToken: false },
          { method: 'POST', path: '/patient/patientInfo/getByIdCardAndName', summary: '按证件号姓名查询', prefix: '/app/patient/patientInfo', ignoreToken: false },
          { method: 'POST', path: '/patient/info/page', summary: '分页查询患者', prefix: '/app/patient/info', ignoreToken: false },
          { method: 'GET', path: '/patient/info/info', summary: '获取患者详情', prefix: '/app/patient/info', ignoreToken: false },
        ],
        columns: [],
        pageQueryOp: { keyWordLikeFields: [], fieldEq: [], fieldLike: [] },
        pageColumns: [],
        prefix: '/app/patient',
      },
      {
        module: 'questionnaire',
        info: { type: { name: 'questionnaire', description: '问卷模块' } },
        api: [
          { method: 'POST', path: '/questionnaire/questionnaire/questionsWithOptions', summary: '获取问卷题目', prefix: '/app/questionnaire', ignoreToken: false },
        ],
        columns: [],
        pageQueryOp: { keyWordLikeFields: [], fieldEq: [], fieldLike: [] },
        pageColumns: [],
        prefix: '/app/questionnaire',
      },
      {
        module: 'etiology',
        info: { type: { name: 'etiology', description: '代谢评估模块' } },
        api: [
          { method: 'POST', path: '/etiology/muaInfo/getMuaInfoByPatientNo', summary: '获取代谢评估列表', prefix: '/app/etiology/muaInfo', ignoreToken: false },
          { method: 'POST', path: '/etiology/muaInfo/getMuaContentByPatientNoAndSwlNo', summary: '获取评估详情', prefix: '/app/etiology/muaInfo', ignoreToken: false },
        ],
        columns: [],
        pageQueryOp: { keyWordLikeFields: [], fieldEq: [], fieldLike: [] },
        pageColumns: [],
        prefix: '/app/etiology',
      },
      {
        module: 'dict',
        info: { type: { name: 'dict', description: '字典模块' } },
        api: [
          { method: 'POST', path: '/dict/info/types', summary: '获取字典类型', prefix: '/app/dict/info', ignoreToken: true },
          { method: 'POST', path: '/dict/info/data', summary: '获取字典数据', prefix: '/app/dict/info', ignoreToken: true },
        ],
        columns: [],
        pageQueryOp: { keyWordLikeFields: [], fieldEq: [], fieldLike: [] },
        pageColumns: [],
        prefix: '/app/dict',
      },
      {
        module: 'base',
        info: { type: { name: 'comm', description: '公共模块' } },
        api: [
          { method: 'GET', path: '/base/comm/uploadMode', summary: '获取上传模式', prefix: '/app/base/comm', ignoreToken: true },
          { method: 'POST', path: '/base/comm/upload', summary: '文件上传', prefix: '/app/base/comm', ignoreToken: false },
          { method: 'GET', path: '/base/comm/param', summary: '参数配置', prefix: '/app/base/comm', ignoreToken: true },
        ],
        columns: [],
        pageQueryOp: { keyWordLikeFields: [], fieldEq: [], fieldLike: [] },
        pageColumns: [],
        prefix: '/app/base/comm',
      },
    ];
  }
}