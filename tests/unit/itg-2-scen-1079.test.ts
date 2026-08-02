import { duplicateJudgmentEngine } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1079
  test('重複候補顧客が1件のとき、単一の重複判定結果が生成される', () => {
    const input_customers = [
      {
        customer_id: 'C001',
        customer_name: '山田太郎',
        address: '東京都渋谷区',
      },
    ];

    const result = duplicateJudgmentEngine(input_customers);

    expect(result).toEqual({
      duplicate_verdicts: [
        {
          verdict_id: expect.any(String),
          customer_count: 1,
          duplicate_group_id: null,
          judgment_status: 'NO_DUPLICATE',
          match_score: 0,
        },
      ],
    });

    expect(result.duplicate_verdicts).toHaveLength(1);
    expect(result.duplicate_verdicts[0].customer_count).toBe(1);
    expect(result.duplicate_verdicts[0].duplicate_group_id).toBeNull();
    expect(result.duplicate_verdicts[0].judgment_status).toBe('NO_DUPLICATE');
    expect(result.duplicate_verdicts[0].match_score).toBe(0);
  });
});