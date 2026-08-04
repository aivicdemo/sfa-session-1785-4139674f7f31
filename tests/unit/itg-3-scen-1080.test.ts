import { generateAndRegisterProposalApproaches } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチの自動推奨と登録', () => {
  // SCEN-1080
  test('generateRecommendationから返却された複数の提案アプローチがすべて提案アプローチテーブルに登録される', async () => {
    const new_project_customer_id = 'CUST_001';
    const new_project_customer_industry = '金融';
    const new_project_customer_scale = '大規模';
    const new_project_business_phase = '商談準備';
    const new_project_budget_amount = 5000000;
    const new_project_timeline_days = 180;

    const mock_ai_engine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendations: [
          {
            approach_id: 'APP_001',
            approach_name: 'デジタル変革提案',
            approach_description: '顧客のDX推進をサポートするアプローチ',
            reasoning_basis: '同規模顧客の成功事例から抽出',
            confidence_score: 92,
            estimated_adoption_probability: 0.85,
          },
          {
            approach_id: 'APP_002',
            approach_name: 'コスト最適化提案',
            approach_description: '既存システムのコスト削減を提案',
            reasoning_basis: '金融業界の標準課題パターンマッチ',
            confidence_score: 78,
            estimated_adoption_probability: 0.68,
          },
          {
            approach_id: 'APP_003',
            approach_name: 'リスク管理強化提案',
            approach_description: 'コンプライアンス要件への対応',
            reasoning_basis: '規制要件の最新動向分析から推奨',
            confidence_score: 85,
            estimated_adoption_probability: 0.76,
          },
        ],
      }),
    };

    const mock_proposal_approach_repository = {
      insertProposalApproach: jest
        .fn()
        .mockResolvedValueOnce({
          proposal_approach_id: 'PA_20240115_001',
          business_deal_id: 'DEAL_001',
          approach_name: 'デジタル変革提案',
          approach_description: '顧客のDX推進をサポートするアプローチ',
          reasoning_basis: '同規模顧客の成功事例から抽出',
          confidence_score: 92,
          created_at: '2024-01-15T11:00:00Z',
        })
        .mockResolvedValueOnce({
          proposal_approach_id: 'PA_20240115_002',
          business_deal_id: 'DEAL_001',
          approach_name: 'コスト最適化提案',
          approach_description: '既存システムのコスト削減を提案',
          reasoning_basis: '金融業界の標準課題パターンマッチ',
          confidence_score: 78,
          created_at: '2024-01-15T11:00:00Z',
        })
        .mockResolvedValueOnce({
          proposal_approach_id: 'PA_20240115_003',
          business_deal_id: 'DEAL_001',
          approach_name: 'リスク管理強化提案',
          approach_description: 'コンプライアンス要件への対応',
          reasoning_basis: '規制要件の最新動向分析から推奨',
          confidence_score: 85,
          created_at: '2024-01-15T11:00:00Z',
        }),
      queryProposalApproachesByDealId: jest.fn().mockResolvedValueOnce([
        {
          proposal_approach_id: 'PA_20240115_001',
          business_deal_id: 'DEAL_001',
          approach_name: 'デジタル変革提案',
          approach_description: '顧客のDX推進をサポートするアプローチ',
          reasoning_basis: '同規模顧客の成功事例から抽出',
          confidence_score: 92,
          created_at: '2024-01-15T11:00:00Z',
        },
        {
          proposal_approach_id: 'PA_20240115_002',
          business_deal_id: 'DEAL_001',
          approach_name: 'コスト最適化提案',
          approach_description: '既存システムのコスト削減を提案',
          reasoning_basis: '金融業界の標準課題パターンマッチ',
          confidence_score: 78,
          created_at: '2024-01-15T11:00:00Z',
        },
        {
          proposal_approach_id: 'PA_20240115_003',
          business_deal_id: 'DEAL_001',
          approach_name: 'リスク管理強化提案',
          approach_description: 'コンプライアンス要件への対応',
          reasoning_basis: '規制要件の最新動向分析から推奨',
          confidence_score: 85,
          created_at: '2024-01-15T11:00:00Z',
        },
      ]),
    };

    const input_params = {
      customer_id: new_project_customer_id,
      customer_industry: new_project_customer_industry,
      customer_scale: new_project_customer_scale,
      business_phase: new_project_business_phase,
      budget_amount: new_project_budget_amount,
      timeline_days: new_project_timeline_days,
      business_deal_id: 'DEAL_001',
    };

    const result = await generateAndRegisterProposalApproaches(
      input_params,
      mock_ai_engine,
      mock_proposal_approach_repository
    );

    expect(mock_ai_engine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_id: new_project_customer_id,
        customer_industry: new_project_customer_industry,
        customer_scale: new_project_customer_scale,
        business_phase: new_project_business_phase,
        budget_amount: new_project_budget_amount,
        timeline_days: new_project_timeline_days,
      })
    );

    expect(mock_proposal_approach_repository.insertProposalApproach).toHaveBeenCalledTimes(
      3
    );

    expect(
      mock_proposal_approach_repository.insertProposalApproach
    ).toHaveBeenNthCalledWith(1, {
      business_deal_id: 'DEAL_001',
      approach_name: 'デジタル変革提案',
      approach_description: '顧客のDX推進をサポートするアプローチ',
      reasoning_basis: '同規模顧客の成功事例から抽出',
      confidence_score: 92,
    });

    expect(
      mock_proposal_approach_repository.insertProposalApproach
    ).toHaveBeenNthCalledWith(2, {
      business_deal_id: 'DEAL_001',
      approach_name: 'コスト最適化提案',
      approach_description: '既存システムのコスト削減を提案',
      reasoning_basis: '金融業界の標準課題パターンマッチ',
      confidence_score: 78,
    });

    expect(
      mock_proposal_approach_repository.insertProposalApproach
    ).toHaveBeenNthCalledWith(3, {
      business_deal_id: 'DEAL_001',
      approach_name: 'リスク管理強化提案',
      approach_description: 'コンプライアンス要件への対応',
      reasoning_basis: '規制要件の最新動向分析から推奨',
      confidence_score: 85,
    });

    const registered_approaches = await mock_proposal_approach_repository.queryProposalApproachesByDealId(
      'DEAL_001'
    );

    expect(registered_approaches).toHaveLength(3);

    expect(registered_approaches[0]).toEqual({
      proposal_approach_id: 'PA_20240115_001',
      business_deal_id: 'DEAL_001',
      approach_name: 'デジタル変革提案',
      approach_description: '顧客のDX推進をサポートするアプローチ',
      reasoning_basis: '同規模顧客の成功事例から抽出',
      confidence_score: 92,
      created_at: '2024-01-15T11:00:00Z',
    });

    expect(registered_approaches[1]).toEqual({
      proposal_approach_id: 'PA_20240115_002',
      business_deal_id: 'DEAL_001',
      approach_name: 'コスト最適化提案',
      approach_description: '既存システムのコスト削減を提案',
      reasoning_basis: '金融業界の標準課題パターンマッチ',
      confidence_score: 78,
      created_at: '2024-01-15T11:00:00Z',
    });

    expect(registered_approaches[2]).toEqual({
      proposal_approach_id: 'PA_20240115_003',
      business_deal_id: 'DEAL_001',
      approach_name: 'リスク管理強化提案',
      approach_description: 'コンプライアンス要件への対応',
      reasoning_basis: '規制要件の最新動向分析から推奨',
      confidence_score: 85,
      created_at: '2024-01-15T11:00:00Z',
    });

    expect(result).toEqual({
      success: true,
      registered_count: 3,
      proposal_approach_ids: [
        'PA_20240115_001',
        'PA_20240115_002',
        'PA_20240115_003',
      ],
    });
  });
});