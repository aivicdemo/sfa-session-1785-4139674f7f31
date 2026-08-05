import { evaluateSuccessPatternMatrixApplicability } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-392: 顧客の業種分類が成功パターンの業種分類と完全に不一致のとき適用除外となる', () => {
    // Arrange
    const customer = {
      customer_id: 'CUST-001',
      customer_name: 'テスト製造会社',
      industry_classification: '製造業',
      created_at: new Date('2024-01-15T10:00:00Z'),
    };

    const success_pattern_matrix = [
      {
        pattern_id: 'PATTERN-001',
        industry_classification: '小売業',
        business_stage: 'proposal',
        success_rate: 0.75,
        sample_size: 40,
      },
      {
        pattern_id: 'PATTERN-002',
        industry_classification: '卸売業',
        business_stage: 'negotiation',
        success_rate: 0.82,
        sample_size: 50,
      },
      {
        pattern_id: 'PATTERN-003',
        industry_classification: 'サービス業',
        business_stage: 'initial_contact',
        success_rate: 0.68,
        sample_size: 35,
      },
    ];

    // Act
    const result = evaluateSuccessPatternMatrixApplicability(
      customer,
      success_pattern_matrix
    );

    // Assert
    expect(result.applicable_patterns).toEqual([]);
    expect(result.status_code).toBe('INDUSTRY_MISMATCH');
    expect(result.match_count).toBe(0);
    expect(result.total_patterns_evaluated).toBe(3);
  });
});