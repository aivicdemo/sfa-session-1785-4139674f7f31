import { detectDuplicateCustomersAndGenerateIntegrationJudgments } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-795
  test('重複候補顧客が0件の場合、統合判定リストが空として返される', () => {
    const input = {
      customer_data: [],
      duplicate_detection_rules: [],
      normalization_rules: []
    };

    const result = detectDuplicateCustomersAndGenerateIntegrationJudgments(input);

    expect(result.integration_judgments).toEqual([]);
    expect(result.integration_judgments.length).toBe(0);
  });
});