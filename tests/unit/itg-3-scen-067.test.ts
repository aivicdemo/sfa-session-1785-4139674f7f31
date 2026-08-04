import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('パターン適用可能性評価機能 - 商談条件未設定時の正常評価', () => {
  // SCEN-067
  test('商談条件が未設定の場合に評価が正常に実行される', async () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.75,
        patterns: [
          { id: 'pat_001', name: 'ITシステム導入パターン', successRate: 0.82 },
          { id: 'pat_002', name: 'コスト削減提案パターン', successRate: 0.78 },
          { id: 'pat_003', name: 'プロセス改善パターン', successRate: 0.76 },
          { id: 'pat_004', name: 'デジタル化推進パターン', successRate: 0.74 }
        ]
      })
    };

    const input = {
      patternId: 'pat_template_001',
      customerInfo: {
        companyId: 'cust_12345',
        industry: 'manufacturing',
        employeeCount: 500
      },
      dealConditions: {
        budget: null,
        implementationDate: null,
        industryCategory: null,
        decisionMakerId: null,
        competitorName: null
      }
    };

    const result = await evaluatePatternRelevance(input, mockAIEngine);

    expect(result).toEqual({
      patternId: 'pat_template_001',
      relevanceScore: 0.75,
      applicablePatterns: [
        { id: 'pat_001', name: 'ITシステム導入パターン', successRate: 0.82 },
        { id: 'pat_002', name: 'コスト削減提案パターン', successRate: 0.78 },
        { id: 'pat_003', name: 'プロセス改善パターン', successRate: 0.76 },
        { id: 'pat_004', name: 'デジタル化推進パターン', successRate: 0.74 }
      ],
      processingStatus: 'completed'
    });

    expect(result.relevanceScore).toBeGreaterThanOrEqual(0);
    expect(result.relevanceScore).toBeLessThanOrEqual(1.0);
    expect(result.applicablePatterns.length).toBeGreaterThanOrEqual(3);
    expect(result.processingStatus).toBe('completed');
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customerInfo: input.customerInfo,
        dealConditions: {
          budget: null,
          implementationDate: null,
          industryCategory: null,
          decisionMakerId: null,
          competitorName: null
        }
      })
    );
  });
});