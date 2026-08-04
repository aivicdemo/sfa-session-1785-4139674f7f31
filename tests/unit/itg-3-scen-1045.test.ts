import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1045: 推奨根拠が1項目の場合、その根拠が詳細に記録される', async () => {
    const mockReasonRepository = {
      save: jest.fn().mockResolvedValue({
        reasonId: 'REASON-001',
        category: '顧客業界',
        description: '製造業向けの過去成功事例から、納期短縮を重視する顧客層では提案内容Aが成功率87%',
        confidence: 0.87,
        relatedCases: 23,
        recordedAt: '2024-01-15T11:00:00Z',
      }),
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-20240115-001',
        reasons: [
          {
            reasonId: 'REASON-001',
            category: '顧客業界',
            description: '製造業向けの過去成功事例から、納期短縮を重視する顧客層では提案内容Aが成功率87%',
            confidence: 0.87,
            relatedCases: 23,
          },
        ],
        proposedApproach: 'アプローチA',
        createdAt: '2024-01-15T11:00:00Z',
      }),
    };

    const newProjectData = {
      customerName: 'テスト太郎商事',
      industry: '製造業',
      challenge: '納期短縮',
    };

    const result = await generateRecommendation(newProjectData, mockAIEngine, mockReasonRepository);

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(newProjectData);
    expect(mockReasonRepository.save).toHaveBeenCalled();

    const savedReasonCall = mockReasonRepository.save.mock.calls[0][0];
    expect(savedReasonCall.reasonId).toBe('REASON-001');
    expect(savedReasonCall.category).toBe('顧客業界');
    expect(savedReasonCall.description).toBe('製造業向けの過去成功事例から、納期短縮を重視する顧客層では提案内容Aが成功率87%');
    expect(savedReasonCall.confidence).toBe(0.87);
    expect(savedReasonCall.relatedCases).toBe(23);
    expect(savedReasonCall.recordedAt).toBeDefined();

    expect(result.reasons).toHaveLength(1);
    expect(result.reasons[0]).toEqual({
      reasonId: 'REASON-001',
      category: '顧客業界',
      description: '製造業向けの過去成功事例から、納期短縮を重視する顧客層では提案内容Aが成功率87%',
      confidence: 0.87,
      relatedCases: 23,
    });
  });
});