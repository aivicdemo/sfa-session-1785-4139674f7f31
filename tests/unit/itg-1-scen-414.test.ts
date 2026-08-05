import { calculateApplicableSuccessPatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-414: [edge] 成功パターン適用判定機能 - 適用可能なパターンに同一成約率のデータが複数含まれる場合、全パターンが重複なく返される
  test('成約率が同一の複数パターンが重複なく返却されること', () => {
    // Arrange
    const salesProcessData = {
      customerAttributeId: 'CUST-001',
      saleStageId: 'STAGE-002',
      leadSourceId: 'SOURCE-EMAIL',
      proposalContentType: 'TYPE-ENTERPRISE',
      previousDealCount: 2
    };

    const successPatterns = [
      {
        patternId: 'PAT-001',
        conversionRate: 0.75,
        customerAttributeId: 'CUST-001',
        saleStageId: 'STAGE-002',
        leadSourceId: 'SOURCE-EMAIL',
        proposalContentType: 'TYPE-ENTERPRISE',
        minPreviousDealCount: 1,
        maxPreviousDealCount: 5,
        applicabilityScore: 95
      },
      {
        patternId: 'PAT-002',
        conversionRate: 0.75,
        customerAttributeId: 'CUST-001',
        saleStageId: 'STAGE-002',
        leadSourceId: 'SOURCE-EMAIL',
        proposalContentType: 'TYPE-ENTERPRISE',
        minPreviousDealCount: 0,
        maxPreviousDealCount: 10,
        applicabilityScore: 92
      },
      {
        patternId: 'PAT-003',
        conversionRate: 0.75,
        customerAttributeId: 'CUST-001',
        saleStageId: 'STAGE-002',
        leadSourceId: 'SOURCE-EMAIL',
        proposalContentType: 'TYPE-ENTERPRISE',
        minPreviousDealCount: 2,
        maxPreviousDealCount: 8,
        applicabilityScore: 90
      },
      {
        patternId: 'PAT-004',
        conversionRate: 0.68,
        customerAttributeId: 'CUST-001',
        saleStageId: 'STAGE-003',
        leadSourceId: 'SOURCE-PHONE',
        proposalContentType: 'TYPE-SMB',
        minPreviousDealCount: 0,
        maxPreviousDealCount: 5,
        applicabilityScore: 85
      }
    ];

    // Act
    const result = calculateApplicableSuccessPatterns(
      salesProcessData,
      successPatterns
    );

    // Assert
    expect(result.length).toBe(3);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ patternId: 'PAT-001' }),
        expect.objectContaining({ patternId: 'PAT-002' }),
        expect.objectContaining({ patternId: 'PAT-003' })
      ])
    );

    const patternIds = result.map((pattern) => pattern.patternId);
    expect(new Set(patternIds).size).toBe(3);
    expect(patternIds).toEqual(['PAT-001', 'PAT-002', 'PAT-003']);
  });
});