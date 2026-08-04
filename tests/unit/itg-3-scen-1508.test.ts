import { PurchaseHistoryDataQualityValidator } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase History Data Quality Validation - Empty Proposal Content', () => {
  // SCEN-1508
  test('should add non-conforming item when proposal content is empty string', () => {
    const validator = new PurchaseHistoryDataQualityValidator();
    
    const result = validator.validateRecommendationContent({
      proposalContent: ''
    });

    expect(result.nonConformingItems).toBeDefined();
    expect(Array.isArray(result.nonConformingItems)).toBe(true);
    expect(result.nonConformingItems.length).toBeGreaterThanOrEqual(1);
    
    const emptyContentIssue = result.nonConformingItems.find(
      (item: { errorCode?: string; message?: string }) =>
        item.errorCode === 'EMPTY_PROPOSAL_CONTENT' ||
        item.message === 'Proposal content must not be empty'
    );
    
    expect(emptyContentIssue).toBeDefined();
  });
});