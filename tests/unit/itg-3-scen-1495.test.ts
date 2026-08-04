import { evaluateDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase history data quality evaluation', () => {
  // SCEN-1495
  test('should judge quality score 101 as ACCEPTABLE_FOR_LEARNING when score exceeds minimum threshold 100', () => {
    const qualityScore = 101;
    const result = evaluateDataQuality(qualityScore);

    expect(result.status).toBe('ACCEPTABLE_FOR_LEARNING');
    expect(result.canUseLearning).toBe(true);
    expect(result.reason).toContain('Score exceeds minimum threshold (100)');
  });
});