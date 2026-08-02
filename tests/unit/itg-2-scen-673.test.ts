import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { visualizeRecommendationBasis } from '../../src/logic/it-1-br-2-2-1-1';

const fetchMock = require('jest-fetch-mock');

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-673
  test('推奨内容根拠の可視化機能 - 同じ入力で2回実行したとき、2回目も同じ結果が返される', async () => {
    const customer_id = 'CUST-001';
    const sales_forecast_amount = 500000;
    const risk_rating = '高';

    const mock_ai_response = {
      reason_text: '過去3ヶ月の成約率が80%',
      confidence_score: 0.85,
      recommended_action: '営業接触を優先実施'
    };

    fetchMock.mockResponseOnce(JSON.stringify(mock_ai_response), { status: 200 });
    fetchMock.mockResponseOnce(JSON.stringify(mock_ai_response), { status: 200 });

    const input_data = {
      customer_id: customer_id,
      sales_forecast_amount: sales_forecast_amount,
      risk_rating: risk_rating
    };

    const response_1 = await visualizeRecommendationBasis(input_data);

    const response_2 = await visualizeRecommendationBasis(input_data);

    expect(response_1.recommended_action).toBe('営業接触を優先実施');
    expect(response_1.reason_text).toBe('過去3ヶ月の成約率が80%');
    expect(response_1.confidence_score).toBe(0.85);

    expect(response_2.recommended_action).toBe('営業接触を優先実施');
    expect(response_2.reason_text).toBe('過去3ヶ月の成約率が80%');
    expect(response_2.confidence_score).toBe(0.85);

    expect(response_1).toEqual(response_2);
  });
});