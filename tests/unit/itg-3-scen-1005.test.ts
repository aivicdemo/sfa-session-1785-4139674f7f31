import { generateProposalDocument } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1005: 提案資料生成処理の前提条件検証 - 顧客情報と商談内容が入力済みの場合、生成処理が開始される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalOutline: '提案資料のアウトライン',
        recommendations: ['推奨1', '推奨2'],
        confidenceScore: 85,
      }),
    };

    const customer_input = {
      customer_name: 'ABC株式会社',
      industry: '製造業',
      employee_count: '500名',
      location: '東京都',
    };

    const deal_input = {
      deal_title: '業務効率化システム導入検討',
      issue: '現在の手作業プロセスに年間500時間を費やしている',
      desired_implementation_period: '2026年Q2',
    };

    const result = generateProposalDocument(
      customer_input,
      deal_input,
      mockAIRecommendationEngine
    );

    expect(result.status).toBe('生成中...');
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith({
      customer_name: 'ABC株式会社',
      industry: '製造業',
      employee_count: '500名',
      location: '東京都',
      deal_title: '業務効率化システム導入検討',
      issue: '現在の手作業プロセスに年間500時間を費やしている',
      desired_implementation_period: '2026年Q2',
    });
  });
});