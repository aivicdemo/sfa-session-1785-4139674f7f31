import { generateSalesRepActionPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1113
  test('成約実績データが存在しないとき、処理がエラーになること', async () => {
    const sales_rep_id = 'EMP001';
    const analysis_period_start = new Date('2024-01-01T00:00:00Z');
    const analysis_period_end = new Date('2024-01-31T23:59:59Z');
    
    const error = await new Promise<Error>((resolve) => {
      generateSalesRepActionPatternReport(
        sales_rep_id,
        analysis_period_start,
        analysis_period_end
      ).catch((err) => {
        resolve(err);
      });
    });

    expect(error).toBeDefined();
    expect(error.message).toMatch(/成約実績データが存在しません/);
    expect((error as any).code).toBe('ERR_NO_SALES_DATA');
    expect((error as any).statusCode).toBe(400);
  });
});