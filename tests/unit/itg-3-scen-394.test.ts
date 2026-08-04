import { validateDealConditionsForRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-394
  test('[edge] 推論精度検証機能 - 推奨対象の商談条件データが欠落しているとき、該当レコードを検証対象から除外', () => {
    // テストデータセットアップ
    const dealRecordA = {
      id: 'deal-a',
      customerName: '太郎商事',
      industry: '製造',
      budget: '1000万円',
      decisionTimeline: '3ヶ月以内'
    };

    const dealRecordB = {
      id: 'deal-b',
      customerName: '花子物流',
      industry: null,
      budget: '500万円',
      decisionTimeline: '1ヶ月以内'
    };

    const dealRecordC = {
      id: 'deal-c',
      customerName: '次郎電器',
      industry: '流通',
      budget: null,
      decisionTimeline: '2ヶ月以内'
    };

    const dealRecords = [dealRecordA, dealRecordB, dealRecordC];

    // AIRecommendationEngineのスタブ化
    const findSimilarPatternsCalls: Array<{ recordId: string; record: typeof dealRecordA }> = [];

    const stubAIRecommendationEngine = {
      findSimilarPatterns: (record: typeof dealRecordA) => {
        findSimilarPatternsCalls.push({ recordId: record.id, record });
        return {
          similarPatterns: [],
          relevanceScore: 0
        };
      }
    };

    // 推論精度検証機能の実行
    const validationResult = validateDealConditionsForRecommendation(
      dealRecords,
      stubAIRecommendationEngine
    );

    // 期待結果の検証
    // (1) レコードAはすべての必須フィールドが存在するため検証対象に含まれる
    expect(validationResult.processedRecords).toContain('deal-a');
    expect(validationResult.excludedRecords).not.toContain('deal-a');

    // (2) レコードBは業種フィールドがnullのため検証対象から除外される
    expect(validationResult.excludedRecords).toContain('deal-b');
    expect(validationResult.excludedRecords).toContainEqual({
      recordId: 'deal-b',
      reason: 'industry'
    });

    // (3) レコードCは予算フィールドがnullのため検証対象から除外される
    expect(validationResult.excludedRecords).toContain('deal-c');
    expect(validationResult.excludedRecords).toContainEqual({
      recordId: 'deal-c',
      reason: 'budget'
    });

    // スタブ呼び出し記録の検証
    // レコードAに対するfindSimilarPatterns呼び出しのみが記録される
    expect(findSimilarPatternsCalls).toHaveLength(1);
    expect(findSimilarPatternsCalls[0].recordId).toBe('deal-a');
    expect(findSimilarPatternsCalls[0].record).toEqual(dealRecordA);

    // 検証結果の総件数
    expect(validationResult.totalRecords).toBe(3);
    expect(validationResult.processedRecordsCount).toBe(1);
    expect(validationResult.excludedRecordsCount).toBe(2);
  });
});