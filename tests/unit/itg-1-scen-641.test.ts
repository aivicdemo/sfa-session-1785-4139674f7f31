import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-641
  test('行動パターン分析結果が過去3ヶ月分0件の場合、提案精度が計算不可となる', async () => {
    fetchMock.resetMocks();

    const sales_person_id = 'SP-00001';
    const target_date = '2024-01-15';

    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: [],
        count: 0,
      }),
      { status: 200 }
    );

    const result = await generateBehaviorPatternAnalysisReport({
      sales_person_id: sales_person_id,
      target_date: target_date,
    });

    expect(result.status).toBe('ERROR');
    expect(result.error_code).toBe('INSUFFICIENT_DATA');
    expect(result.proposal_accuracy).toBeNull();
    expect(result.error_message).toBe('過去3ヶ月分のデータが不足しているため提案精度を計算できません');
  });
});