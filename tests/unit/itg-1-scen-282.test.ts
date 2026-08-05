import { describe, it, expect, beforeEach } from '@jest/globals';
import { calculateDeviationScoreAndRecommendations } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-282
  it('標準プロセス定義が空配列のとき、乖離度計算ができずエラーを返す', () => {
    const empty_process_definition = [];
    const sales_person_behavior = {
      contact_count: 5,
      proposal_sent_count: 3,
      followup_count: 2,
    };

    expect(() => 
      calculateDeviationScoreAndRecommendations(
        empty_process_definition,
        sales_person_behavior
      )
    ).toThrow(/標準プロセス定義/);
  });
});