import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-280
  it('営業担当者IDが空文字列のとき、エラーが発生して処理が中断される', async () => {
    const { analyzeAndJudgeImprovementGuidance } = await import(
      '../../src/logic/it-1-br-2-1-1-1'
    );

    const invalidSalesPersonId = '';
    const analysisInput = {
      sales_person_id: invalidSalesPersonId,
      period_start: '2024-01-01',
      period_end: '2024-01-31',
      min_deal_count: 5,
    };

    expect(() => {
      analyzeAndJudgeImprovementGuidance(analysisInput);
    }).toThrow(/営業担当者ID/);
  });
});