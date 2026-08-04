import { recordRecommendationHistory } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨履歴の記録機能', () => {
  // SCEN-256
  test('営業担当者のユーザーIDが null のとき、エラーがスローされる', () => {
    const recommendationHistoryRecord = {
      recommendation_id: 'REC-001',
      user_id: null,
      customer_id: 'CUST-001',
      deal_id: 'DEAL-001',
      recommendation_content: 'クラウドソリューション提案',
      recommendation_score: 92,
      created_at: new Date('2024-01-15T11:00:00Z'),
      status: 'EXECUTED',
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendation_id: 'REC-001',
        approach: 'DX推進支援提案',
        reasoning: '過去の類似案件で85%の成功率',
        confidence_score: 92,
      }),
    };

    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn(),
    };

    expect(() =>
      recordRecommendationHistory(
        recommendationHistoryRecord,
        aiRecommendationEngineStub,
        fileStorageAdapterStub
      )
    ).toThrow(/ユーザーID/);

    expect(fileStorageAdapterStub.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});