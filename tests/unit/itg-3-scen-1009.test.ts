import { generateProposalMaterial } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1009
  test('提案資料生成処理の前提条件検証 - 商談内容が空文字列の場合、警告メッセージが表示される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerName = '株式会社サンプル';
    const dealType = 'newProduct';
    const dealContent = '';
    const industryType = 'manufacturing';
    const companyScale = 'large';

    const result = generateProposalMaterial(
      {
        customerName,
        dealType,
        dealContent,
        industryType,
        companyScale,
      },
      mockAIRecommendationEngine
    );

    expect(result.warningMessage).toBe('商談内容が入力されていません。商談内容を入力してから再度実行してください');
    expect(result.isProposalGenerated).toBe(false);
    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});