import { visualizeReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1757: 根拠抽出日時が月末のとき根拠を正しく分類する', () => {
    // Arrange: 月末日時を固定
    const monthEndTimestamp = '2026-08-31T23:59:59Z';
    const dealId = 'DEAL-2026-08-31-001';
    const industry = '製造業';
    const proposalContent = '生産効率化ツール導入';
    const extractedDateBucket = '2026-08';
    const classificationDate = '2026-08-31';

    // スタブデータ: AIRecommendationEngineの推奨根拠
    const stubRecommendationEngine = {
      extractReasoningBasis: jest.fn().mockReturnValue({
        dealId: dealId,
        customerIndustry: industry,
        proposalContent: proposalContent,
        reasoningPatterns: ['過去成功事例#1', '過去成功事例#2'],
        extractionTimestamp: monthEndTimestamp,
      }),
    };

    // Act: 推奨根拠の可視化機能を実行
    const result = visualizeReasoning(
      {
        dealId: dealId,
        customerIndustry: industry,
        proposalContent: proposalContent,
        reasoningPatterns: ['過去成功事例#1', '過去成功事例#2'],
        extractionTimestamp: monthEndTimestamp,
      },
      stubRecommendationEngine
    );

    // Assert: reasoningReasons配列に正確に2件の根拠が含まれているか確認
    expect(result.reasoningReasons).toHaveLength(2);

    // 各根拠のpropertiesオブジェクトを検証
    expect(result.reasoningReasons[0]).toEqual(
      expect.objectContaining({
        pattern: '過去成功事例#1',
        properties: expect.objectContaining({
          classificationDate: classificationDate,
          classificationCategory: 'past_success_pattern',
          isMonthEndFlag: true,
        }),
      })
    );

    expect(result.reasoningReasons[1]).toEqual(
      expect.objectContaining({
        pattern: '過去成功事例#2',
        properties: expect.objectContaining({
          classificationDate: classificationDate,
          classificationCategory: 'past_success_pattern',
          isMonthEndFlag: true,
        }),
      })
    );

    // 根拠の時系列順序が保持されているか検証
    expect(result.reasoningReasons[0].pattern).toBe('過去成功事例#1');
    expect(result.reasoningReasons[1].pattern).toBe('過去成功事例#2');

    // UIレンダリング用の出力フォーマットを検証
    expect(result.visualizationData).toEqual(
      expect.objectContaining({
        monthEndAggregationFlag: true,
        extractedDateBucket: extractedDateBucket,
      })
    );
  });
});