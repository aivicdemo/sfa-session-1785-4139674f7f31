import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2386: 推論精度スコア算出機能 - 営業担当者の提案内容パターンデータが空配列のとき、エラーが発生する', () => {
    const emptyPatternData: any[] = [];
    const newCasesCondition = {
      customerId: 'CUST-20240115-001',
      industryType: 'manufacturing',
      companySize: 'large',
      challengePattern: 'cost_reduction',
    };

    expect(() => {
      evaluatePatternRelevance(emptyPatternData, newCasesCondition);
    }).toThrow(/営業担当者の提案内容パターンデータが空です/);

    try {
      evaluatePatternRelevance(emptyPatternData, newCasesCondition);
    } catch (error: any) {
      expect(error.name).toBe('ValidationError');
      expect(error.message).toContain('営業担当者の提案内容パターンデータが空です。1件以上のパターンを入力してください');
      expect(error.code).toBe('EMPTY_PATTERN_DATA');
      expect(error.statusCode).toBe(400);
    }
  });
});