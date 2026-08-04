import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データからの成功パターン抽出機能', () => {
  // SCEN-2581
  test('成功した商談件数がちょうど閾値のとき、すべてがパターン抽出に含まれる', async () => {
    const THRESHOLD = 10;
    const mockDealData = Array.from({ length: THRESHOLD }, (_, i) => ({
      dealId: `deal_${i + 1}`,
      customerId: `customer_${i + 1}`,
      industryType: i % 3 === 0 ? 'manufacturing' : i % 3 === 1 ? 'retail' : 'finance',
      dealAmount: 1000000 + i * 100000,
      dealStatus: 'closed_won',
      closedDate: new Date(`2024-${String((i % 12) + 1).padStart(2, '0')}-15T09:00:00Z`).toISOString(),
      proposalContent: `proposal_content_${i + 1}`,
      successScore: 0.8 + i * 0.01,
    }));

    const expectedPatterns = mockDealData.map((deal) => ({
      dealId: deal.dealId,
      customerId: deal.customerId,
      industryType: deal.industryType,
      dealAmount: deal.dealAmount,
      proposalContent: deal.proposalContent,
      successScore: deal.successScore,
      similarity: 0.85 + (Math.random() * 0.1),
    }));

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(expectedPatterns),
    };

    const query = {
      customerId: 'customer_new',
      industryType: 'manufacturing',
      dealAmount: 2000000,
      proposalContent: 'new_proposal',
    };

    const result = await findSimilarPatterns(query, mockAIEngine as any);

    expect(result).toHaveLength(THRESHOLD);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(query);

    result.forEach((pattern, index) => {
      expect(pattern.dealId).toBe(mockDealData[index].dealId);
      expect(pattern.customerId).toBe(mockDealData[index].customerId);
      expect(pattern.industryType).toBe(mockDealData[index].industryType);
      expect(pattern.dealAmount).toBe(mockDealData[index].dealAmount);
      expect(pattern.proposalContent).toBe(mockDealData[index].proposalContent);
      expect(pattern.successScore).toBe(mockDealData[index].successScore);
    });

    const dealIdsInResult = result.map((p) => p.dealId);
    const dealIdsInMockData = mockDealData.map((d) => d.dealId);
    expect(dealIdsInResult).toEqual(dealIdsInMockData);
  });
});