import { describe, test, expect, beforeEach } from '@jest/globals';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1683: [error] 推奨内容表示機能 - 推奨内容が空オブジェクトのとき、エラーが発生する
  test('推奨内容が空オブジェクトのとき、ValidationErrorまたはInvalidRecommendationErrorが発生すること', () => {
    // import の準備
    const recommendationLogic = require('../../src/logic/it-1-br-3-2-1-1');
    
    // テスト入力データ：有効な顧客情報と商談条件
    const valid_customer_info = {
      customer_id: 'CUST-12345',
      company_name: '株式会社テスト',
      industry: 'IT',
      company_size: 'large',
      employee_count: 500
    };

    const valid_deal_conditions = {
      deal_id: 'DEAL-67890',
      deal_stage: 'initial_contact',
      customer_id: 'CUST-12345',
      product_category: 'cloud_solution',
      estimated_budget: 5000000,
      decision_timeline_days: 90
    };

    // 空オブジェクトの推奨内容
    const empty_recommendation = {};

    // 推奨内容表示機能を呼び出し、エラーが発生することを検証
    expect(() => {
      recommendationLogic.validateAndDisplayRecommendation(
        valid_customer_info,
        valid_deal_conditions,
        empty_recommendation
      );
    }).toThrow(/ValidationError|InvalidRecommendationError|推奨内容/);
  });
});