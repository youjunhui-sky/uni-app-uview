-- tquestionnaire_answer: 问卷答案表（与 src/entities/questionnaire-answer.entity.ts 对齐）
-- mdp 库当前无此表，由 DBA 在 base schema 下执行
CREATE TABLE IF NOT EXISTS base.tquestionnaire_answer (
  id               SERIAL PRIMARY KEY,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  org_id           UUID,
  patient_no       VARCHAR(20) NOT NULL,
  questionnaire_id INT NOT NULL,
  answers          JSONB NOT NULL
);

-- 常用查询索引
CREATE INDEX IF NOT EXISTS idx_questionnaire_answer_patient_no
  ON base.tquestionnaire_answer (patient_no);
CREATE INDEX IF NOT EXISTS idx_questionnaire_answer_questionnaire_id
  ON base.tquestionnaire_answer (questionnaire_id);

-- 唯一约束：(patient_no, questionnaire_id) → 同一就诊人同一问卷只能有一条
-- 配合 service 的 ON CONFLICT DO UPDATE 实现 upsert，并发安全
CREATE UNIQUE INDEX IF NOT EXISTS uq_questionnaire_answer_patient_q
  ON base.tquestionnaire_answer (patient_no, questionnaire_id);

COMMENT ON TABLE  base.tquestionnaire_answer IS '问卷答案';
COMMENT ON COLUMN base.tquestionnaire_answer.patient_no IS '档案号';
COMMENT ON COLUMN base.tquestionnaire_answer.questionnaire_id IS '问卷ID';
COMMENT ON COLUMN base.tquestionnaire_answer.answers IS '答案明细 jsonb: { answers: [{ bh, value, option, other }] }';
