// 수치학 데이터베이스 서비스
import { initializeSupabase } from './supabase.js';

export class NumerologyService {
    async getLifePathInsight(lifePathNumber, purposeType, cardDirection) {
        try {
            const supabase = await initializeSupabase();
            const { data, error } = await supabase
                .from('numerology_insights')
                .select('*')
                .eq('insight_type', 'life_path')
                .eq('life_path_number', lifePathNumber)
                .eq('purpose_type', purposeType)
                .eq('card_direction', cardDirection)
                .single();
            
            if (error) {
                console.warn('생명수 해석 조회 실패:', error);
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('생명수 해석 조회 중 오류:', error);
            return null;
        }
    }
    
    async getSeasonInsight(seasonName, purposeType) {
        try {
            const supabase = await initializeSupabase();
            const { data, error } = await supabase
                .from('numerology_insights')
                .select('*')
                .eq('insight_type', 'season')
                .eq('season_name', seasonName)
                .eq('purpose_type', purposeType)
                .single();
            
            if (error) {
                console.warn('계절 해석 조회 실패:', error);
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('계절 해석 조회 중 오류:', error);
            return null;
        }
    }
    
    async getCombinationInsight(lifePathNumber, purposeType) {
        try {
            const supabase = await initializeSupabase();
            const { data, error } = await supabase
                .from('numerology_insights')
                .select('*')
                .eq('insight_type', 'combination')
                .eq('life_path_number', lifePathNumber)
                .eq('purpose_type', purposeType)
                .single();
            
            if (error) {
                console.warn('조합 해석 조회 실패:', error);
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('조합 해석 조회 중 오류:', error);
            return null;
        }
    }
    
    async applyNumerologicalInsight(card, purpose, lifePathNumber, birthSeason, isReversed) {
        try {
            const cardDirection = isReversed ? 'reversed' : 'upright';
            
            // 생명수별 해석 조회
            const lifePathInsight = await this.getLifePathInsight(lifePathNumber, purpose, cardDirection);
            
            // 계절별 해석 조회
            const seasonInsight = await this.getSeasonInsight(birthSeason.name, purpose);
            
            if (lifePathInsight || seasonInsight) {
                const baseMeaning = lifePathInsight?.insight_text || '';
                const seasonContext = seasonInsight?.insight_text ? ` ${seasonInsight.insight_text}` : '';
                const advice = lifePathInsight?.advice_text || '';
                
                return {
                    meaning: baseMeaning + seasonContext,
                    advice: advice
                };
            }
            
            return null;
        } catch (error) {
            console.error('수치학적 해석 적용 실패:', error);
            return null;
        }
    }
    
    async applyNumerologicalCombination(combinationReading, purpose, lifePathNumber, birthSeason, cardReadings) {
        try {
            // 생명수별 조합 해석 조회
            const combinationInsight = await this.getCombinationInsight(lifePathNumber, purpose);
            
            if (combinationInsight) {
                return {
                    ...combinationReading,
                    overall_meaning: combinationInsight.insight_text,
                    advice: combinationInsight.advice_text
                };
            }
            
            return null;
        } catch (error) {
            console.error('수치학적 조합 해석 적용 실패:', error);
            return null;
        }
    }
    
    // 관리용 함수들
    async getAllNumerologyInsights() {
        try {
            const supabase = await initializeSupabase();
            const { data, error } = await supabase
                .from('numerology_insights')
                .select('*')
                .order('insight_type, life_path_number, season_name, purpose_type, card_direction');
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('전체 수치학 데이터 조회 실패:', error);
            return [];
        }
    }
    
    async getInsightsByType(insightType) {
        try {
            const supabase = await initializeSupabase();
            const { data, error } = await supabase
                .from('numerology_insights')
                .select('*')
                .eq('insight_type', insightType)
                .order('purpose_type, life_path_number, season_name, card_direction');
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`${insightType} 타입 데이터 조회 실패:`, error);
            return [];
        }
    }
}
