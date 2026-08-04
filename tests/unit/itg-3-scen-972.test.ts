import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-972
  test('成功パターンマスタが0件のとき、根拠表示処理は進行するが根拠なし判定が返される', async () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        hasReasoning: false,
        reasoningText: '',
        statusCode: 200,
        errorCode: null,
      }),
    };

    const emptyPatternMaster: Array<{
      patternId: string;
      customerAttribute: string;
      dealCondition: string;
      successFactor: string;
    }> = [];

    const inputData = {
      recommendationId: 'REC-2024-001',
      customerId: 'CUST-5001',
      customerIndustry: 'Manufacturing',
      customerScale: 'Large',
      dealStage: 'Proposal',
      proposalContent: 'Enterprise Cloud Solution',
    };

    const result = await explainRecommendationReasoning(
      inputData,
      mockAIRecommendationEngine,
      emptyPatternMaster
    );

    expect(result.hasReasoning).toBe(false);
    expect(result.reasoningText).toBe('');
    expect(result.statusCode).toBe(200);
    expect(result.errorCode).toBeNull();
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      inputData
    );
  });
});