import { analyzeAndGenerateSalesReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-445
  test('提案内容と顧客対応記録が両方空の状態では分析が実行されない', async () => {
    const salesRepId = 'SR-001';
    const proposalContent = '';
    const customerResponseRecord = '';

    const result = await analyzeAndGenerateSalesReport({
      salesRepId,
      proposalContent,
      customerResponseRecord,
    });

    expect(result.statusCode).toBe(400);
    expect(result.errorMessage).toMatch(/提案内容と顧客対応記録の両方が必須です/);
    expect(result.analysisResultCreated).toBe(false);
  });
});