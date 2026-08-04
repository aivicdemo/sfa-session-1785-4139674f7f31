import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談の類似案件検索機能', () => {
  // SCEN-2492
  test('現在の商談条件に類似した過去成功事例が複数件検索され、類似度の高い順にランク付けされる', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          caseId: 'CASE_001',
          similarityScore: 0.95,
          contractAmount: 6000000,
          dealDurationDays: 45,
          industry: '製造業',
          budgetScale: 5000000,
          challenge: 'デジタル化推進',
          decisionMakerCount: 3,
        },
        {
          caseId: 'CASE_002',
          similarityScore: 0.78,
          contractAmount: 4500000,
          dealDurationDays: 60,
          industry: '製造業',
          budgetScale: 5000000,
          challenge: 'デジタル化推進',
          decisionMakerCount: 3,
        },
        {
          caseId: 'CASE_003',
          similarityScore: 0.62,
          contractAmount: 4000000,
          dealDurationDays: 30,
          industry: '製造業',
          budgetScale: 5000000,
          challenge: 'デジタル化推進',
          decisionMakerCount: 3,
        },
      ]),
    };

    const currentDealCondition = {
      industry: '製造業',
      budgetScale: 5000000,
      challenge: 'デジタル化推進',
      decisionMakerCount: 3,
    };

    const result = await findSimilarPatterns(currentDealCondition, mockAIEngine);

    expect(result).toHaveLength(3);
    expect(result[0].caseId).toBe('CASE_001');
    expect(result[0].similarityScore).toBe(0.95);
    expect(result[0].contractAmount).toBe(6000000);
    expect(result[0].dealDurationDays).toBe(45);

    expect(result[1].caseId).toBe('CASE_002');
    expect(result[1].similarityScore).toBe(0.78);
    expect(result[1].contractAmount).toBe(4500000);
    expect(result[1].dealDurationDays).toBe(60);

    expect(result[2].caseId).toBe('CASE_003');
    expect(result[2].similarityScore).toBe(0.62);
    expect(result[2].contractAmount).toBe(4000000);
    expect(result[2].dealDurationDays).toBe(30);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(currentDealCondition);
    expect(result[0].similarityScore).toBeGreaterThan(result[1].similarityScore);
    expect(result[1].similarityScore).toBeGreaterThan(result[2].similarityScore);
  });
});