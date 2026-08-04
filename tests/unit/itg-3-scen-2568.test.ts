import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2568
  test('推奨内容に同じ根拠が複数紐付いているとき、重複が排除される', async () => {
    // Arrange: AIRecommendationEngineのスタブを定義
    const duplicateReason = {
      reasonId: 'REASON-001',
      content: '顧客業界が製造業で過去成功率85%',
      confidenceScore: 85,
    };

    const reasonsWithDuplicates = [
      duplicateReason,
      {
        reasonId: 'REASON-002',
        content: '顧客規模が大企業で導入実績多数',
        confidenceScore: 78,
      },
      duplicateReason, // 重複
      {
        reasonId: 'REASON-003',
        content: '提案タイミングが最適期に該当',
        confidenceScore: 92,
      },
      duplicateReason, // 重複
    ];

    const mockRecommendationEngine = {
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue(reasonsWithDuplicates),
    };

    // Act: 根拠を表示する関数を呼び出し
    const dealCondition = {
      customerIndustry: '製造業',
      dealAmount: 5000000,
      dealStage: 'proposal',
    };

    const result = await explainRecommendationReasoning(
      dealCondition,
      mockRecommendationEngine
    );

    // Assert: 重複が排除されていることを検証
    expect(result.reasonsArray).toHaveLength(3);
    expect(result.reasonsArray[0].reasonId).toBe('REASON-001');
    expect(result.reasonsArray[1].reasonId).toBe('REASON-002');
    expect(result.reasonsArray[2].reasonId).toBe('REASON-003');

    // 重複が排除されていることを確認（REASON-001が1件だけ存在）
    const reason001Count = result.reasonsArray.filter(
      (r) => r.reasonId === 'REASON-001'
    ).length;
    expect(reason001Count).toBe(1);

    // 最終的な根拠配列の長さが重複排除前より減少していることを検証
    expect(result.reasonsArray.length).toBeLessThan(reasonsWithDuplicates.length);
    expect(result.reasonsArray.length).toBe(3);
  });
});