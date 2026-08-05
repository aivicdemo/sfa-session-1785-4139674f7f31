import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import {
  createProcessStageWithCriteria,
  getProcessStageCriteriaDetail
} from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  let processStageId: string;
  let createdAt: string;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-166
  test('[normal] プロセス段階の要件仕様化機能 - プロセス段階に紐づく判定基準が複数個の場合、全判定基準が要件に正しく反映される', async () => {
    const stageName = '提案資料作成';
    const criteria = [
      {
        criterion_name: '資料完成度が80%以上',
        criterion_description: '提案資料の完成度が80%以上であること'
      },
      {
        criterion_name: '顧客確認メール送信済み',
        criterion_description: '顧客に対する確認メールが送信されていること'
      },
      {
        criterion_name: '見積金額が確定している',
        criterion_description: '顧客に提示する見積金額が確定していること'
      }
    ];

    createdAt = '2024-02-15T10:30:00Z';

    const createResult = await createProcessStageWithCriteria({
      stage_name: stageName,
      criteria_list: criteria,
      created_at: createdAt
    });

    processStageId = createResult.process_stage_id;

    expect(createResult.process_stage_id).toBeDefined();
    expect(typeof createResult.process_stage_id).toBe('string');
    expect(createResult.stage_name).toBe('提案資料作成');
    expect(createResult.criteria_count).toBe(3);

    const detailResult = await getProcessStageCriteriaDetail({
      process_stage_id: processStageId
    });

    expect(detailResult.process_stage_id).toBe(processStageId);
    expect(detailResult.stage_name).toBe('提案資料作成');
    expect(detailResult.criteria_detail.length).toBe(3);

    const criterion1 = detailResult.criteria_detail.find(
      (c: { criterion_name: string }) => c.criterion_name === '資料完成度が80%以上'
    );
    expect(criterion1).toBeDefined();
    expect(criterion1.criterion_description).toBe('提案資料の完成度が80%以上であること');

    const criterion2 = detailResult.criteria_detail.find(
      (c: { criterion_name: string }) => c.criterion_name === '顧客確認メール送信済み'
    );
    expect(criterion2).toBeDefined();
    expect(criterion2.criterion_description).toBe('顧客に対する確認メールが送信されていること');

    const criterion3 = detailResult.criteria_detail.find(
      (c: { criterion_name: string }) => c.criterion_name === '見積金額が確定している'
    );
    expect(criterion3).toBeDefined();
    expect(criterion3.criterion_description).toBe('顧客に提示する見積金額が確定していること');

    expect(detailResult.saved_at).toBeDefined();
  });
});