// 메인 Vue.js 앱
import { TarotService } from './services/tarotService.js';

const { createApp } = Vue;

createApp({
    data() {
        return {
            // 앱 상태
            isLoading: false,
            isAuthenticated: false,
            
            // 데이터
            availableCards: [],
            purposes: [],
            selectedPurpose: 'daily',
            selectedCards: [],
            readingResult: null,
            userReadings: [],
            
            // 서비스
            tarotService: new TarotService(),
            
            // UI 상태
            currentStep: 'purpose', // purpose, deck, spread, result
            errorMessage: ''
        };
    },
    
    async mounted() {
        try {
            this.isLoading = true;
            
            // 초기 데이터 로드
            await this.loadInitialData();
            
            // 인증 상태 확인
            await this.checkAuth();
            
            // 사용자 리딩 히스토리 로드
            if (this.isAuthenticated) {
                await this.loadUserReadings();
            }
            
        } catch (error) {
            console.error('앱 초기화 실패:', error);
            this.errorMessage = '앱을 초기화하는 중 오류가 발생했습니다.';
        } finally {
            this.isLoading = false;
        }
    },
    
    methods: {
        // 초기 데이터 로드
        async loadInitialData() {
            try {
                // 카드 데이터 로드
                this.availableCards = await this.tarotService.getAllCards();
                
                // 목적 데이터 로드
                this.purposes = await this.tarotService.getAllPurposes();
                
            } catch (error) {
                console.error('초기 데이터 로드 실패:', error);
                throw error;
            }
        },
        
        // 인증 상태 확인
        async checkAuth() {
            try {
                this.isAuthenticated = await this.tarotService.checkAuth();
            } catch (error) {
                console.error('인증 상태 확인 실패:', error);
                this.isAuthenticated = false;
            }
        },
        
        // 사용자 리딩 히스토리 로드
        async loadUserReadings() {
            try {
                this.userReadings = await this.tarotService.getUserReadings();
            } catch (error) {
                console.error('사용자 리딩 히스토리 로드 실패:', error);
                this.userReadings = [];
            }
        },
        
        // 목적 선택
        onPurposeSelected(purposeCode) {
            this.selectedPurpose = purposeCode;
            this.currentStep = 'deck';
        },
        
        // 카드 선택
        selectCard(card) {
            if (this.selectedCards.length >= 3) {
                alert('이미 3장의 카드를 선택했습니다.');
                return;
            }
            
            // 중복 선택 방지
            if (this.selectedCards.find(c => c.id === card.id)) {
                alert('이미 선택된 카드입니다.');
                return;
            }
            
            this.selectedCards.push({
                ...card,
                reversed: Math.random() > 0.5 // 랜덤 역방향
            });
            
            // 3장이 모두 선택되면 스프레드 단계로 이동
            if (this.selectedCards.length === 3) {
                this.currentStep = 'spread';
            }
        },
        
        // 리딩 수행
        async performReading(readingData) {
            try {
                this.isLoading = true;
                this.errorMessage = '';
                
                const { cards, purpose } = readingData;
                
                // 그룹 정보 가져오기
                const groups = cards.map(card => {
                    if (card.group) {
                        return card.group.name;
                    } else if (card.suitGroup) {
                        return card.suitGroup.name;
                    }
                    return 'general';
                });
                
                // 목적별 그룹 조합 해석 조회
                const combination = await this.tarotService.getPurposeCombination(
                    groups[0], groups[1], groups[2],
                    cards[0].reversed, cards[1].reversed, cards[2].reversed,
                    purpose
                );
                
                // 개별 카드의 목적별 해석도 가져오기
                const cardReadings = await Promise.all(
                    cards.map(async (card) => {
                        return await this.tarotService.getPurposeReading(
                            card.id, 
                            purpose, 
                            card.reversed
                        );
                    })
                );
                
                // 리딩 결과 생성
                this.readingResult = {
                    cards: cards,
                    purpose: purpose,
                    combination: combination,
                    cardReadings: cardReadings,
                    timestamp: new Date()
                };
                
                // 사용자 리딩 저장
                if (this.isAuthenticated) {
                    await this.tarotService.saveUserReading(
                        cards.map(c => c.id),
                        cards.map(c => c.reversed),
                        this.readingResult
                    );
                    await this.loadUserReadings();
                }
                
                // 결과 단계로 이동
                this.currentStep = 'result';
                
            } catch (error) {
                console.error('리딩 수행 실패:', error);
                this.errorMessage = '리딩을 수행하는 중 오류가 발생했습니다.';
            } finally {
                this.isLoading = false;
            }
        },
        
        // 리딩 초기화
        resetReading() {
            this.selectedCards = [];
            this.readingResult = null;
            this.currentStep = 'purpose';
            this.errorMessage = '';
        },
        
        // 새로운 리딩 시작
        newReading() {
            this.resetReading();
        },
        
        // 히스토리에서 리딩 보기
        viewReading(reading) {
            this.readingResult = reading.reading_result;
            this.currentStep = 'result';
        },
        
        // 히스토리에서 리딩 삭제
        async deleteReading(readingId) {
            try {
                // 실제 삭제 로직은 서비스에 구현 필요
                // await this.tarotService.deleteUserReading(readingId);
                
                // 히스토리 다시 로드
                await this.loadUserReadings();
                
                alert('리딩이 삭제되었습니다.');
            } catch (error) {
                console.error('리딩 삭제 실패:', error);
                alert('리딩 삭제에 실패했습니다.');
            }
        },
        
        // 히스토리에서 리딩 재생성
        recreateReading(reading) {
            const cards = [
                { id: reading.card1_id, name: reading.card1_name, reversed: reading.card1_reversed },
                { id: reading.card2_id, name: reading.card2_name, reversed: reading.card2_reversed },
                { id: reading.card3_id, name: reading.card3_name, reversed: reading.card3_reversed }
            ];
            
            this.selectedCards = cards;
            this.selectedPurpose = reading.reading_result.purpose;
            this.currentStep = 'spread';
        },
        
        // 에러 메시지 표시
        showError(message) {
            this.errorMessage = message;
            setTimeout(() => {
                this.errorMessage = '';
            }, 5000);
        },
        
        // 로딩 상태 표시
        showLoading() {
            this.isLoading = true;
        },
        
        hideLoading() {
            this.isLoading = false;
        }
    },
    
    computed: {
        // 현재 단계에 따른 UI 표시
        showPurposeSelector() {
            return this.currentStep === 'purpose';
        },
        
        showTarotDeck() {
            return this.currentStep === 'deck' || this.currentStep === 'spread';
        },
        
        showCardSpread() {
            return this.currentStep === 'spread';
        },
        
        showReadingResult() {
            return this.currentStep === 'result' && this.readingResult;
        },
        
        showUserHistory() {
            return this.isAuthenticated && this.userReadings.length > 0;
        },
        
        // 진행률 계산
        progressPercentage() {
            const steps = ['purpose', 'deck', 'spread', 'result'];
            const currentIndex = steps.indexOf(this.currentStep);
            return ((currentIndex + 1) / steps.length) * 100;
        }
    }
}).mount('#app');
