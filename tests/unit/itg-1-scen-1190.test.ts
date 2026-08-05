import { analyzeCorrelationWithContractResults } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1190
  test('分析期間の開始日が null のとき処理がエラーになる', () => {
    const analysisParams = {
      start_date: null,
      end_date: new Date('2024-12-31'),
      product_id: 'PROD_001',
      sales_person_id: 'SP_001',
    };

    expect(() => analyzeCorrelationWithContractResults(analysisParams)).toThrow(
      /分析期間の開始日/
    );
  });
});