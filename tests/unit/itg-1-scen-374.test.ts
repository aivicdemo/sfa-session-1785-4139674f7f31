import { determineApplicableApproaches } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-374
  test('成功パターンマッチング・提案アプローチ判定機能 - 過去の成功商談パターンが0件のとき、適用可能なアプローチが特定されない', () => {
    const customer_id = 'CUST-001';
    const industry = '製造業';
    const company_size = '中規模';
    const past_success_patterns: any[] = [];

    const result = determineApplicableApproaches({
      customer_id,
      industry,
      company_size,
      past_success_patterns,
    });

    expect(result.applicable_approaches).toEqual([]);
    expect(result.status).toBe('NO_PATTERN_FOUND');
    expect(result.message).toBe(
      '適用可能なアプローチを特定できません。過去の成功商談パターンがありません'
    );
  });
});