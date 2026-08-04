import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 経営層向け説得資料生成', () => {
  test('SCEN-1993: リスク要因情報が未設定（null）のとき、資料生成がエラーになる', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn()
    };

    const input_customer_info = {
      customer_name: '株式会社テスト商社',
      industry: '製造業',
      company_size: '中堅企業'
    };

    const input_proposal_content = {
      product_service_name: 'クラウドERP導入',
      expected_effect: '業務効率化により年間1000万円のコスト削減'
    };

    const input_risk_factors = null;

    expect(() => {
      generateRecommendation({
        customer_info: input_customer_info,
        proposal_content: input_proposal_content,
        risk_factors: input_risk_factors,
        ai_engine: mockAIRecommendationEngine
      });
    }).toThrow(/リスク要因/);
  });
});