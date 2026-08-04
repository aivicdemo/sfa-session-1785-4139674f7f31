import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-1685: 推奨の詳細説明テキストが空文字列のとき、エラーが発生する', () => {
    // Arrange
    const recommendationId = 'REC-001';
    const customerInfo = {
      customerId: 'CUST-123',
      industry: '製造業',
      scale: '中堅企業'
    };
    const dealConditions = {
      dealId: 'DEAL-456',
      stage: '提案準備段階',
      estimatedValue: 5000000
    };

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue('')
    };

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Act & Assert
    expect(() => {
      explainRecommendationReasoning(
        recommendationId,
        customerInfo,
        dealConditions,
        mockAIEngine
      );
    }).toThrow(/推奨の詳細説明/);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('ValidationError')
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('推奨の詳細説明が空です')
    );

    consoleErrorSpy.mockRestore();
  });
});