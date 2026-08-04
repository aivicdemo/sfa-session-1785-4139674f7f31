import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2555: 推奨根拠リストに重複データを含むとき、重複が排除される', () => {
    // Arrange: 重複を含む推奨根拠データをモック化
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue([
        { reasonId: 'R001', text: '顧客業界が製造業' },
        { reasonId: 'R002', text: '過去成功事例との類似度85%' },
        { reasonId: 'R001', text: '顧客業界が製造業' },
        { reasonId: 'R003', text: '提案金額が予算範囲内' },
        { reasonId: 'R002', text: '過去成功事例との類似度85%' }
      ])
    };

    const recommendationId = 'rec-12345';
    const customerId = 'cust-67890';

    // Act: 推奨根拠の可視化機能を呼び出す
    const result = visualizeRecommendationReasoning(
      recommendationId,
      customerId,
      mockAIRecommendationEngine
    );

    // Assert: 重複が排除され、3件のみ表示されることを確認
    expect(result.reasoningList.length).toBe(3);

    // Assert: 各根拠要素の reasonId と text の組み合わせが一意であることを確認
    const uniqueReasons = new Map<string, string>();
    result.reasoningList.forEach((reason) => {
      const key = `${reason.reasonId}:${reason.text}`;
      expect(uniqueReasons.has(key)).toBe(false);
      uniqueReasons.set(key, reason.text);
    });

    // Assert: 期待される根拠が正確に含まれていることを確認
    expect(result.reasoningList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          reasonId: 'R001',
          text: '顧客業界が製造業'
        }),
        expect.objectContaining({
          reasonId: 'R002',
          text: '過去成功事例との類似度85%'
        }),
        expect.objectContaining({
          reasonId: 'R003',
          text: '提案金額が予算範囲内'
        })
      ])
    );

    // Assert: 結果に displayCount フィールドが正しく設定されていることを確認
    expect(result.displayCount).toBe(3);
  });
});