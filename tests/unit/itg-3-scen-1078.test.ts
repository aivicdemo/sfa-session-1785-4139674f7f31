import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチの生成と返却', () => {
  test('SCEN-1078: 推奨対象の提案アプローチが提案アプローチテーブルに登録される', async () => {
    // ===== セットアップ =====
    const recommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproachId: 'PA-20240115-001',
        proposalContent: '顧客の経営課題に対応した提案',
        confidenceScore: 87,
      }),
    };

    const targetDealData = {
      customerId: 'CUST-2024-0001',
      dealId: 'DEAL-2024-0115-001',
      customerIndustry: 'manufacturing',
      budgetRange: 'high',
      dealConditions: {
        targetProductCategory: 'software_solution',
        estimatedContractValue: 5000000,
        implementationTimeline: 'Q2_2024',
      },
    };

    const beforeRecordCount = 0;

    // ===== 実행 =====
    const result = await generateRecommendation(targetDealData, recommendationEngineStub);

    // ===== 検証 =====
    // 1. AIRecommendationEngine.generateRecommendation()が呼び出されたことを確認
    expect(recommendationEngineStub.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'CUST-2024-0001',
        dealId: 'DEAL-2024-0115-001',
      })
    );

    // 2. レスポンスのステータスが成功であることを確認
    expect(result).toBeDefined();
    expect(result.status).toBe('success');

    // 3. 提案アプローチテーブルに新規レコードが登録されたことを確認（レコード数の増加）
    expect(result.recordCount).toBe(beforeRecordCount + 1);

    // 4. 新規登録されたレコードの検証
    const registeredRecord = result.proposalApproach;

    // 4.1 提案アプローチID
    expect(registeredRecord.proposalApproachId).toBe('PA-20240115-001');

    // 4.2 提案内容
    expect(registeredRecord.proposalContent).toBe('顧客の経営課題に対応した提案');

    // 4.3 根拠スコア
    expect(registeredRecord.confidenceScore).toBe(87);

    // 4.4 案件ID
    expect(registeredRecord.dealId).toBe('DEAL-2024-0115-001');

    // 4.5 ステータス
    expect(registeredRecord.status).toBe('active');

    // 4.6 作成タイムスタンプ（現在時刻の±5秒以内）
    const createdAt = new Date(registeredRecord.createdAt);
    const now = new Date('2024-01-15T12:00:00Z');
    const diffInSeconds = Math.abs((createdAt.getTime() - now.getTime()) / 1000);
    expect(diffInSeconds).toBeLessThanOrEqual(5);
  });
});