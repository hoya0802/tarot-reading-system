// 리딩 결과 컴포넌트
import { getCardDefaultImage, getPurposeIcon, getPurposeName } from '../utils/cardUtils.js';

const ReadingResult = {
    props: ['result'],
    data() {
        return {
            showDetails: false
        };
    },
    template: `
        <div class="reading-result fade-in">
            <!-- 결과 헤더 -->
            <div class="result-header">
                <div class="purpose-icon-large">{{ getPurposeIcon(result.purpose) }}</div>
                <h2>{{ getPurposeName(result.purpose) }} 리딩 결과</h2>
                <p class="result-timestamp">{{ formatTimestamp(result.timestamp) }}</p>
            </div>
            
            <!-- 선택된 카드들 -->
            <div class="result-cards">
                <div 
                    v-for="(card, index) in result.cards" 
                    :key="card.id"
                    class="result-card">
                    
                    <h3>{{ getPositionName(index) }} - {{ card.name }}</h3>
                    
                    <div class="card-image-container">
                        <div class="card-image">
                            <span>{{ getCardDefaultImage(card) }}</span>
                            <div v-if="card.reversed" class="reversed-indicator">역방향</div>
                        </div>
                    </div>
                    
                    <div class="result-card-meaning">
                        {{ getCardMeaning(card, index) }}
                    </div>
                    
                    <div class="result-card-keywords">
                        {{ getCardKeywords(card, index) }}
                    </div>
                </div>
            </div>
            
            <!-- 조합 해석 -->
            <div class="reading-sections">
                <div class="reading-section">
                    <h3>📖 과거</h3>
                    <p>{{ result.combination.past_meaning }}</p>
                </div>
                
                <div class="reading-section">
                    <h3>🎯 현재</h3>
                    <p>{{ result.combination.present_meaning }}</p>
                </div>
                
                <div class="reading-section">
                    <h3>🔮 미래</h3>
                    <p>{{ result.combination.future_meaning }}</p>
                </div>
            </div>
            
            <!-- 전체 해석 -->
            <div class="reading-section full-width">
                <h3>🌟 전체적인 해석</h3>
                <p>{{ result.combination.overall_meaning }}</p>
            </div>
            
            <!-- 목적별 특화 정보 -->
            <div v-if="getPurposeSpecificInfo()" class="purpose-specific">
                <h3>{{ getPurposeSpecificTitle() }}</h3>
                <p>{{ getPurposeSpecificInfo() }}</p>
            </div>
            
            <!-- 조언 -->
            <div class="advice-section">
                <h3>💡 조언</h3>
                <p>{{ result.combination.advice }}</p>
            </div>
            
            <!-- 상세 정보 토글 -->
            <div class="details-toggle">
                <button @click="showDetails = !showDetails" class="btn btn-secondary">
                    {{ showDetails ? '간단히 보기' : '상세 정보 보기' }}
                </button>
            </div>
            
            <!-- 상세 정보 -->
            <div v-if="showDetails" class="detailed-info">
                <h3>📊 상세 분석</h3>
                
                <div class="analysis-grid">
                    <div class="analysis-item">
                        <h4>카드 조합 분석</h4>
                        <p>{{ result.combination.relationship_theme }}</p>
                    </div>
                    
                    <div class="analysis-item">
                        <h4>에너지 흐름</h4>
                        <p>{{ getEnergyFlow() }}</p>
                    </div>
                    
                    <div class="analysis-item">
                        <h4>주의사항</h4>
                        <p>{{ getWarnings() }}</p>
                    </div>
                    
                    <div class="analysis-item">
                        <h4>기회 요소</h4>
                        <p>{{ getOpportunities() }}</p>
                    </div>
                </div>
            </div>
            
            <!-- 액션 버튼 -->
            <div class="result-actions">
                <button @click="shareResult" class="btn btn-secondary">
                    📤 결과 공유
                </button>
                
                <button @click="saveResult" class="btn">
                    💾 결과 저장
                </button>
                
                <button @click="newReading" class="btn btn-reset">
                    🔄 새로운 리딩
                </button>
            </div>
        </div>
    `,
    methods: {
        getPurposeIcon(purposeCode) {
            return getPurposeIcon(purposeCode);
        },
        
        getPurposeName(purposeCode) {
            return getPurposeName(purposeCode);
        },
        
        getCardDefaultImage(card) {
            return getCardDefaultImage(card);
        },
        
        getPositionName(index) {
            const positions = ['과거', '현재', '미래'];
            return positions[index] || '';
        },
        
        getCardMeaning(card, index) {
            if (this.result.cardReadings && this.result.cardReadings[index]) {
                return this.result.cardReadings[index].meaning;
            }
            return card.reversed ? card.reversed_meaning : card.upright_meaning;
        },
        
        getCardKeywords(card, index) {
            if (this.result.cardReadings && this.result.cardReadings[index]) {
                return this.result.cardReadings[index].keywords;
            }
            return card.keywords || '키워드 없음';
        },
        
        getPurposeSpecificInfo() {
            // 새로운 specialInsight 필드 우선 사용
            if (this.result.specialInsight) {
                return this.result.specialInsight;
            }
            
            // 기존 방식 fallback
            const purpose = this.result.purpose;
            const combination = this.result.combination;
            
            const specificFields = {
                'love': combination.love_insights,
                'career': combination.career_guidance,
                'daily': combination.daily_focus,
                'health': combination.health_notes,
                'money': combination.money_outlook
            };
            
            return specificFields[purpose] || null;
        },
        
        getPurposeSpecificTitle() {
            const titles = {
                'love': '💕 연애 특별 조언',
                'career': '💼 직장 가이드',
                'daily': '☀️ 오늘의 집중점',
                'health': '🌿 건강 주의사항',
                'money': '💰 금전 전망'
            };
            return titles[this.result.purpose] || '특별 조언';
        },
        
        getEnergyFlow() {
            const cards = this.result.cards;
            const energies = cards.map(card => {
                const direction = card.reversed ? '역방향' : '정방향';
                return `${card.name} (${direction})`;
            });
            
            return `에너지 흐름: ${energies.join(' → ')}`;
        },
        
        getWarnings() {
            const reversedCards = this.result.cards.filter(card => card.reversed);
            if (reversedCards.length > 0) {
                return `역방향 카드 ${reversedCards.length}장이 나타나 주의가 필요합니다.`;
            }
            return '특별한 주의사항은 없습니다.';
        },
        
        getOpportunities() {
            const uprightCards = this.result.cards.filter(card => !card.reversed);
            if (uprightCards.length >= 2) {
                return '정방향 카드가 많아 긍정적인 기회가 있습니다.';
            }
            return '현재 상황을 잘 관찰하고 기회를 포착하세요.';
        },
        
        formatTimestamp(timestamp) {
            if (!timestamp) return '';
            
            const date = new Date(timestamp);
            return date.toLocaleString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        
        shareResult() {
            // 결과 공유 기능
            const shareText = `${this.getPurposeName(this.result.purpose)} 리딩 결과를 확인해보세요!`;
            
            if (navigator.share) {
                navigator.share({
                    title: '타로 리딩 결과',
                    text: shareText,
                    url: window.location.href
                });
            } else {
                // 클립보드 복사
                navigator.clipboard.writeText(shareText).then(() => {
                    alert('결과가 클립보드에 복사되었습니다.');
                });
            }
        },
        
        saveResult() {
            // 결과 저장 기능
            const resultData = {
                ...this.result,
                savedAt: new Date().toISOString()
            };
            
            localStorage.setItem('saved_reading', JSON.stringify(resultData));
            alert('결과가 저장되었습니다.');
        },
        
        newReading() {
            // 새로운 리딩 시작
            this.$emit('new-reading');
        }
    }
};

// Vue 컴포넌트 등록
if (typeof Vue !== 'undefined') {
    Vue.createApp({}).component('reading-result', ReadingResult);
}
