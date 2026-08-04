import { DataQualityValidator } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase History Data Quality Validation', () => {
  // SCEN-1507
  test('should add proposalContent to defectItems when field is missing and set status to UNQUALIFIED', () => {
    const validator = new DataQualityValidator();

    const testCases = [
      {
        proposalContent: undefined,
        description: 'proposalContent is undefined',
      },
      {
        proposalContent: null,
        description: 'proposalContent is null',
      },
      {
        proposalContent: '',
        description: 'proposalContent is empty string',
      },
    ];

    testCases.forEach(({ proposalContent, description }) => {
      const inputRecord = {
        customerId: 'CUST-001',
        transactionDateTime: '2024-01-15T14:30:00Z',
        productCategory: 'SaaS',
        purchaseAmount: 50000,
        proposalContent: proposalContent,
        salesRepresentativeId: 'SALES-123',
        dealStage: 'closed_won',
      };

      const result = validator.validatePurchaseHistoryRecord(inputRecord);

      expect(result.qualityStatus).toBe('UNQUALIFIED');

      const proposalContentDefect = result.defectItems.find(
        (item: { fieldName: string; errorMessage: string }) =>
          item.fieldName === 'proposalContent'
      );

      expect(proposalContentDefect).toBeDefined();
      expect(proposalContentDefect.errorMessage).toMatch(
        /提案内容フィールドが欠落/
      );
      expect(result.defectItems.length).toBeGreaterThanOrEqual(1);
    });
  });
});