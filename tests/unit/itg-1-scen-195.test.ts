import { analyzeSellerBehaviorPatternAndDetermineCounselingTarget } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者行動パターン分析・改善指導対象判定機能', () => {
  // SCEN-195
  test('改善指導内容が1種類の場合、その指導が単一で提示される', () => {
    const analysisStartDate = new Date('2024-01-01T00:00:00Z');
    const analysisEndDate = new Date('2024-03-31T23:59:59Z');
    const sellerName = '営業太郎';
    const sellerId = 'seller_001';

    const behaviorPatternAnalysisData = {
      sellerId,
      sellerName,
      analysisStartDate,
      analysisEndDate,
      proposalDocumentUnreadyRate: 0.75,
      proposalDocumentReadyRateThreshold: 0.60,
      followUpIntervalAverageDays: 15,
      followUpIntervalThresholdDays: 7,
      customerTouchFrequencyAverage: 2.5,
      customerTouchFrequencyThreshold: 4.0,
      conversionRate: 0.12,
    };

    const counselingTargetJudgmentResult = {
      judgmentDateTime: new Date('2024-04-01T09:00:00Z'),
      counselingRequired: true,
      counselingContentList: [
        {
          counselingContentId: 'content_001',
          counselingContentName: '提案資料未作成率が基準超過',
          counselingDescription: '提案資料作成率を向上させてください',
          priority: 1,
          detectedMetricName: 'proposalDocumentUnreadyRate',
          detectedMetricValue: 0.75,
          thresholdValue: 0.60,
        },
      ],
    };

    const result = analyzeSellerBehaviorPatternAndDetermineCounselingTarget(
      behaviorPatternAnalysisData,
      counselingTargetJudgmentResult
    );

    expect(result.counselingContentList).toHaveLength(1);
    expect(result.counselingContentList[0].counselingContentName).toBe(
      '提案資料未作成率が基準超過'
    );
    expect(result.counselingContentList[0].counselingDescription).toBe(
      '提案資料作成率を向上させてください'
    );
    expect(result.displayFormat).toBe('single');
    expect(result.displayMessage).toBe('提案資料作成率を向上させてください');
  });
});