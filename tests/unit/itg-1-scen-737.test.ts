import { calculateSalesStaffComplianceUnderstandingScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-737
  test('成功パターン適用ガイドラインの周知完了判定機能 - 営業担当者の理解度スコアが数値型として正しく計算される', () => {
    // テストデータ: 営業担当者A、B、Cの研修資料理解度評価データ
    const salesStaffA = {
      successPatternRecognition: 85,
      customerAnalysisApplication: 90,
      proposalMaterialCreation: 78,
      objectionHandling: 88,
      closingJudgment: 82,
    };

    const salesStaffB = {
      successPatternRecognition: 92,
      customerAnalysisApplication: 88,
      proposalMaterialCreation: 95,
      objectionHandling: 80,
      closingJudgment: 91,
    };

    const salesStaffC = {
      successPatternRecognition: 75,
      customerAnalysisApplication: 70,
      proposalMaterialCreation: 68,
      objectionHandling: 72,
      closingJudgment: 76,
    };

    // 営業担当者Aの理解度スコア計算
    // (85 + 90 + 78 + 88 + 82) / 5 = 423 / 5 = 84.6
    const resultA = calculateSalesStaffComplianceUnderstandingScore(salesStaffA);

    // 計算結果の型がnumber型であることを検証
    expect(typeof resultA).toBe('number');

    // 計算結果の値が期待値(84.6)であることを検証
    expect(resultA).toBe(84.6);

    // 営業担当者Bの理解度スコア計算
    // (92 + 88 + 95 + 80 + 91) / 5 = 446 / 5 = 89.2
    const resultB = calculateSalesStaffComplianceUnderstandingScore(salesStaffB);

    // 計算結果の型がnumber型であることを検証
    expect(typeof resultB).toBe('number');

    // 計算結果の値が期待値(89.2)であることを検証
    expect(resultB).toBe(89.2);

    // 営業担当者Cの理解度スコア計算
    // (75 + 70 + 68 + 72 + 76) / 5 = 361 / 5 = 72.2
    const resultC = calculateSalesStaffComplianceUnderstandingScore(salesStaffC);

    // 計算結果の型がnumber型であることを検証
    expect(typeof resultC).toBe('number');

    // 計算結果の値が期待値(72.2)であることを検証
    expect(resultC).toBe(72.2);

    // エッジケース: スコアが0を含むデータ
    const edgeCaseZero = {
      successPatternRecognition: 0,
      customerAnalysisApplication: 100,
      proposalMaterialCreation: 100,
      objectionHandling: 100,
      closingJudgment: 100,
    };

    // (0 + 100 + 100 + 100 + 100) / 5 = 400 / 5 = 80
    const resultZero = calculateSalesStaffComplianceUnderstandingScore(edgeCaseZero);

    expect(typeof resultZero).toBe('number');
    expect(resultZero).toBe(80);

    // エッジケース: スコアが100を含むデータ
    const edgeCaseHundred = {
      successPatternRecognition: 100,
      customerAnalysisApplication: 100,
      proposalMaterialCreation: 100,
      objectionHandling: 100,
      closingJudgment: 100,
    };

    // (100 + 100 + 100 + 100 + 100) / 5 = 500 / 5 = 100
    const resultHundred = calculateSalesStaffComplianceUnderstandingScore(edgeCaseHundred);

    expect(typeof resultHundred).toBe('number');
    expect(resultHundred).toBe(100);

    // エッジケース: 小数を含むデータ
    const edgeCaseDecimal = {
      successPatternRecognition: 85.5,
      customerAnalysisApplication: 90.3,
      proposalMaterialCreation: 78.7,
      objectionHandling: 88.2,
      closingJudgment: 82.9,
    };

    // (85.5 + 90.3 + 78.7 + 88.2 + 82.9) / 5 = 425.6 / 5 = 85.12
    const resultDecimal = calculateSalesStaffComplianceUnderstandingScore(edgeCaseDecimal);

    expect(typeof resultDecimal).toBe('number');
    expect(resultDecimal).toBe(85.12);
  });
});