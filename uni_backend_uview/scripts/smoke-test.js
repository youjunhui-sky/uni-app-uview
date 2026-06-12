// 冒烟测试：建缺失表 + 验证 11 张表 + 跨 schema 查询
// 用法：node scripts/smoke-test.js
const { Client } = require('pg');

const DDL = `
-- schema
CREATE SCHEMA IF NOT EXISTS base;
CREATE SCHEMA IF NOT EXISTS mua;

-- tuser_info
CREATE TABLE IF NOT EXISTS base.tuser_info (
  id            SERIAL PRIMARY KEY,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  org_id        UUID,
  unionid       VARCHAR,
  avatar_url    VARCHAR,
  nick_name     VARCHAR,
  phone         VARCHAR,
  gender        SMALLINT NOT NULL DEFAULT 0,
  status        SMALLINT NOT NULL DEFAULT 1,
  login_type    SMALLINT NOT NULL DEFAULT 0,
  password      VARCHAR,
  description   TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS tuser_info_unionid_unique ON base.tuser_info(unionid);
CREATE UNIQUE INDEX IF NOT EXISTS tuser_info_phone_unique    ON base.tuser_info(phone);

-- tpatient_user
CREATE TABLE IF NOT EXISTS base.tpatient_user (
  id           SERIAL PRIMARY KEY,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  org_id       UUID,
  patient_no   VARCHAR(20) NOT NULL,
  user_id      INT NOT NULL,
  "default"    INT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS tpatient_user_userid_idx ON base.tpatient_user(user_id);
`;

const TABLES = [
  ['base', 'tuser_info'],
  ['base', 'tpatient_user'],
  ['base', 'tbus_patient_info'],
  ['base', 'tsys_questionnaire'],
  ['base', 'tsys_question'],
  ['base', 'tsys_option'],
  ['base', 'tsys_param'],
  ['base', 'tsys_dict_type'],
  ['base', 'tsys_dict_info'],
  ['mua', 'tetiology_mua_info'],
  ['mua', 'tetiology_mua_content'],
];

function ok(msg) { console.log(`  ✅ ${msg}`); }
function fail(msg) { console.log(`  ❌ ${msg}`); }
function info(msg) { console.log(`  ℹ  ${msg}`); }

