import { generateExecutivePersuasionMaterial } from '../../src/logic/it-1-br-3-1-1-1';

describe('経営層向け説得資料の自動生成機能', () => {
  // SCEN-2006
  test('投資対効果データに必須の期間情報が未設定のとき、資料生成がエラーになる', () => {
    const customerInfo = {
      customerName: 'テスト顧客A',
      industry: '製造業',
      challenge: 'コスト削減',
    };

    const proposalContent = {
      service: 'クラウド導入支援',
      amount: 5000000,
    };

    const investmentEffectData = {
      startDate: undefined,
      endDate: undefined,
      measurementPeriod: undefined,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        approach: '段階的導入',
        confidence: 85,
      }),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
    };

    expect(() =>
      generateExecutivePersuasionMaterial(
        customerInfo,
        proposalContent,
        investmentEffectData,
        mockAIEngine,
        mockFileStorage
      )
    ).toThrow(/期間情報/);
  });
});