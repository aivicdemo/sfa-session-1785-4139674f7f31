import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-239
  test('[error] 標準プロセス遵守度スコア計算機能 - スコア計算の分母がゼロになるときエラーになる', () => {
    const compliantItemsCount = 0;
    const totalItemsCount = 0;

    expect(() => {
      calculateProcessComplianceScore({
        compliantItemsCount,
        totalItemsCount,
      });
    }).toThrow(/分母がゼロ|ゼロで除算/);

    try {
      calculateProcessComplianceScore({
        compliantItemsCount,
        totalItemsCount,
      });
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error) {
        expect((error as Error & { code: string }).code).toBe(
          'DIVISION_BY_ZERO'
        );
      }
    }
  });
});