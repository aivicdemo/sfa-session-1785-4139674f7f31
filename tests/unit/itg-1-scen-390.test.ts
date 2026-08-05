import { determineSuccessPatternApplicability } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-390: 成功パターンマトリクス適用判定機能 - 顧客IDが空文字列のとき処理が中断される', () => {
    // Arrange
    const input = {
      customer_id: '',
      sales_stage: 'proposal',
      product_category: 'enterprise',
      customer_attributes: {
        company_size: 'large',
        industry: 'finance'
      }
    };

    // Act & Assert
    expect(() => determineSuccessPatternApplicability(input)).toThrow(/顧客ID/);
  });
});