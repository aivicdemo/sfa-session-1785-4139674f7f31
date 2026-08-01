import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-611: 過去3ヶ月間の営業担当者0名の場合、チーム平均値が計算不可となる', async () => {
    const request = {
      analysisPeriodDays: 90,
      aggregationUnit: 'team_average',
      salesRepCount: 0,
      salesRepRecords: []
    };

    let errorResponse: any = null;
    let statusCode: number | null = null;

    try {
      await generateSalesRepBehaviorAnalysisReport(request);
    } catch (error: any) {
      errorResponse = error;
      statusCode = error.statusCode || 400;
    }

    expect(statusCode).toBe(400);
    expect(errorResponse).toBeDefined();
    expect(errorResponse.errorCode).toBe('INSUFFICIENT_DATA_ERROR');
    expect(errorResponse.message).toMatch(/チーム平均値を計算するために必要な営業担当者データが不足しています/);
    expect(errorResponse.message).toMatch(/必要最小数: 1名以上/);
    expect(errorResponse.message).toMatch(/現在: 0名/);
    expect(errorResponse.teamAverageResult).toBeUndefined();
  });
});