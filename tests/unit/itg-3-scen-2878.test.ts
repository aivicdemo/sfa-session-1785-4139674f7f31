import { validateRecommendationContent } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容検証判定機能', () => {
  test('SCEN-2878: 顧客・商談条件の照合結果がnullのとき、エラーを返す', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(null),
    };

    const input = {
      customerId: 'CUST-001',
      dealId: 'DEAL-001',
      customerIndustry: '製造業',
      budget: '500万円',
    };

    const result = await validateRecommendationContent(input, mockAIEngine);

    expect(result.statusCode).toBe(400);
    expect(result.body.errorCode).toBe('VALIDATION_ERROR');
    expect(result.body.message).toBe(
      '顧客・商談条件の照合に失敗しました。システム管理者にお問い合わせください'
    );
    expect(result.body.details).toEqual(
      expect.objectContaining({
        detectedNullFields: expect.arrayContaining(['matchingPatterns']),
      })
    );
  });
});