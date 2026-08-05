import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1053
  test('should generate behavior analysis report for 1050+ sales representatives within timeout with accurate pattern classification', async () => {
    const salesRepCount = 1050;
    const salesReps = Array.from({ length: salesRepCount }, (_, index) => ({
      id: `rep_${String(index + 1).padStart(4, '0')}`,
      name: `Sales Rep ${index + 1}`,
      department: `Dept_${Math.floor(index / 100) + 1}`,
    }));

    const behaviorData = salesReps.map((rep) => {
      const baseVisitCount = Math.floor(Math.random() * 80) + 20;
      const baseProposalCount = Math.floor(Math.random() * 40) + 5;
      const baseContractCount = Math.floor(Math.random() * 20) + 1;

      return {
        repId: rep.id,
        visitCount: baseVisitCount,
        proposalCount: baseProposalCount,
        contractCount: baseContractCount,
        contractRate: Number((baseContractCount / baseProposalCount).toFixed(3)),
        periodMonths: 12,
      };
    });

    const startTime = Date.now();

    const result = await generateSalesRepBehaviorAnalysisReport({
      salesReps,
      behaviorData,
      analysisStartDate: '2023-01-01',
      analysisEndDate: '2023-12-31',
    });

    const endTime = Date.now();
    const processingTimeMs = endTime - startTime;

    expect(result.totalRepsAnalyzed).toBe(1050);
    expect(result.patterns).toHaveLength(1050);

    const analysisTimeoutMs = 60000;
    expect(processingTimeMs).toBeLessThanOrEqual(analysisTimeoutMs);

    const visitPatterns = result.patterns.filter((p) => p.classificationCategory === 'high_frequency_visit');
    const proposalPatterns = result.patterns.filter((p) => p.classificationCategory === 'proposal_focused');
    const contractPatterns = result.patterns.filter((p) => p.classificationCategory === 'contract_focused');

    const totalClassified = visitPatterns.length + proposalPatterns.length + contractPatterns.length;
    expect(totalClassified).toBe(1050);

    const allRepIds = new Set(result.patterns.map((p) => p.repId));
    expect(allRepIds.size).toBe(1050);

    result.patterns.forEach((pattern, index) => {
      const expectedRepId = `rep_${String(index + 1).padStart(4, '0')}`;
      expect(pattern.repId).toBe(expectedRepId);

      expect(pattern.visitFrequency).toBeGreaterThanOrEqual(20);
      expect(pattern.visitFrequency).toBeLessThanOrEqual(100);

      expect(pattern.proposalFrequency).toBeGreaterThanOrEqual(5);
      expect(pattern.proposalFrequency).toBeLessThanOrEqual(45);

      expect(pattern.contractRate).toBeGreaterThanOrEqual(0);
      expect(pattern.contractRate).toBeLessThanOrEqual(1);

      expect(['high_frequency_visit', 'proposal_focused', 'contract_focused']).toContain(pattern.classificationCategory);
    });

    expect(result.reportGeneratedAt).toBe('2024-01-15T11:00:00Z');
    expect(result.analysisStatus).toBe('completed');
  });
});