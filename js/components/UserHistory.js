// 사용자 히스토리 컴포넌트
const UserHistory = {
    props: ['readings'],
    data() {
        return {
            showHistory: false,
            selectedReading: null
        };
    },
    computed: {
        hasReadings() {
            return this.readings && this.readings.length > 0;
        },
        
        sortedReadings() {
            if (!this.readings) return [];
            return [...this.readings].sort((a, b) => 
                new Date(b.created_at) - new Date(a.created_at)
            );
        }
    },
    template: `
        <div class="section user-history">
            <h2>📚 리딩 히스토리</h2>
            
            <div v-if="!hasReadings" class="no-history">
                <p>아직 리딩 기록이 없습니다.</p>
                <p>첫 번째 리딩을 시작해보세요!</p>
            </div>
            
            <div v-else class="history-container">
                <!-- 히스토리 토글 버튼 -->
                <div class="history-toggle">
                    <button @click="showHistory = !showHistory" class="btn btn-secondary">
                        {{ showHistory ? '히스토리 숨기기' : '히스토리 보기' }}
                        <span class="history-count">({{ sortedReadings.length }})</span>
                    </button>
                </div>
                
                <!-- 히스토리 목록 -->
                <div v-if="showHistory" class="history-list">
                    <div 
                        v-for="reading in sortedReadings" 
                        :key="reading.id"
                        class="history-item"
                        @click="selectReading(reading)">
                        
                        <div class="history-header">
                            <div class="history-date">{{ formatDate(reading.created_at) }}</div>
                            <div class="history-purpose">{{ getPurposeName(reading.reading_result.purpose) }}</div>
                        </div>
                        
                        <div class="history-cards">
                            <span 
                                v-for="(cardName, index) in getCardNames(reading)" 
                                :key="index"
                                class="history-card">
                                {{ cardName }}
                            </span>
                        </div>
                        
                        <div class="history-summary">
                            {{ getReadingSummary(reading) }}
                        </div>
                        
                        <div class="history-actions">
                            <button @click.stop="viewReading(reading)" class="btn-small">
                                보기
                            </button>
                            <button @click.stop="deleteReading(reading.id)" class="btn-small btn-danger">
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- 선택된 리딩 상세 보기 -->
                <div v-if="selectedReading" class="selected-reading-detail">
                    <div class="detail-header">
                        <h3>선택된 리딩 상세</h3>
                        <button @click="selectedReading = null" class="close-btn">×</button>
                    </div>
                    
                    <div class="detail-content">
                        <div class="detail-info">
                            <p><strong>날짜:</strong> {{ formatDate(selectedReading.created_at) }}</p>
                            <p><strong>목적:</strong> {{ getPurposeName(selectedReading.reading_result.purpose) }}</p>
                            <p><strong>카드:</strong> {{ getCardNames(selectedReading).join(', ') }}</p>
                        </div>
                        
                        <div class="detail-reading">
                            <h4>리딩 결과 요약</h4>
                            <p>{{ getReadingSummary(selectedReading) }}</p>
                        </div>
                        
                        <div class="detail-actions">
                            <button @click="recreateReading(selectedReading)" class="btn btn-secondary">
                                🔄 다시 리딩
                            </button>
                            <button @click="exportReading(selectedReading)" class="btn">
                                📤 내보내기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        selectReading(reading) {
            this.selectedReading = reading;
        },
        
        viewReading(reading) {
            // 부모 컴포넌트에 리딩 보기 요청
            this.$emit('view-reading', reading);
        },
        
        deleteReading(readingId) {
            if (confirm('정말로 이 리딩을 삭제하시겠습니까?')) {
                this.$emit('delete-reading', readingId);
            }
        },
        
        recreateReading(reading) {
            // 부모 컴포넌트에 리딩 재생성 요청
            this.$emit('recreate-reading', reading);
        },
        
        exportReading(reading) {
            // 리딩 데이터 내보내기
            const exportData = {
                ...reading,
                exportedAt: new Date().toISOString()
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `tarot-reading-${reading.id}.json`;
            link.click();
        },
        
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        
        getPurposeName(purposeCode) {
            const purposeNames = {
                'love': '연애/사랑',
                'career': '직장/일',
                'daily': '오늘의 운세',
                'health': '건강',
                'money': '금전',
                'family': '가족',
                'study': '학업',
                'travel': '여행'
            };
            return purposeNames[purposeCode] || purposeCode;
        },
        
        getCardNames(reading) {
            const cardNames = [
                reading.card1_name,
                reading.card2_name,
                reading.card3_name
            ].filter(name => name);
            
            return cardNames;
        },
        
        getReadingSummary(reading) {
            if (reading.reading_result && reading.reading_result.combination) {
                return reading.reading_result.combination.overall_meaning || '리딩 요약을 불러올 수 없습니다.';
            }
            return '리딩 결과를 불러올 수 없습니다.';
        }
    }
};

// Vue 컴포넌트 등록
if (typeof Vue !== 'undefined') {
    Vue.createApp({}).component('user-history', UserHistory);
}
