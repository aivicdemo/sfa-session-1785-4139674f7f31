import { applyNormalizationRules } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-245
  test('正規化ルールが複数件のとき、全てのルールが順序通りに適用される', () => {
    const normalizationRules = [
      {
        ruleId: 'rule_1',
        ruleOrder: 1,
        ruleType: 'replace',
        sourcePattern: '　',
        targetValue: ' ',
        description: '全角スペースを半角スペースに変換'
      },
      {
        ruleId: 'rule_2',
        ruleOrder: 2,
        ruleType: 'replace',
        sourcePattern: '-',
        targetValue: '',
        description: 'ハイフンを削除'
      },
      {
        ruleId: 'rule_3',
        ruleOrder: 3,
        ruleType: 'replace',
        sourcePattern: 'ヤマダ',
        targetValue: 'やまだ',
        description: 'カタカナをひらがなに変換'
      }
    ];

    const inputData = {
      customerId: 'cust_001',
      customerName: '山田　太郎-ヤマダ'
    };

    const result = applyNormalizationRules(inputData, normalizationRules);

    expect(result.normalizedValue).toBe('山田 太郎やまだ');
    expect(result.processingHistory).toEqual([
      {
        ruleOrder: 1,
        ruleId: 'rule_1',
        intermediateResult: '山田 太郎-ヤマダ'
      },
      {
        ruleOrder: 2,
        ruleId: 'rule_2',
        intermediateResult: '山田 太郎ヤマダ'
      },
      {
        ruleOrder: 3,
        ruleId: 'rule_3',
        intermediateResult: '山田 太郎やまだ'
      }
    ]);
    expect(result.processingHistory).toHaveLength(3);
    expect(result.processingHistory[0].ruleOrder).toBe(1);
    expect(result.processingHistory[1].ruleOrder).toBe(2);
    expect(result.processingHistory[2].ruleOrder).toBe(3);
  });
});