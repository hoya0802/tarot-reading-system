// 목적 선택 컴포넌트
const PurposeSelector = {
    props: ['selectedPurpose'],
    data() {
        return {
            purposes: [
                { code: 'love', name: '연애/사랑', icon: '💕', color: '#ff6b6b', description: '사랑과 관계에 관한 해석' },
                { code: 'career', name: '직장/일', icon: '💼', color: '#4ecdc4', description: '직장과 업무에 관한 해석' },
                { code: 'daily', name: '오늘의 운세', icon: '☀️', color: '#45b7d1', description: '오늘 하루의 전반적인 운세' },
                { code: 'health', name: '건강', icon: '🌿', color: '#96ceb4', description: '건강과 웰빙에 관한 해석' },
                { code: 'money', name: '금전', icon: '💰', color: '#feca57', description: '재정과 돈에 관한 해석' },
                { code: 'family', name: '가족', icon: '🏠', color: '#ff9ff3', description: '가족 관계에 관한 해석' },
                { code: 'study', name: '학업', icon: '📚', color: '#54a0ff', description: '공부와 학습에 관한 해석' },
                { code: 'travel', name: '여행', icon: '✈️', color: '#5f27cd', description: '여행과 이동에 관한 해석' }
            ]
        };
    },
    template: `
        <div class="section purpose-selector">
            <h2>🔮 리딩 목적을 선택하세요</h2>
            <p class="text-center mb-3">어떤 분야에 대해 궁금한가요?</p>
            
            <div class="purpose-grid">
                <div 
                    v-for="purpose in purposes" 
                    :key="purpose.code"
                    class="purpose-item"
                    :class="{ 'selected': selectedPurpose === purpose.code }"
                    :style="{ borderColor: purpose.color }"
                    @click="$emit('purpose-selected', purpose.code)">
                    
                    <div class="purpose-icon">{{ purpose.icon }}</div>
                    <div class="purpose-name">{{ purpose.name }}</div>
                    <div class="purpose-description">{{ purpose.description }}</div>
                    
                    <div v-if="selectedPurpose === purpose.code" class="selected-indicator">
                        ✓ 선택됨
                    </div>
                </div>
            </div>
            
            <div v-if="selectedPurpose" class="selected-purpose-info">
                <h3>선택된 목적: {{ getSelectedPurposeName() }}</h3>
                <p>{{ getSelectedPurposeDescription() }}</p>
            </div>
        </div>
    `,
    methods: {
        getSelectedPurposeName() {
            const purpose = this.purposes.find(p => p.code === this.selectedPurpose);
            return purpose ? purpose.name : '';
        },
        
        getSelectedPurposeDescription() {
            const purpose = this.purposes.find(p => p.code === this.selectedPurpose);
            return purpose ? purpose.description : '';
        }
    }
};

// Vue 컴포넌트 등록
if (typeof Vue !== 'undefined') {
    Vue.createApp({}).component('purpose-selector', PurposeSelector);
}