(async () => {
  const c = new Client({host: '36.111.159.23', port: 5432, user: 'postgres', password: '1223', database: 'mdp'});
  await c.connect();

  console.log('=== 1) 建缺失表 ===');
  await c.query(DDL);
  ok('DDL 执行完毕');

  console.log('\n=== 2) 11 张表存在性 + 行数 ===');
  for (const [s, t] of TABLES) {
    try {
      const r = await c.query(`SELECT count(*)::int as cnt FROM ${s}."${t}"`);
      ok(`${s}.${t}: ${r.rows[0].cnt} rows`);
    } catch (e) {
      fail(`${s}.${t}: ${e.message}`);
    }
  }

  console.log('\n=== 3) 跨 schema JOIN: patient_user ↔ patient_info ===');
  // 模拟 auth.service.ts getByUserId 的查询
  try {
    const r = await c.query(`
      SELECT a.id, a.patient_no, a.user_id, a."default",
             b.id as "patientId", b.name, b.id_card, b.gender, b.mobile
        FROM base.tpatient_user a
        LEFT JOIN base.tbus_patient_info b
          ON a.patient_no = b.patient_no
       WHERE a.user_id = (SELECT id FROM base.tuser_info ORDER BY id LIMIT 1)
       LIMIT 3
    `);
    ok(`JOIN 返回 ${r.rows.length} 行`);
    if (r.rows.length > 0) {
      info('样本: ' + JSON.stringify(r.rows[0], null, 2).split('\n').slice(0, 8).join(' '));
    }
  } catch (e) {
    fail(`JOIN 失败: ${e.message}`);
  }

  console.log('\n=== 4) 跨 schema 单表: mua.tetiology_mua_info ===');
  try {
    const r = await c.query(`
      SELECT id, patient_no, mua_no, assessment_count, assessment_date, deleted_at
        FROM mua.tetiology_mua_info
       WHERE deleted_at IS NULL
       ORDER BY assessment_date DESC
       LIMIT 3
    `);
    ok(`查询返回 ${r.rows.length} 行`);
    if (r.rows.length > 0) {
      const cols = Object.keys(r.rows[0]);
      info('返回列: ' + cols.join(', '));
      // 注意：tenant_id 仍在 mdp 表中（因为我们没改 mdp DDL），但代码已不再使用
      if (cols.includes('tenant_id')) {
        info('⚠️  mdp 表中仍含 tenant_id 列（不影响功能，代码已忽略）');
      }
    }
  } catch (e) {
    fail(`mua 查询失败: ${e.message}`);
  }

  console.log('\n=== 5) 字典: tsys_dict_type + tsys_dict_info ===');
  try {
    const types = await c.query(`SELECT id, name, key, status, module FROM base.tsys_dict_type WHERE status = 1 LIMIT 5`);
    ok(`tsys_dict_type 返回 ${types.rows.length} 行`);
    if (types.rows.length > 0) {
      info('类型: ' + types.rows.map(r => `${r.key}(${r.id})`).join(', '));
    }
    const infos = await c.query(`
      SELECT id, type_id, name, value, parent_id, order_num, status
        FROM base.tsys_dict_info
       WHERE type_id IN (SELECT id FROM base.tsys_dict_type WHERE status = 1 LIMIT 1)
       ORDER BY order_num
       LIMIT 3
    `);
    ok(`tsys_dict_info (按 type_id 过滤) 返回 ${infos.rows.length} 行`);
    if (infos.rows.length > 0) {
      const sample = infos.rows[0];
      info(`parent_id 类型: ${typeof sample.parent_id}（mdp 这里是 varchar 字符串）`);
    }
  } catch (e) {
    fail(`字典查询失败: ${e.message}`);
  }

  console.log('\n=== 6) 问卷: questionnaire + question + option ===');
  try {
    const qn = await c.query(`SELECT id, title, creator_id, published, sort FROM base.tsys_questionnaire LIMIT 3`);
    ok(`questionnaire 返回 ${qn.rows.length} 行`);
    if (qn.rows.length > 0) {
      const qid = qn.rows[0].id;
      const qs = await c.query(`SELECT id, questionnaire_id, title, type, sort, required, bh FROM base.tsys_question WHERE questionnaire_id = $1`, [qid]);
      ok(`questionnaire[${qid}] 下有 ${qs.rows.length} 个问题`);
      if (qs.rows.length > 0) {
        const opt = await c.query(`SELECT id, question_id, content, sort, score, bh, other FROM base.tsys_option WHERE question_id = $1`, [qs.rows[0].id]);
        ok(`问题[${qs.rows[0].id}] 下有 ${opt.rows.length} 个选项`);
      }
    }
  } catch (e) {
    fail(`问卷查询失败: ${e.message}`);
  }

  console.log('\n=== 7) tuser_info 唯一索引测试 ===');
  try {
    // 测 unique index：插入一个 phone='test_unique'，再插一个同样的应该失败
    await c.query(`INSERT INTO base.tuser_info (phone, gender, status) VALUES ('test_unique', 0, 1) ON CONFLICT DO NOTHING`);
    try {
      await c.query(`INSERT INTO base.tuser_info (phone, gender, status) VALUES ('test_unique', 0, 1)`);
      fail('唯一索引未生效：重复 phone 插入成功');
      await c.query(`DELETE FROM base.tuser_info WHERE phone = 'test_unique'`);
    } catch (e) {
      ok(`唯一索引生效：${e.message.split('\n')[0]}`);
      await c.query(`DELETE FROM base.tuser_info WHERE phone = 'test_unique'`);
    }
  } catch (e) {
    fail(`唯一索引测试失败: ${e.message}`);
  }

  await c.end();
  console.log('\n=== 冒烟测试完成 ===');
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
