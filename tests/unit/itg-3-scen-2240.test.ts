import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2240
  test('推奨根拠可視化機能 - 成功パターンマッチング度が数値で可視化される', () => {
    const customerInfo = {
      industry: 'IT',
      companyScale: '中堅',
      challenge: 'DX推進',
    };

    const dealCondition = {
      budget: 5000000,
      implementationPeriodDays: 90,
    };

    const successPatterns = [
      {
        id: 'pattern-001',
        industry: 'IT',
        companyScale: '中堅',
        challenge: 'DX推進',
        budgetRange: { min: 3000000, max: 7000000 },
        implementationPeriodRange: { min: 60, max: 180 },
        adoptionRate: 0.92,
      },
      {
        id: 'pattern-002',
        industry: 'IT',
        companyScale: '大企業',
        challenge: 'システム統合',
        budgetRange: { min: 10000000, max: 50000000 },
        implementationPeriodRange: { min: 120, max: 365 },
        adoptionRate: 0.88,
      },
    ];

    const matchingScore = evaluatePatternRelevance(
      customerInfo,
      dealCondition,
      successPatterns
    );

    expect(matchingScore).toBe(85.5);
    expect(typeof matchingScore).toBe('number');
    expect(matchingScore).toBeGreaterThanOrEqual(0);
    expect(matchingScore).toBeLessThanOrEqual(100);

    const formattedScore = parseFloat(matchingScore.toFixed(1));
    expect(formattedScore).toBe(85.5);

    const percentageDisplay = `${matchingScore.toFixed(1)}%`;
    expect(percentageDisplay).toBe('85.5%');
  });
});