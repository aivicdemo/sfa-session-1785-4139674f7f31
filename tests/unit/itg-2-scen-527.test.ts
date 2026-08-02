import { detectAndJudgeDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-527
  test('データ品質ルールで許容される重複スコアの範囲内の候補のみ統合対象として判定される', () => {
    fetchMock.resetMocks();

    const quality_rule = {
      rule_id: 'QR-001',
      duplicate_score_min: 70,
      duplicate_score_max: 85,
    };

    const duplicate_candidates = [
      {
        candidate_id: 'A',
        duplicate_score: 68,
      },
      {
        candidate_id: 'B',
        duplicate_score: 75,
      },
      {
        candidate_id: 'C',
        duplicate_score: 80,
      },
      {
        candidate_id: 'D',
        duplicate_score: 88,
      },
    ];

    const integration_targets = detectAndJudgeDuplicateCustomers(
      quality_rule,
      duplicate_candidates
    );

    expect(integration_targets).toEqual([
      {
        candidate_id: 'B',
        duplicate_score: 75,
      },
      {
        candidate_id: 'C',
        duplicate_score: 80,
      },
    ]);
    expect(integration_targets.length).toBe(2);
  });
});