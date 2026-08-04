import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('similar patterns search idempotency', () => {
  test('SCEN-1823: search results return in same order across multiple executions', () => {
    // Arrange
    const mockPatternList = [
      {
        id: 'pattern-001',
        customerIndustry: '製造業',
        dealAmount: 5000000,
        decisionMaker: '経営層',
        timeline: '3ヶ月以内',
        score: 95,
        rank: 1
      },
      {
        id: 'pattern-003',
        customerIndustry: '製造業',
        dealAmount: 4800000,
        decisionMaker: '経営層',
        timeline: '2ヶ月以内',
        score: 87,
        rank: 2
      },
      {
        id: 'pattern-005',
        customerIndustry: '製造業',
        dealAmount: 5200000,
        decisionMaker: '経営層',
        timeline: '4ヶ月以内',
        score: 78,
        rank: 3
      }
    ];

    const stubEngine = {
      findSimilarPatterns: jest.fn(() => mockPatternList)
    };

    const dealCondition = {
      customerIndustry: '製造業',
      dealAmount: 5000000,
      decisionMaker: '経営層',
      timeline: '3ヶ月以内'
    };

    // Act
    const result1 = findSimilarPatterns(dealCondition, stubEngine);
    const result2 = findSimilarPatterns(dealCondition, stubEngine);
    const result3 = findSimilarPatterns(dealCondition, stubEngine);

    // Assert
    expect(result1).toEqual([
      expect.objectContaining({ id: 'pattern-001', rank: 1 }),
      expect.objectContaining({ id: 'pattern-003', rank: 2 }),
      expect.objectContaining({ id: 'pattern-005', rank: 3 })
    ]);

    expect(result2).toEqual([
      expect.objectContaining({ id: 'pattern-001', rank: 1 }),
      expect.objectContaining({ id: 'pattern-003', rank: 2 }),
      expect.objectContaining({ id: 'pattern-005', rank: 3 })
    ]);

    expect(result3).toEqual([
      expect.objectContaining({ id: 'pattern-001', rank: 1 }),
      expect.objectContaining({ id: 'pattern-003', rank: 2 }),
      expect.objectContaining({ id: 'pattern-005', rank: 3 })
    ]);

    const result1Ids = result1.map(p => p.id);
    const result2Ids = result2.map(p => p.id);
    const result3Ids = result3.map(p => p.id);

    expect(result1Ids).toEqual(['pattern-001', 'pattern-003', 'pattern-005']);
    expect(result2Ids).toEqual(['pattern-001', 'pattern-003', 'pattern-005']);
    expect(result3Ids).toEqual(['pattern-001', 'pattern-003', 'pattern-005']);

    expect(result1[0].score).toBe(95);
    expect(result2[0].score).toBe(95);
    expect(result3[0].score).toBe(95);

    expect(result1[1].score).toBe(87);
    expect(result2[1].score).toBe(87);
    expect(result3[1].score).toBe(87);

    expect(result1[2].score).toBe(78);
    expect(result2[2].score).toBe(78);
    expect(result3[2].score).toBe(78);
  });
});