import { detectAndMergeCustomerDuplicates } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-393
  test('[normal] 正規化ルールが複数件の場合、全ルールが順序通りに適用される', () => {
    const normalizationRules = [
      {
        ruleId: 'rule_A',
        ruleOrder: 1,
        ruleName: '全角スペースを削除',
        ruleLogic: (input: string) => input.replace(/　/g, ''),
      },
      {
        ruleId: 'rule_B',
        ruleOrder: 2,
        ruleName: '英字を大文字に統一',
        ruleLogic: (input: string) => {
          let result = '';
          for (let i = 0; i < input.length; i++) {
            const char = input[i];
            if (char >= 'ａ' && char <= 'ｚ') {
              result += String.fromCharCode(char.charCodeAt(0) - 0xFEE0);
            } else if (char >= 'a' && char <= 'z') {
              result += char.toUpperCase();
            } else {
              result += char;
            }
          }
          return result;
        },
      },
      {
        ruleId: 'rule_C',
        ruleOrder: 3,
        ruleName: 'ハイフンを削除',
        ruleLogic: (input: string) => input.replace(/-/g, ''),
      },
    ];

    const inputData = '田中　太郎ｔａｎａｋａ-123';

    const result = detectAndMergeCustomerDuplicates({
      inputValue: inputData,
      normalizationRules: normalizationRules,
    });

    expect(result.finalNormalizedValue).toBe('田中太郎TANAKA123');
    expect(result.intermediateStates).toEqual([
      {
        ruleOrder: 1,
        ruleName: '全角スペースを削除',
        valueAfterApplied: '田中太郎ｔａｎａｋａ-123',
      },
      {
        ruleOrder: 2,
        ruleName: '英字を大文字に統一',
        valueAfterApplied: '田中太郎TANAKA-123',
      },
      {
        ruleOrder: 3,
        ruleName: 'ハイフンを削除',
        valueAfterApplied: '田中太郎TANAKA123',
      },
    ]);
  });
});