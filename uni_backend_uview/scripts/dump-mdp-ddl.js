// 一次性脚本：连 mdp 库导出 11 张表的 DDL
// 用法：node scripts/dump-mdp-ddl.js > mdp-ddl.txt
const { Client } = require('pg');

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

const client = new Client({
  host: process.env.DB_HOST || '36.111.159.23',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1223',
  database: process.env.DB_NAME || 'mdp',
});

(async () => {
  await client.connect();
  console.log('-- mdp 库 DDL 导出');
  console.log('-- host:', client.host, 'database:', client.database);
  console.log('');

  for (const [schema, table] of TABLES) {
    console.log(`\n========== ${schema}.${table} ==========`);
    // 表结构
    const r1 = await client.query(
      `SELECT column_name, data_type, is_nullable, column_default, character_maximum_length, numeric_precision, numeric_scale
         FROM information_schema.columns
        WHERE table_schema = $1 AND table_name = $2
        ORDER BY ordinal_position`,
      [schema, table]
    );
    if (r1.rows.length === 0) {
      console.log(`!! 表 ${schema}.${table} 不存在 !!`);
      continue;
    }
    for (const row of r1.rows) {
      const t = row.character_maximum_length
        ? `${row.data_type}(${row.character_maximum_length})`
        : row.numeric_precision
          ? `${row.data_type}(${row.numeric_precision},${row.numeric_scale || 0})`
          : row.data_type;
      console.log(
        `${row.column_name.padEnd(28)} ${t.padEnd(28)} ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'} ${
          row.column_default ? `DEFAULT ${row.column_default}` : ''
        }`
      );
    }
    // 主键
    const r2 = await client.query(
      `SELECT a.attname
         FROM pg_index i
         JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
         WHERE i.indrelid = ($1 || '.' || $2)::regclass AND i.indisprimary`,
      [schema, table]
    );
    if (r2.rows.length) console.log('PK:', r2.rows.map((r) => r.attname).join(','));
    // 索引
    const r3 = await client.query(
      `SELECT indexname, indexdef FROM pg_indexes WHERE schemaname = $1 AND tablename = $2`,
      [schema, table]
    );
    for (const row of r3.rows) console.log('IDX:', row.indexname, '|', row.indexdef);
  }

  await client.end();
})().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
