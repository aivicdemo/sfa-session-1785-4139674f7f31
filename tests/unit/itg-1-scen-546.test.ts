import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fetchMock from 'jest-fetch-mock';
import { analyzeAndGenerateSalesPatternReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターン分析とレポート生成', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-546
  it('行動パターン分析結果データが欠落している場合、エラーになる', async () => {
    const sales_id = 'sales_001';
    const period_start = '2024-01-01';
    const period_end = '2024-01-31';

    fetchMock.mockResponseOnce(
      JSON.stringify({
        contact_count: 15,
        email_count: 8,
        phone_count: 7,
        conversion_rate: null,
        average_deal_value: 250000
      }),
      { status: 200 }
    );

    await expect(
      analyzeAndGenerateSalesPatternReport({
        sales_id,
        period_start,
        period_end
      })
    ).rejects.toThrow(/成約転換率/);
  });
});