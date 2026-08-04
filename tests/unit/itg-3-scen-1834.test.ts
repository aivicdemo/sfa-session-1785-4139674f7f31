import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1834: 営業担当者IDが null のとき根拠情報取得に失敗する', () => {
    const mock_engine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        status: 400,
        code: 'INVALID_REQUEST',
        message: 'salesPersonId is required',
        data: null,
      }),
    };

    const recommendationId = 'REC-20250801-001';
    const salesPersonId = null;

    return explainRecommendationReasoning(
      mock_engine,
      salesPersonId,
      recommendationId
    ).then((result) => {
      expect(result.status).toBe(400);
      expect(result.message).toMatch(/salesPersonId is required/);
      expect(result.data).toBeNull();
    });
  });
});