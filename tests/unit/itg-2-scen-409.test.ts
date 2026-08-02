import { detectDuplicateCustomers, executeIntegrationJudgment } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-409
  test('同一重複候補データで2回統合判定を実行した場合、同じ結果が返される', () => {
    const customerDataset = [
      {
        customer_id: 'CUST001',
        customer_name: '山田商事',
        email: 'yamada@example.com',
        phone: '09012345678',
        address: '東京都渋谷区1-1-1',
        registration_date: '2023-01-15T00:00:00Z',
      },
      {
        customer_id: 'CUST002',
        customer_name: '山田商事株式会社',
        email: 'yamada@example.com',
        phone: '09012345678',
        address: '東京都渋谷区1-1-1',
        registration_date: '2023-02-20T00:00:00Z',
      },
    ];

    const duplicateDetectionRules = {
      name_similarity_threshold: 0.85,
      email_match_weight: 0.3,
      phone_match_weight: 0.3,
      address_match_weight: 0.2,
      registration_date_proximity_days: 60,
    };

    const integrationRules = {
      merge_decision_threshold: 0.8,
      priority_field_order: ['email', 'phone', 'address'],
    };

    // 1回目の重複検出
    const firstDetectionResult = detectDuplicateCustomers(
      customerDataset,
      duplicateDetectionRules
    );

    expect(firstDetectionResult).toBeDefined();
    expect(Array.isArray(firstDetectionResult.duplicate_candidates)).toBe(true);
    expect(firstDetectionResult.duplicate_candidates.length).toBeGreaterThan(0);

    const duplicateCandidate = firstDetectionResult.duplicate_candidates[0];

    // 1回目の統合判定実行
    const firstJudgmentResult = executeIntegrationJudgment(
      duplicateCandidate,
      integrationRules
    );

    expect(firstJudgmentResult).toBeDefined();
    expect(firstJudgmentResult).toHaveProperty('merge_decision');
    expect(firstJudgmentResult).toHaveProperty('judgment_score');
    expect(firstJudgmentResult).toHaveProperty('judgment_reasoning');

    const firstDecision = firstJudgmentResult.merge_decision;
    const firstScore = firstJudgmentResult.judgment_score;
    const firstReasoning = firstJudgmentResult.judgment_reasoning;

    // 2回目の重複検出（同じデータセット）
    const secondDetectionResult = detectDuplicateCustomers(
      customerDataset,
      duplicateDetectionRules
    );

    const secondDuplicateCandidate = secondDetectionResult.duplicate_candidates[0];

    // 2回目の統合判定実行（同じ重複候補に対して）
    const secondJudgmentResult = executeIntegrationJudgment(
      secondDuplicateCandidate,
      integrationRules
    );

    const secondDecision = secondJudgmentResult.merge_decision;
    const secondScore = secondJudgmentResult.judgment_score;
    const secondReasoning = secondJudgmentResult.judgment_reasoning;

    // 1回目と2回目の判定結果が同一であることを確認
    expect(secondDecision).toBe(firstDecision);
    expect(secondScore).toBe(firstScore);
    expect(secondReasoning).toEqual(firstReasoning);
  });
});