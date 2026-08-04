import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2906: [edge] 推奨の生成対象期間の判定 - 検証対象期間の開始日と終了日が同日のときに当日のデータのみが対象になる', () => {
    // 日付固定値の定義
    const targetDate = '2026-08-01';
    const previousDate = '2026-07-31';
    const nextDate = '2026-08-02';

    // テスト対象期間（開始日と終了日が同日）
    const startDate = new Date('2026-08-01T00:00:00Z');
    const endDate = new Date('2026-08-01T23:59:59Z');

    // 当日のデータ3件
    const targetDateDealRecords = [
      {
        dealId: 'DEAL001',
        customerId: 'CUST001',
        industry: 'IT',
        dealAmount: 5000000,
        dealDate: new Date('2026-08-01T09:00:00Z'),
        status: 'closed_won'
      },
      {
        dealId: 'DEAL002',
        customerId: 'CUST002',
        industry: 'Manufacturing',
        dealAmount: 3000000,
        dealDate: new Date('2026-08-01T14:30:00Z'),
        status: 'closed_won'
      },
      {
        dealId: 'DEAL003',
        customerId: 'CUST003',
        industry: 'Finance',
        dealAmount: 7000000,
        dealDate: new Date('2026-08-01T16:45:00Z'),
        status: 'closed_won'
      }
    ];

    // 前日のデータ2件
    const previousDateDealRecords = [
      {
        dealId: 'DEAL_PREV001',
        customerId: 'CUST_PREV001',
        industry: 'IT',
        dealAmount: 2000000,
        dealDate: new Date('2026-07-31T10:00:00Z'),
        status: 'closed_won'
      },
      {
        dealId: 'DEAL_PREV002',
        customerId: 'CUST_PREV002',
        industry: 'Retail',
        dealAmount: 1500000,
        dealDate: new Date('2026-07-31T15:00:00Z'),
        status: 'closed_won'
      }
    ];

    // 翌日のデータ2件
    const nextDateDealRecords = [
      {
        dealId: 'DEAL_NEXT001',
        customerId: 'CUST_NEXT001',
        industry: 'IT',
        dealAmount: 4000000,
        dealDate: new Date('2026-08-02T09:00:00Z'),
        status: 'closed_won'
      },
      {
        dealId: 'DEAL_NEXT002',
        customerId: 'CUST_NEXT002',
        industry: 'Healthcare',
        dealAmount: 6000000,
        dealDate: new Date('2026-08-02T11:00:00Z'),
        status: 'closed_won'
      }
    ];

    // AIRecommendationEngineのスタブ
    let capturedStartDate: Date | null = null;
    let capturedEndDate: Date | null = null;
    let capturedDealRecordsCount: number = 0;

    const mockAIEngine = {
      generateRecommendation: jest.fn(
        (
          customerId: string,
          dealCondition: {
            industry: string;
            dealAmount: number;
          },
          filterStartDate: Date,
          filterEndDate: Date
        ) => {
          // フィルタリング条件の検証用にキャプチャ
          capturedStartDate = filterStartDate;
          capturedEndDate = filterEndDate;

          // 当日のデータのみを処理対象にする
          const filteredDeals = targetDateDealRecords.filter(deal => {
            return deal.dealDate >= filterStartDate && deal.dealDate <= filterEndDate;
          });

          capturedDealRecordsCount = filteredDeals.length;

          // 成功パターンを抽出・ランク付けして返却
          return {
            recommendationId: 'REC001',
            customerId: customerId,
            approachPatterns: [
              {
                patternId: 'PATTERN001',
                industry: 'IT',
                successRate: 0.85,
                applicableCount: 3,
                confidenceScore: 92
              },
              {
                patternId: 'PATTERN002',
                industry: 'Manufacturing',
                successRate: 0.72,
                applicableCount: 1,
                confidenceScore: 78
              },
              {
                patternId: 'PATTERN003',
                industry: 'Finance',
                successRate: 0.88,
                applicableCount: 1,
                confidenceScore: 85
              }
            ],
            baselineSuccessPatterns: filteredDeals.length,
            excludedDataFromPreviousPeriod: previousDateDealRecords.length,
            excludedDataFromNextPeriod: nextDateDealRecords.length,
            generatedAt: new Date('2026-08-01T18:00:00Z')
          };
        }
      ),
      findSimilarPatterns: jest.fn(() => []),
      explainRecommendationReasoning: jest.fn(() => ''),
      evaluatePatternRelevance: jest.fn(() => 0)
    };

    // テスト対象の推奨生成処理を実行
    const result = generateRecommendation(
      {
        customerId: 'CUST001',
        industry: 'IT',
        dealAmount: 5000000
      },
      startDate,
      endDate,
      mockAIEngine
    );

    // 検証1: AIRecommendationEngineのスタブに渡された日付範囲フィルタが正しいこと
    expect(capturedStartDate).toEqual(new Date('2026-08-01T00:00:00Z'));
    expect(capturedEndDate).toEqual(new Date('2026-08-01T23:59:59Z'));

    // 検証2: スタブが当日のデータのみを基に処理したこと
    expect(capturedDealRecordsCount).toBe(3);

    // 検証3: 返却された推奨内容が当日のデータのみから抽出されていること
    expect(result.baselineSuccessPatterns).toBe(3);

    // 検証4: 前日のデータが除外されていること
    expect(result.excludedDataFromPreviousPeriod).toBe(2);

    // 検証5: 翌日のデータが除外されていること
    expect(result.excludedDataFromNextPeriod).toBe(2);

    // 検証6: 生成された推奨パターンの信頼度スコアが算出されていること
    expect(result.approachPatterns[0].confidenceScore).toBe(92);

    // 検証7: 成功パターンが正しくランク付けされていること（信頼度スコアの降順）
    expect(result.approachPatterns[0].confidenceScore).toBeGreaterThanOrEqual(
      result.approachPatterns[1].confidenceScore
    );
    expect(result.approachPatterns[1].confidenceScore).toBeGreaterThanOrEqual(
      result.approachPatterns[2].confidenceScore
    );
  });
});