import { describe, test, expect, beforeEach } from '@jest/globals';
import { analyzeAndJudgeImprovementGuidance } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-288
  test('商談進捗データの進捗率が負の値のとき、処理が中断される', () => {
    const deal_progress_input = {
      deal_id: 'DEAL-20240115-001',
      salesperson_id: 'SP-0001',
      progress_rate: -5,
      deal_stage: 'proposal',
      customer_id: 'CUST-0001',
      deal_amount: 500000,
      days_elapsed: 15,
      contact_frequency: 3,
      proposal_count: 2,
      follow_up_interval_days: 5,
    };

    const result = analyzeAndJudgeImprovementGuidance(deal_progress_input);

    expect(result).toHaveProperty('error');
    expect(result.error).toHaveProperty('code');
    expect(result.error.code).toBe('INVALID_PROGRESS_RATE');
    expect(result.error).toHaveProperty('message');
    expect(result.error.message).toMatch(/進捗率は0以上100以下の値である必要があります/);
    expect(result).not.toHaveProperty('analysis');
    expect(result).not.toHaveProperty('improvement_guidance');
    expect(result).not.toHaveProperty('judgment_result');
  });
});