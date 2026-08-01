import { calculateSalesPersonActionPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-802: [edge] 営業担当者行動パターン分析機能 - 成約実績が1件のとき、その1件の成約結果から影響度を計算する
  test('成約実績が1件のとき、その1件の成約結果から影響度を計算し、各要因の影響度スコアと総合影響度を返す', () => {
    const contractResults = [
      {
        contractAmount: 1000000,
        salesCycleDays: 30,
        proposalDocumentsSentCount: 2,
        customerContactCount: 5,
      },
    ];

    const result = calculateSalesPersonActionPatternAnalysisReport({
      contractResults,
    });

    expect(result.salesCycleInfluenceScore).toBe(30);
    expect(result.proposalDocumentInfluenceScore).toBe(2);
    expect(result.customerContactInfluenceScore).toBe(5);
    expect(result.totalInfluenceScore).toBe(37);
  });
});