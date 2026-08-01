import { executeSystemHealthCheck } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-229
  test('システムヘルスチェック判定機能 - 営業データ品質データが欠落しているとき例外が発生する', () => {
    const mock_dataset = {
      sales_deals: [
        {
          deal_id: 'D001',
          customer_id: null,
          deal_amount: 150000,
          stage: 'proposal',
          last_updated: '2024-01-15T10:00:00Z'
        }
      ],
      quality_rules: [
        {
          rule_id: 'R001',
          field_name: 'customer_id',
          is_required: true
        }
      ]
    };

    expect(() => executeSystemHealthCheck(mock_dataset)).toThrow(/営業データ品質検証エラー|必須フィールド欠落/);

    try {
      executeSystemHealthCheck(mock_dataset);
    } catch (error: unknown) {
      const err = error as { errorCode?: string; message: string };
      expect(err.errorCode).toBe('DATA_QUALITY_MISSING_FIELD');
      expect(err.message).toMatch(/営業データ品質検証エラー|必須フィールド欠落/);
    }
  });
});