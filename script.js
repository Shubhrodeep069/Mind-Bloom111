 // Application Data and State
        const appState = {
            currentMoodScore: 0,
            dailyMoods: [],
            checkinHistory: [],
            currentTab: 'checkin',
            appStarted: false,
            favoriteAffirmations: [],
            goals: [],
            drawings: []
        };
        // Add to your existing appState or as new variables
let colorTherapyHistory = [];
let writingEntries = [];
let currentMoodColor = '#EF4444';
let filledShapes = [];
let writingTimer = null;
let writingStartTime = null;
let writingTimerInterval = null;

        // ========== NEW FEATURE 1: Daily Affirmations ==========
        const affirmations = [
            "I am enough exactly as I am",
            "My feelings are valid and important",
            "I am growing at my own pace",
            "I choose peace over perfection",
            "I am worthy of love and kindness",
            "My challenges are helping me grow",
            "I trust my journey",
            "I am allowed to rest",
            "My heart knows its own way",
            "I am stronger than I think",
            "Every breath is a new beginning",
            "I am rooted in my own worth",
            "My presence matters",
            "I embrace my perfectly imperfect self",
            "I am the gardener of my own peace"
        ];

        let currentAffirmation = '';
        let affirmationCount = 0;
        let favoriteAffirmations = JSON.parse(localStorage.getItem('mindbloom_favorite_affirmations')) || [];

        function loadRandomAffirmation() {
            const randomIndex = Math.floor(Math.random() * affirmations.length);
            currentAffirmation = affirmations[randomIndex];
            document.getElementById('affirmationText').textContent = `"${currentAffirmation}"`;

            // Check if this is a favorite
            const starBtn = document.getElementById('favoriteAffirmation');
            const isFavorite = favoriteAffirmations.includes(currentAffirmation);
            starBtn.classList.toggle('favorited', isFavorite);
            starBtn.style.color = isFavorite ? '#F59E0B' : '#6B7280';

            // Update count
            affirmationCount++;
            document.getElementById('affirmationCount').textContent = affirmationCount;
        }

        function speakAffirmation() {
            if ('speechSynthesis' in window && currentAffirmation) {
                const speech = new SpeechSynthesisUtterance(currentAffirmation);
                speech.rate = 0.9;
                speech.pitch = 1;
                speech.volume = 1;
                speech.lang = 'en-US';
                window.speechSynthesis.speak(speech);
            }
        }

        function toggleFavoriteAffirmation() {
            const index = favoriteAffirmations.indexOf(currentAffirmation);
            const starBtn = document.getElementById('favoriteAffirmation');

            if (index === -1) {
                // Add to favorites
                favoriteAffirmations.push(currentAffirmation);
                starBtn.classList.add('favorited');
                starBtn.style.color = '#F59E0B';

                // Show confirmation
                starBtn.classList.add('animate__animated', 'animate__bounce');
                setTimeout(() => {
                    starBtn.classList.remove('animate__animated', 'animate__bounce');
                }, 1000);
            } else {
                // Remove from favorites
                favoriteAffirmations.splice(index, 1);
                starBtn.classList.remove('favorited');
                starBtn.style.color = '#6B7280';
            }

            // Save to localStorage
            localStorage.setItem('mindbloom_favorite_affirmations', JSON.stringify(favoriteAffirmations));
        }

        // ========== NEW FEATURE 2: Breathing Visualizer ==========
        let breathingInterval;
        let isBreathing = false;
        let breathPhase = 'inhale'; // inhale, hold, exhale
        let breathTimer = 0;
        let totalTime = 0;

        const breathingPatterns = {
            '4-7-8': { inhale: 4, hold: 7, exhale: 8 },
            'box': { inhale: 4, hold: 4, exhale: 4, hold2: 4 },
            'calm': { inhale: 5, hold: 0, exhale: 5 }
        };

        let currentPattern = '4-7-8';

        function startBreathingExercise() {
            if (isBreathing) return;

            isBreathing = true;
            breathTimer = 0;
            totalTime = 0;
            breathPhase = 'inhale';

            const circle = document.getElementById('breathingCircle');
            const text = document.getElementById('breathingText');
            const instruction = document.getElementById('breathingInstruction');
            const timer = document.getElementById('breathTimer');
            const startBtn = document.getElementById('startBreathing');
            const stopBtn = document.getElementById('stopBreathing');

            circle.classList.add('breathing-in');
            text.textContent = 'Breathe In';
            instruction.textContent = 'Inhale slowly through your nose';
            startBtn.style.display = 'none';
            stopBtn.style.display = 'inline-flex';

            breathingInterval = setInterval(() => {
                breathTimer++;
                totalTime++;

                // Update timer display
                const minutes = Math.floor(totalTime / 60);
                const seconds = totalTime % 60;
                timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                const pattern = breathingPatterns[currentPattern];

                // Check for phase changes
                if (breathPhase === 'inhale' && breathTimer >= pattern.inhale) {
                    breathPhase = pattern.hold ? 'hold' : 'exhale';
                    breathTimer = 0;

                    if (pattern.hold) {
                        circle.classList.remove('breathing-in');
                        text.textContent = 'Hold';
                        instruction.textContent = 'Hold your breath gently';
                    } else {
                        circle.classList.remove('breathing-in');
                        circle.classList.add('breathing-out');
                        text.textContent = 'Breathe Out';
                        instruction.textContent = 'Exhale slowly through your mouth';
                    }
                } else if (breathPhase === 'hold' && breathTimer >= pattern.hold) {
                    breathPhase = 'exhale';
                    breathTimer = 0;

                    circle.classList.remove('breathing-in');
                    circle.classList.add('breathing-out');
                    text.textContent = 'Breathe Out';
                    instruction.textContent = 'Exhale slowly through your mouth';
                } else if (breathPhase === 'exhale' && breathTimer >= pattern.exhale) {
                    breathPhase = 'inhale';
                    breathTimer = 0;

                    circle.classList.remove('breathing-out');
                    circle.classList.add('breathing-in');
                    text.textContent = 'Breathe In';
                    instruction.textContent = 'Inhale slowly through your nose';
                }

            }, 1000); // Update every second
        }

        function stopBreathingExercise() {
            if (!isBreathing) return;

            isBreathing = false;
            clearInterval(breathingInterval);

            const circle = document.getElementById('breathingCircle');
            const text = document.getElementById('breathingText');
            const startBtn = document.getElementById('startBreathing');
            const stopBtn = document.getElementById('stopBreathing');

            circle.classList.remove('breathing-in', 'breathing-out');
            text.textContent = 'Ready';
            startBtn.style.display = 'inline-flex';
            stopBtn.style.display = 'none';
        }

        function resetBreathingExercise() {
            stopBreathingExercise();
            document.getElementById('breathTimer').textContent = '0:00';
            document.getElementById('breathingInstruction').textContent = 'Press start to begin breathing exercise';
        }

        // ========== NEW FEATURE 3: Goal Tracking ==========
        let goals = JSON.parse(localStorage.getItem('mindbloom_goals')) || [
            { id: 1, title: "Daily Mindfulness", description: "Practice 5 minutes of mindfulness each day", target: 30, current: 0, unit: "days", category: "mindfulness" },
            { id: 2, title: "Gratitude Journal", description: "Write 3 things I'm grateful for daily", target: 21, current: 0, unit: "days", category: "journaling" },
            { id: 3, title: "Digital Detox", description: "Reduce screen time before bed", target: 14, current: 0, unit: "nights", category: "habits" }
        ];

        function renderGoals() {
            const goalsGrid = document.getElementById('goalsGrid');
            goalsGrid.innerHTML = '';

            goals.forEach(goal => {
                const progress = (goal.current / goal.target) * 100;
                const goalCard = document.createElement('div');
                goalCard.className = 'goal-card';
                goalCard.id = `goal-${goal.id}`;
                goalCard.innerHTML = `
            <div class="goal-header">
                <div class="goal-title">${goal.title}</div>
                <div style="color: var(--primary); font-weight: 600;">${goal.current}/${goal.target} ${goal.unit}</div>
            </div>
            <p style="color: var(--gray); font-size: 14px; margin-bottom: 15px;">${goal.description}</p>
            <div class="goal-progress">
                <div class="goal-progress-bar" style="width: ${progress}%"></div>
            </div>
            <div class="goal-stats">
                <span>${Math.round(progress)}% complete</span>
                <span>${goal.target - goal.current} ${goal.unit} left</span>
            </div>
            <div class="goal-actions">
                <button class="btn btn-outline btn-small increment-goal" data-id="${goal.id}">
                    <i class="fas fa-plus"></i> Add ${goal.unit.slice(0, -1)}
                </button>
                <button class="btn btn-outline btn-small delete-goal" data-id="${goal.id}" style="border-color: var(--danger); color: var(--danger);">
                    <i class="fas fa-trash-alt"></i> Delete
                </button>
            </div>
        `;
                goalsGrid.appendChild(goalCard);
            });

            // Add event listeners for increment buttons
            document.querySelectorAll('.increment-goal').forEach(btn => {
                btn.addEventListener('click', function () {
                    const goalId = parseInt(this.getAttribute('data-id'));
                    const goal = goals.find(g => g.id === goalId);
                    if (goal && goal.current < goal.target) {
                        goal.current++;
                        saveGoals();
                        renderGoals();

                        // Celebrate if completed
                        if (goal.current === goal.target) {
                            celebrateGoalCompletion(goal.title);
                        }
                    }
                });
            });

            // Add event listeners for delete buttons
            document.querySelectorAll('.delete-goal').forEach(btn => {
                btn.addEventListener('click', function () {
                    const goalId = parseInt(this.getAttribute('data-id'));
                    deleteGoal(goalId);
                });
            });
        }

        function saveGoals() {
            localStorage.setItem('mindbloom_goals', JSON.stringify(goals));
        }

        function celebrateGoalCompletion(goalTitle) {
            const celebration = document.createElement('div');
            celebration.className = 'affirmations-section';
            celebration.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1000;
                padding: 30px;
                text-align: center;
                max-width: 400px;
                animation: fadeIn 0.5s;
            `;
            celebration.innerHTML = `
                <h3 style="color: var(--success); margin-bottom: 15px;">🎉 Goal Achieved!</h3>
                <p>You've successfully completed: <strong>${goalTitle}</strong></p>
                <p style="margin: 15px 0; font-size: 18px; color: var(--primary);">Celebrate this moment! 🎊</p>
                <button class="btn btn-primary" id="closeCelebration" style="margin-top: 20px;">
                    Continue
                </button>
            `;

            document.body.appendChild(celebration);

            document.getElementById('closeCelebration').addEventListener('click', function () {
                celebration.remove();
            });

            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (document.body.contains(celebration)) {
                    celebration.remove();
                }
            }, 5000);
        }


        function deleteGoal(goalId) {
            // Find the goal to get its title for confirmation
            const goalToDelete = goals.find(g => g.id === goalId);

            if (!goalToDelete) return;

            // Create a custom confirmation modal
            const confirmationModal = document.createElement('div');
            confirmationModal.className = 'goal-delete-modal';
            confirmationModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;

            confirmationModal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: var(--border-radius); max-width: 400px; width: 90%; box-shadow: var(--shadow-hover);">
            <h3 style="color: var(--danger); margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-exclamation-triangle"></i> Delete Goal
            </h3>
            <p style="margin-bottom: 20px; color: var(--dark);">
                Are you sure you want to delete the goal <strong>"${goalToDelete.title}"</strong>?
                This action cannot be undone.
            </p>
            
            <div style="display: flex; gap: 15px; margin-top: 25px;">
                <button class="btn" id="cancelDelete" style="flex: 1; background: var(--gray-light); color: var(--dark);">
                    Cancel
                </button>
                <button class="btn" id="confirmDelete" style="flex: 1; background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); color: white;">
                    <i class="fas fa-trash-alt"></i> Delete Permanently
                </button>
            </div>
        </div>
    `;

            document.body.appendChild(confirmationModal);

            // Add event listeners for modal buttons
            document.getElementById('cancelDelete').addEventListener('click', function () {
                confirmationModal.remove();
            });

            document.getElementById('confirmDelete').addEventListener('click', function () {
                // Remove the goal from the array
                const goalIndex = goals.findIndex(g => g.id === goalId);
                if (goalIndex !== -1) {
                    // Add animation to the goal card before removing
                    const goalCard = document.getElementById(`goal-${goalId}`);
                    if (goalCard) {
                        goalCard.classList.add('animate__animated', 'animate__fadeOutLeft');
                        setTimeout(() => {
                            // Remove goal from array
                            goals.splice(goalIndex, 1);
                            saveGoals();
                            renderGoals();
                            confirmationModal.remove();

                            // Show success message
                            showDeleteSuccessMessage(goalToDelete.title);
                        }, 500);
                    } else {
                        goals.splice(goalIndex, 1);
                        saveGoals();
                        renderGoals();
                        confirmationModal.remove();
                        showDeleteSuccessMessage(goalToDelete.title);
                    }
                }
            });

            // Close modal when clicking outside
            confirmationModal.addEventListener('click', function (e) {
                if (e.target === confirmationModal) {
                    confirmationModal.remove();
                }
            });
        }


        // Function to delete all goals
        function deleteAllGoals() {
            if (goals.length === 0) {
                alert("You don't have any goals to delete.");
                return;
            }

            if (confirm(`Are you sure you want to delete all ${goals.length} goals? This action cannot be undone.`)) {
                // Animate out all goal cards
                document.querySelectorAll('.goal-card').forEach(card => {
                    card.classList.add('animate__animated', 'animate__fadeOutDown');
                });

                setTimeout(() => {
                    // Clear goals array
                    goals = [];
                    saveGoals();
                    renderGoals();

                    // Show success message
                    showDeleteSuccessMessage(`All ${goals.length} goals`);
                }, 500);
            }
        }

        // Add to your initializeEventListeners() function:
        document.getElementById('deleteAllGoals').addEventListener('click', deleteAllGoals);

        function showDeleteSuccessMessage(goalTitle) {
            // Create a temporary success message
            const successMessage = document.createElement('div');
            successMessage.className = 'delete-success-message';
            successMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10B981 0%, #059669 100%);
        color: white;
        padding: 15px 25px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-hover);
        z-index: 2001;
        animation: slideInRight 0.5s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;

            successMessage.innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 20px;"></i>
        <span>Goal "${goalTitle}" deleted successfully</span>
    `;

            document.body.appendChild(successMessage);

            // Remove after 3 seconds
            setTimeout(() => {
                successMessage.style.animation = 'slideOutRight 0.5s ease';
                setTimeout(() => {
                    if (document.body.contains(successMessage)) {
                        successMessage.remove();
                    }
                }, 500);
            }, 3000);
        }

        // ========== NEW FEATURE 4: Creative Expression Tools ==========
        let isDrawing = false;
        let currentColor = '#EF4444';
        let canvas, ctx;

        function setupDrawingCanvas() {
            canvas = document.getElementById('drawingCanvas');
            ctx = canvas.getContext('2d');

            // Set canvas background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Set up drawing
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mouseout', stopDrawing);

            // Touch events for mobile
            canvas.addEventListener('touchstart', function (e) {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('mousedown', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                canvas.dispatchEvent(mouseEvent);
            });

            canvas.addEventListener('touchmove', function (e) {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                canvas.dispatchEvent(mouseEvent);
            });

            canvas.addEventListener('touchend', function (e) {
                e.preventDefault();
                const mouseEvent = new MouseEvent('mouseup', {});
                canvas.dispatchEvent(mouseEvent);
            });

            // Color picker
            document.querySelectorAll('.color-option').forEach(color => {
                color.addEventListener('click', function () {
                    document.querySelectorAll('.color-option').forEach(c => c.classList.remove('selected'));
                    this.classList.add('selected');
                    currentColor = this.getAttribute('data-color');
                });
            });
        }

        function startDrawing(e) {
            isDrawing = true;
            draw(e); // Draw initial point
        }

        function draw(e) {
            if (!isDrawing) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.strokeStyle = currentColor;

            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }

        function stopDrawing() {
            isDrawing = false;
            ctx.beginPath();
        }

        function clearCanvas() {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function saveDrawing() {
            const dataURL = canvas.toDataURL('image/png');
            const drawings = JSON.parse(localStorage.getItem('mindbloom_drawings')) || [];
            drawings.push({
                data: dataURL,
                date: new Date().toISOString(),
                mood: appState.currentMoodScore || 'unknown'
            });
            localStorage.setItem('mindbloom_drawings', JSON.stringify(drawings));

            alert('Drawing saved to your local gallery!');
        }

        // ========== EXISTING CODE ==========
        const moodQuestions = [
{ id: 1, text: "Did you wake up feeling rested and renewed today?" },  
{ id: 2, text: "Were you able to stay present with your tasks today without mental wandering?" },  
{ id: 3, text: "Did any moments of joy or contentment naturally arise today?" },  
{ id: 4, text: "Did you feel a sense of connection or support in your relationships today?" },  
{ id: 5, text: "Did you experience feelings of peace and ease in your body today?" },  
{ id: 6, text: "Did you feel an inner motivation to engage with your daily rhythms today?" },  
{ id: 7, text: "Were you able to navigate your responsibilities with a sense of flow today?" }
        ];

        const responseOptions = [
  { "value": 1, "label": "Not at all", "text": "Did not experience this today" },
  { "value": 2, "label": "Slightly", "text": "Felt it only a little" },
  { "value": 3, "label": "Moderately", "text": "Felt it to a fair degree" },
  { "value": 4, "label": "Very much", "text": "Felt it strongly today" },
  { "value": 5, "label": "Completely", "text": "Felt it fully and clearly" }
];

        const moodCategories = [
            { min: 30, max: 35, emoji: "🌸", name: "Blooming", description: "Your inner garden appears to be flourishing with good energy and emotional balance.", color: "#10B981" },
            { min: 25, max: 29, emoji: "🌿", name: "Gentle Growth", description: "Your garden is growing at a gentle pace. Consider adding nourishing practices to support your natural rhythm.", color: "#34D399" },
            { min: 20, max: 24, emoji: "🍂", name: "Seasonal Shift", description: "You may be experiencing a natural seasonal shift within. This is a good time for self-compassion and gentle care.", color: "#F59E0B" },
            { min: 7, max: 19, emoji: "🌧️", name: "Needing Nourishment", description: "Your garden appears to need extra nourishment and care. Please consider reaching out to supportive gardeners in your life.", color: "#EF4444" }
        ];

        const suggestions = {
            blooming: [
                { title: "Share Your Blooms", text: "Your flourishing energy can nourish others. Consider checking in on someone who might appreciate connection.", icon: "fas fa-hands-helping" },
                { title: "Cultivate Gratitude", text: "Start a gratitude journal to document what's blooming in your life right now.", icon: "fas fa-book-heart" },
                { title: "Creative Expression", text: "Channel your balanced energy into creative expression - art, writing, or music.", icon: "fas fa-palette" }
            ],
            gentleGrowth: [
                { title: "Mindful Movement", text: "Try gentle yoga or a mindful walk in nature to harmonize body and mind.", icon: "fas fa-walking" },
                { title: "Nourishing Breaks", text: "Incorporate 5-minute mindful breaks to breathe and reset throughout your day.", icon: "fas fa-clock" },
                { title: "Digital Sunset", text: "Create a calming evening routine with reduced screen time before bed.", icon: "fas fa-moon" }
            ],
            seasonalShift: [
                { title: "Compassionate Breathing", text: "Practice the 4-7-8 technique: inhale for 4, hold for 7, exhale for 8 seconds.", icon: "fas fa-wind" },
                { title: "Reach for Support", text: "Connect with a trusted friend or family member. Shared burdens feel lighter.", icon: "fas fa-comment-medical" },
                { title: "Gentle Boundaries", text: "Consider what responsibilities might be adjusted to create more breathing room.", icon: "fas fa-shield-alt" }
            ],
            needingNourishment: [
                { title: "Sacred Rest", text: "Give yourself permission to rest without judgment. Even small pauses can be restorative.", icon: "fas fa-bed" },
                { title: "Professional Gardening", text: "Consider speaking with a therapist or counselor for supportive guidance.", icon: "fas fa-user-md" },
                { title: "Safety Garden Plan", text: "Identify 2-3 supportive people you can contact when feeling overwhelmed.", icon: "fas fa-life-ring" },
                { title: "Immediate Support", text: "If you're having thoughts of harming yourself, please reach out to a crisis line immediately.", icon: "fas fa-phone-alt" }
            ]
        };

        const helplines = [
            { country: "United States", number: "988 or 1-800-273-8255", text: "National Suicide Prevention Lifeline" },
            { country: "United Kingdom", number: "116 123", text: "Samaritans" },
            { country: "Canada", number: "1-833-456-4566", text: "Canada Suicide Prevention Service" },
            { country: "Australia", number: "13 11 14", text: "Lifeline Australia" },
            { country: "International", number: "https://findahelpline.com", text: "Find a helpline in your country" }
        ];

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function () {
            initializeWelcomeScreen();
            loadSavedData();
        });

        function initializeWelcomeScreen() {
            document.getElementById('startJourney').addEventListener('click', function () {
                startAppWithAnimation('checkin');
            });

            document.getElementById('exploreFirst').addEventListener('click', function () {
                startAppWithAnimation('tools');
            });

            document.getElementById('learnMore').addEventListener('click', function (e) {
                e.preventDefault();
                startAppWithAnimation('privacy');
            });
        }

        function startAppWithAnimation(initialTab) {
            const welcomeScreen = document.getElementById('welcomeScreen');
            welcomeScreen.classList.add('hidden');

            setTimeout(() => {
                document.getElementById('mainApp').style.display = 'block';
                welcomeScreen.style.display = 'none';

                loadSavedData();
                initializeApp();
                document.querySelector(`.tab[data-tab="${initialTab}"]`).click();
                appState.appStarted = true;
            }, 800);
        }

        function loadSavedData() {
            const savedMoods = localStorage.getItem('mindbloom_daily_moods');
            const savedCheckins = localStorage.getItem('mindbloom_checkin_history');
            const savedGoals = localStorage.getItem('mindbloom_goals');

            if (savedMoods) appState.dailyMoods = JSON.parse(savedMoods);
            if (savedCheckins) appState.checkinHistory = JSON.parse(savedCheckins);
            if (savedGoals) goals = JSON.parse(savedGoals);
        }

        function saveData() {
            localStorage.setItem('mindbloom_daily_moods', JSON.stringify(appState.dailyMoods));
            localStorage.setItem('mindbloom_checkin_history', JSON.stringify(appState.checkinHistory));
        }

        function initializeApp() {
    initializeQuestions();
    initializeTabs();
    initializeEventListeners();
    updateHistoryUI();
    loadRandomAffirmation();
    renderGoals();
    setupDrawingCanvas();
    
    // Setup new features
    setupNewFeatures();
    
    // Load saved data for new features
    colorTherapyHistory = JSON.parse(localStorage.getItem('mindbloom_color_therapy')) || [];
    writingEntries = JSON.parse(localStorage.getItem('mindbloom_writing_entries')) || [];
}

        function setupNewFeatures() {
            // Affirmations
            document.getElementById('newAffirmation').addEventListener('click', loadRandomAffirmation);
            document.getElementById('speakAffirmation').addEventListener('click', speakAffirmation);
            document.getElementById('favoriteAffirmation').addEventListener('click', toggleFavoriteAffirmation);

            // Breathing Visualizer
            document.getElementById('startBreathing').addEventListener('click', startBreathingExercise);
            document.getElementById('stopBreathing').addEventListener('click', stopBreathingExercise);
            document.getElementById('resetBreathing').addEventListener('click', resetBreathingExercise);

            // Creative Tools
            // ========== COLOR THERAPY FUNCTIONS ==========
let currentMoodColor = '#EF4444';
let filledShapes = [];
let colorTherapyHistory = JSON.parse(localStorage.getItem('mindbloom_color_therapy')) || [];

function setupColorTherapy() {
    // Initialize color selection
    document.querySelectorAll('.mood-color-option').forEach(color => {
        color.addEventListener('click', function() {
            document.querySelectorAll('.mood-color-option').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            currentMoodColor = this.getAttribute('data-color');
            
            // Add visual feedback
            this.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                this.classList.remove('animate__animated', 'animate__pulse');
            }, 500);
        });
    });
    
    // Initialize shape filling
    document.querySelectorAll('.therapy-shape').forEach(shape => {
        shape.addEventListener('click', function() {
            const shapeType = this.getAttribute('data-shape');
            fillShape(shapeType, currentMoodColor);
        });
    });
    
    // Setup buttons
    document.getElementById('saveColorTherapy').addEventListener('click', saveColorTherapy);
    document.getElementById('clearColorTherapy').addEventListener('click', clearColorTherapy);
    document.getElementById('exportColorTherapy').addEventListener('click', exportColorTherapy);
    document.getElementById('closeColorTherapy').addEventListener('click', function() {
        document.getElementById('colorTherapyContainer').style.display = 'none';
    });
    
    // Load history if exists
    if (colorTherapyHistory.length > 0) {
        document.getElementById('therapyHistory').style.display = 'block';
        renderColorTherapyHistory();
    }
}

function fillShape(shapeType, color) {
    // Add to filled shapes array
    filledShapes.push({ shape: shapeType, color: color });
    
    // Create visual element in preview
    const preview = document.getElementById('colorTherapyPreview');
    const shapeItem = document.createElement('div');
    shapeItem.className = 'color-therapy-item animate__animated animate__bounceIn';
    shapeItem.style.backgroundColor = color;
    
    // Set shape content based on type
    const shapeIcons = {
        circle: '●',
        square: '■',
        triangle: '▲',
        heart: '❤️',
        cloud: '☁️',
        spiral: '🌀'
    };
    
    shapeItem.innerHTML = shapeIcons[shapeType] || '●';
    preview.appendChild(shapeItem);
    
    // Update the shape grid to show it's filled
    const shapeElement = document.querySelector(`.therapy-shape[data-shape="${shapeType}"]`);
    shapeElement.style.backgroundColor = color;
    shapeElement.style.borderColor = color;
    shapeElement.classList.add('filled');
    shapeElement.style.color = getContrastColor(color);
    
    // Visual feedback
    shapeElement.classList.add('animate__animated', 'animate__bounce');
    setTimeout(() => {
        shapeElement.classList.remove('animate__animated', 'animate__bounce');
    }, 1000);
    
    // Limit to 20 shapes
    if (filledShapes.length > 20) {
        const oldestShape = preview.firstChild;
        if (oldestShape) {
            oldestShape.remove();
            filledShapes.shift();
        }
    }
}

function getContrastColor(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white based on luminance
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

function saveColorTherapy() {
    if (filledShapes.length === 0) {
        alert('Create something first! Fill at least one shape with color.');
        return;
    }
    
    const therapySession = {
        id: Date.now(),
        date: new Date().toISOString(),
        shapes: [...filledShapes],
        moodScore: appState.currentMoodScore || 0,
        colors: [...new Set(filledShapes.map(s => s.color))]
    };
    
    colorTherapyHistory.push(therapySession);
    localStorage.setItem('mindbloom_color_therapy', JSON.stringify(colorTherapyHistory));
    
    // Show success message
    showSuccessMessage('Color therapy session saved!', 'var(--success)');
    
    // Update history display
    document.getElementById('therapyHistory').style.display = 'block';
    renderColorTherapyHistory();
    
    // Add celebration effect
    createConfetti();
}

function clearColorTherapy() {
    if (filledShapes.length === 0) return;
    
    if (confirm('Clear all filled shapes?')) {
        filledShapes = [];
        document.getElementById('colorTherapyPreview').innerHTML = 
            '<p>Select a color and click a shape to fill it</p>';
        
        // Reset all shapes in grid
        document.querySelectorAll('.therapy-shape').forEach(shape => {
            shape.style.backgroundColor = '';
            shape.style.borderColor = '';
            shape.style.color = '';
            shape.classList.remove('filled');
        });
    }
}

function exportColorTherapy() {
    if (filledShapes.length === 0) {
        alert('Nothing to export! Fill some shapes first.');
        return;
    }
    
    // Create a canvas representation
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    // Draw background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw title
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 24px Poppins';
    ctx.fillText('My Color Therapy Session', 50, 50);
    
    ctx.font = '16px Inter';
    ctx.fillStyle = '#6B7280';
    ctx.fillText(new Date().toLocaleDateString(), 50, 80);
    
    // Draw shapes
    const shapeDrawers = {
        circle: (ctx, x, y, size, color) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, size/2, 0, Math.PI * 2);
            ctx.fill();
        },
        square: (ctx, x, y, size, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(x - size/2, y - size/2, size, size);
        },
        triangle: (ctx, x, y, size, color) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x, y - size/2);
            ctx.lineTo(x - size/2, y + size/2);
            ctx.lineTo(x + size/2, y + size/2);
            ctx.closePath();
            ctx.fill();
        },
        heart: (ctx, x, y, size, color) => {
            ctx.fillStyle = color;
            ctx.font = `${size}px Arial`;
            ctx.fillText('❤️', x - size/2, y + size/2);
        },
        cloud: (ctx, x, y, size, color) => {
            ctx.fillStyle = color;
            ctx.font = `${size}px Arial`;
            ctx.fillText('☁️', x - size/2, y + size/2);
        },
        spiral: (ctx, x, y, size, color) => {
            ctx.fillStyle = color;
            ctx.font = `${size}px Arial`;
            ctx.fillText('🌀', x - size/2, y + size/2);
        }
    };
    
    // Draw each shape
    filledShapes.forEach((shapeObj, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        const x = 150 + col * 150;
        const y = 150 + row * 150;
        const size = 80;
        
        if (shapeDrawers[shapeObj.shape]) {
            shapeDrawers[shapeObj.shape](ctx, x, y, size, shapeObj.color);
        }
    });
    
    // Convert to image and download
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `color-therapy-${new Date().toISOString().split('T')[0]}.png`;
        a.click();
        URL.revokeObjectURL(url);
    });
    
    showSuccessMessage('Image exported successfully!', 'var(--primary)');
}

function renderColorTherapyHistory() {
    const historyGrid = document.getElementById('therapyHistoryGrid');
    historyGrid.innerHTML = '';
    
    // Show last 6 sessions
    const recentSessions = colorTherapyHistory.slice(-6).reverse();
    
    recentSessions.forEach(session => {
        const date = new Date(session.date);
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div style="font-size: 12px; color: var(--gray);">
                ${date.toLocaleDateString()}
            </div>
            <div style="font-weight: 500; margin: 5px 0;">
                ${session.shapes.length} shapes
            </div>
            <div class="history-colors">
                ${session.colors.slice(0, 5).map(color => 
                    `<div class="history-color" style="background-color: ${color};"></div>`
                ).join('')}
            </div>
            <div style="font-size: 12px; color: var(--gray); margin-top: 5px;">
                Click to view
            </div>
        `;
        
        historyItem.addEventListener('click', () => {
            loadColorTherapySession(session);
        });
        
        historyGrid.appendChild(historyItem);
    });
}

function loadColorTherapySession(session) {
    // Clear current
    clearColorTherapy();
    
    // Load session shapes
    session.shapes.forEach(shapeObj => {
        fillShape(shapeObj.shape, shapeObj.color);
    });
    
    showSuccessMessage('Session loaded!', 'var(--primary)');
}

// ========== FREE WRITING FUNCTIONS ==========
let writingEntries = JSON.parse(localStorage.getItem('mindbloom_writing_entries')) || [];
let writingTimer = null;
let writingStartTime = null;
let writingTimerInterval = null;
let wordCount = 0;
let charCount = 0;

function setupFreeWriting() {
    // Initialize text area
    const textArea = document.getElementById('freeWritingText');
    
    textArea.addEventListener('input', function() {
        updateWritingStats(this.value);
    });
    
    // Initialize prompts
    document.querySelectorAll('.prompt-option').forEach(prompt => {
        prompt.addEventListener('click', function() {
            document.querySelectorAll('.prompt-option').forEach(p => p.classList.remove('selected'));
            this.classList.add('selected');
            
            const promptText = this.getAttribute('data-prompt');
            if (promptText) {
                textArea.value = promptText + ' ';
                textArea.focus();
                updateWritingStats(textArea.value);
            }
        });
    });
    
    // Initialize buttons
    document.getElementById('saveWriting').addEventListener('click', saveWritingEntry);
    document.getElementById('clearWriting').addEventListener('click', clearWriting);
    document.getElementById('exportWriting').addEventListener('click', exportWriting);
    document.getElementById('closeWriting').addEventListener('click', function() {
        document.getElementById('freeWritingContainer').style.display = 'none';
    });
    
    // Initialize mode toggles
    document.getElementById('focusMode').addEventListener('click', toggleFocusMode);
    document.getElementById('darkMode').addEventListener('click', toggleDarkMode);
    document.getElementById('startTimer').addEventListener('click', startWritingTimer);
    document.getElementById('stopTimer').addEventListener('click', stopWritingTimer);
    
    // Load previous entries
    renderWritingJournal();
}

function updateWritingStats(text) {
    // Word count
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    wordCount = words.length;
    
    // Character count
    charCount = text.length;
    
    // Update display
    document.getElementById('wordCount').textContent = `${wordCount} words`;
    document.getElementById('charCount').textContent = `${charCount} characters`;
    
    // Typewriter sound effect
    if (document.getElementById('typewriterSound').checked && text.length > 0) {
        playTypewriterSound();
    }
}

function playTypewriterSound() {
    // Create a subtle typing sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Fallback for browsers without Web Audio API
        console.log('Audio not supported');
    }
}

// function toggleFocusMode() {
//     const container = document.getElementById('freeWritingContainer');
//     const btn = document.getElementById('focusMode');
    
//     if (container.classList.contains('focus-mode')) {
//         container.classList.remove('focus-mode');
//         btn.innerHTML = '<i class="fas fa-eye"></i> Focus Mode';
//         btn.style.backgroundColor = '';
//     } else {
//         container.classList.add('focus-mode');
//         btn.innerHTML = '<i class="fas fa-eye-slash"></i> Exit Focus';
//         btn.style.backgroundColor = 'var(--primary)';
//         btn.style.color = 'white';
//     }
// }

// function toggleDarkMode() {
//     const container = document.getElementById('freeWritingContainer');
//     const btn = document.getElementById('darkMode');
    
//     if (container.classList.contains('dark-mode')) {
//         container.classList.remove('dark-mode');
//         btn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
//         btn.style.backgroundColor = '';
//     } else {
//         container.classList.add('dark-mode');
//         btn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
//         btn.style.backgroundColor = 'var(--dark)';
//         btn.style.color = 'white';
//     }
// }

function startWritingTimer() {
    if (writingTimerInterval) return;
    
    writingStartTime = Date.now();
    writingTimer = 5 * 60; // 5 minutes in seconds
    
    document.getElementById('startTimer').style.display = 'none';
    document.getElementById('stopTimer').style.display = 'inline-flex';
    
    writingTimerInterval = setInterval(() => {
        writingTimer--;
        
        const minutes = Math.floor(writingTimer / 60);
        const seconds = writingTimer % 60;
        document.getElementById('writingTime').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (writingTimer <= 0) {
            stopWritingTimer();
            showSuccessMessage('Time\'s up! Great writing session!', 'var(--success)');
        }
    }, 1000);
}

function stopWritingTimer() {
    if (writingTimerInterval) {
        clearInterval(writingTimerInterval);
        writingTimerInterval = null;
    }
    
    document.getElementById('startTimer').style.display = 'inline-flex';
    document.getElementById('stopTimer').style.display = 'none';
    document.getElementById('writingTime').textContent = '0:00';
}

function saveWritingEntry() {
    const text = document.getElementById('freeWritingText').value.trim();
    
    if (!text) {
        alert('Write something first!');
        return;
    }
    
    const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        text: text,
        wordCount: wordCount,
        charCount: charCount,
        mood: appState.currentMoodScore || 0,
        timeSpent: writingStartTime ? 
            Math.round((Date.now() - writingStartTime) / 1000) : 0
    };
    
    writingEntries.push(entry);
    localStorage.setItem('mindbloom_writing_entries', JSON.stringify(writingEntries));
    
    // Clear text area
    document.getElementById('freeWritingText').value = '';
    updateWritingStats('');
    
    // Show success with optional confetti
    showSuccessMessage('Entry saved to your journal!', 'var(--success)');
    
    if (document.getElementById('confettiEffect').checked) {
        createConfetti();
    }
    
    // Update journal display
    renderWritingJournal();
}

function clearWriting() {
    const text = document.getElementById('freeWritingText').value;
    
    if (!text.trim()) return;
    
    if (confirm('Clear all text? This cannot be undone.')) {
        document.getElementById('freeWritingText').value = '';
        updateWritingStats('');
    }
}

function exportWriting() {
    const text = document.getElementById('freeWritingText').value.trim();
    
    if (!text && writingEntries.length === 0) {
        alert('Nothing to export!');
        return;
    }
    
    let exportText = '=== MindBloom Free Writing Journal ===\n';
    exportText += `Exported: ${new Date().toLocaleDateString()}\n\n`;
    
    if (text) {
        exportText += '=== Current Entry ===\n';
        exportText += text + '\n\n';
    }
    
    if (writingEntries.length > 0) {
        exportText += '=== Previous Entries ===\n\n';
        writingEntries.slice(-10).reverse().forEach(entry => {
            const date = new Date(entry.date);
            exportText += `Date: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}\n`;
            exportText += `Words: ${entry.wordCount} | Characters: ${entry.charCount}\n`;
            exportText += `Mood Score: ${entry.mood}/35\n`;
            exportText += '---\n';
            exportText += entry.text + '\n\n';
        });
    }
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindbloom-journal-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    showSuccessMessage('Journal exported!', 'var(--primary)');
}

function renderWritingJournal() {
    const journalEntries = document.getElementById('journalEntries');
    journalEntries.innerHTML = '';
    
    if (writingEntries.length === 0) {
        journalEntries.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--gray);">
                <i class="fas fa-book" style="font-size: 48px; margin-bottom: 15px; opacity: 0.3;"></i>
                <p>Your writing journal is empty</p>
                <p style="font-size: 14px;">Start writing above to fill your journal</p>
            </div>
        `;
        return;
    }
    
    // Show last 6 entries
    const recentEntries = writingEntries.slice(-6).reverse();
    
    recentEntries.forEach(entry => {
        const date = new Date(entry.date);
        const preview = entry.text.length > 100 ? 
            entry.text.substring(0, 100) + '...' : entry.text;
        
        const entryElement = document.createElement('div');
        entryElement.className = 'journal-entry';
        entryElement.innerHTML = `
            <div style="font-weight: 600; font-size: 16px;">
                ${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
            <div class="entry-preview">
                ${preview}
            </div>
            <div class="entry-date">
                <i class="far fa-clock"></i>
                ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                • ${entry.wordCount} words
            </div>
        `;
        
        entryElement.addEventListener('click', () => {
            viewWritingEntry(entry);
        });
        
        journalEntries.appendChild(entryElement);
    });
}

function viewWritingEntry(entry) {
    const date = new Date(entry.date);
    const modal = document.createElement('div');
    modal.className = 'entry-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: var(--border-radius); max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="color: var(--dark);">
                    <i class="fas fa-book-open"></i> Journal Entry
                </h3>
                <button id="closeModal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--gray);">
                    &times;
                </button>
            </div>
            
            <div style="color: var(--gray); margin-bottom: 20px; font-size: 14px;">
                <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                    <span><i class="far fa-calendar"></i> ${date.toLocaleDateString()}</span>
                    <span><i class="far fa-clock"></i> ${date.toLocaleTimeString()}</span>
                    <span><i class="fas fa-font"></i> ${entry.wordCount} words</span>
                    <span><i class="fas fa-heartbeat"></i> Mood: ${entry.mood}/35</span>
                </div>
            </div>
            
            <div style="white-space: pre-wrap; line-height: 1.6; padding: 20px; background: var(--light); border-radius: var(--border-radius);">
                ${entry.text}
            </div>
            
            <div style="margin-top: 25px; display: flex; gap: 10px;">
                <button class="btn btn-outline btn-small" id="deleteEntry" style="border-color: var(--danger); color: var(--danger);">
                    <i class="fas fa-trash-alt"></i> Delete Entry
                </button>
                <button class="btn btn-primary btn-small" id="copyEntry">
                    <i class="fas fa-copy"></i> Copy Text
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners for modal
    document.getElementById('closeModal').addEventListener('click', () => {
        modal.remove();
    });
    
    document.getElementById('copyEntry').addEventListener('click', () => {
        navigator.clipboard.writeText(entry.text)
            .then(() => showSuccessMessage('Text copied to clipboard!', 'var(--success)'))
            .catch(() => alert('Failed to copy text'));
    });
    
    document.getElementById('deleteEntry').addEventListener('click', () => {
        if (confirm('Delete this journal entry permanently?')) {
            const index = writingEntries.findIndex(e => e.id === entry.id);
            if (index !== -1) {
                writingEntries.splice(index, 1);
                localStorage.setItem('mindbloom_writing_entries', JSON.stringify(writingEntries));
                modal.remove();
                renderWritingJournal();
                showSuccessMessage('Entry deleted', 'var(--danger)');
            }
        }
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ========== HELPER FUNCTIONS ==========
function showSuccessMessage(message, color) {
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color};
        color: white;
        padding: 15px 25px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-hover);
        z-index: 1001;
        animation: slideInRight 0.5s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    successMsg.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
        successMsg.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            if (document.body.contains(successMsg)) {
                successMsg.remove();
            }
        }, 500);
    }, 3000);
}

function createConfetti() {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            animation: confetti-fall ${Math.random() * 2 + 1}s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            if (document.body.contains(confetti)) {
                confetti.remove();
            }
        }, 2000);
    }
}

// ========== UPDATE THE TOOL CLICK HANDLER ==========
// Update the creative tools click handler in setupNewFeatures()
// Replace the existing handler with this:

document.querySelectorAll('.creative-tool').forEach(tool => {
    tool.addEventListener('click', function() {
        const toolType = this.getAttribute('data-tool');
        
        // Hide all containers first
        document.getElementById('drawingContainer').style.display = 'none';
        document.getElementById('colorTherapyContainer').style.display = 'none';
        document.getElementById('freeWritingContainer').style.display = 'none';
        
        if (toolType === 'draw') {
            document.getElementById('drawingContainer').style.display = 'block';
        } else if (toolType === 'color') {
            document.getElementById('colorTherapyContainer').style.display = 'block';
            // Initialize if not already done
            if (!window.colorTherapyInitialized) {
                setupColorTherapy();
                window.colorTherapyInitialized = true;
            }
        } else if (toolType === 'write') {
            document.getElementById('freeWritingContainer').style.display = 'block';
            // Initialize if not already done
            if (!window.writingInitialized) {
                setupFreeWriting();
                window.writingInitialized = true;
            }
        } else if (toolType === 'music') {
            alert('🎵 Soundscape feature coming soon!');
        }
        
        this.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            this.classList.remove('animate__animated', 'animate__pulse');
        }, 1000);
    });
});

            // Drawing controls
            document.getElementById('clearCanvas').addEventListener('click', clearCanvas);
            document.getElementById('saveDrawing').addEventListener('click', saveDrawing);
            document.getElementById('closeDrawing').addEventListener('click', function () {
                document.getElementById('drawingContainer').style.display = 'none';
            });

            // Goals
            document.getElementById('addGoalBtn').addEventListener('click', function () {
                const newGoal = {
                    id: Date.now(),
                    title: prompt('Enter goal title:', 'New Wellness Goal'),
                    description: prompt('Enter goal description:', ''),
                    target: parseInt(prompt('Target (number):', '30')),
                    current: 0,
                    unit: prompt('Unit (days, times, etc.):', 'days'),
                    category: 'custom'
                };

                if (newGoal.title && newGoal.description) {
                    goals.push(newGoal);
                    saveGoals();
                    renderGoals();
                }
            });
        }

        function initializeQuestions() {
            const container = document.getElementById('questionsContainer');
            container.innerHTML = '';

            moodQuestions.forEach((question, index) => {
                const questionElement = document.createElement('div');
                questionElement.className = 'question-card animate__animated';
                questionElement.style.animationDelay = `${index * 0.1}s`;
                questionElement.innerHTML = `
                    <div class="question-text">${question.text}</div>
                    <div class="options" data-question-id="${question.id}">
                        ${responseOptions.map(option => `
                            <div class="option" data-value="${option.value}">
                                ${option.label}
                                <span class="option-label">${option.text}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
                container.appendChild(questionElement);
            });

            document.querySelectorAll('.option').forEach(option => {
                option.addEventListener('click', function () {
                    const parent = this.parentElement;
                    parent.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                    this.classList.add('animate__animated', 'animate__pulse');
                    setTimeout(() => {
                        this.classList.remove('animate__animated', 'animate__pulse');
                    }, 1000);
                });
            });
        }

        function initializeTabs() {
            const tabs = document.querySelectorAll('.tab');
            const tabContents = document.querySelectorAll('.tab-content');

            tabs.forEach(tab => {
                tab.addEventListener('click', function () {
                    const tabId = this.getAttribute('data-tab');

                    tabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    this.classList.add('animate__animated', 'animate__pulse');
                    setTimeout(() => {
                        this.classList.remove('animate__animated', 'animate__pulse');
                    }, 1000);

                    tabContents.forEach(content => {
                        content.classList.remove('active');
                        if (content.id === tabId) {
                            content.classList.add('active');
                            content.classList.add('animate__animated', 'animate__fadeIn');
                            setTimeout(() => {
                                content.classList.remove('animate__animated', 'animate__fadeIn');
                            }, 1000);
                        }
                    });

                    appState.currentTab = tabId;

                    if (tabId === 'history') {
                        updateHistoryUI();
                    }
                });
            });
        }

        function initializeEventListeners() {
            document.getElementById('submitCheckin').addEventListener('click', calculateMoodScore);

            document.querySelectorAll('.emoji-option').forEach(emoji => {
                emoji.addEventListener('click', function () {
                    document.querySelectorAll('.emoji-option').forEach(e => e.classList.remove('selected'));
                    this.classList.add('selected');
                    this.classList.add('animate__animated', 'animate__bounce');
                    setTimeout(() => {
                        this.classList.remove('animate__animated', 'animate__bounce');
                    }, 1000);
                });
            });

            document.getElementById('saveDailyMood').addEventListener('click', saveDailyMood);
            document.getElementById('weekView').addEventListener('click', () => updateHistoryUI('week'));
            document.getElementById('monthView').addEventListener('click', () => updateHistoryUI('month'));
            document.getElementById('detailedView').addEventListener('click', () => updateHistoryUI('detailed'));
            document.getElementById('exportData').addEventListener('click', exportData);
            document.getElementById('clearHistory').addEventListener('click', clearHistory);
            document.getElementById('deleteAllData').addEventListener('click', deleteAllData);
            document.getElementById('checkinBtn').addEventListener('click', () => {
                document.querySelector('.tab[data-tab="checkin"]').click();
            });
            document.getElementById('privacyBtn').addEventListener('click', () => {
                document.querySelector('.tab[data-tab="privacy"]').click();
            });
        }

        // Rest of the existing functions (calculateMoodScore, displayMoodResult, saveDailyMood, updateHistoryUI, etc.)
        // ... [Keep all the existing functions from the previous version]
        // For brevity, I'm not repeating all existing functions here, but they should be included

        // Note: The existing functions from the previous version (calculateMoodScore, displayMoodResult, 
        // saveDailyMood, updateHistoryUI, updateStats, animateValueChange, exportData, clearHistory, deleteAllData)
        // should be included here as they were in your original code

        // Initialize breathing circle size
        document.addEventListener('DOMContentLoaded', function () {
            const circle = document.getElementById('breathingCircle');
            circle.style.width = '200px';
            circle.style.height = '200px';
        });



    
        // ========== EXISTING FUNCTIONS (from previous version) ==========

        function calculateMoodScore() {
            let totalScore = 0;
            let allAnswered = true;

            document.querySelectorAll('.options').forEach(optionGroup => {
                const selectedOption = optionGroup.querySelector('.option.selected');
                if (selectedOption) {
                    totalScore += parseInt(selectedOption.getAttribute('data-value'));
                } else {
                    allAnswered = false;
                }
            });

            if (!allAnswered) {
                document.querySelectorAll('.options').forEach(optionGroup => {
                    if (!optionGroup.querySelector('.option.selected')) {
                        optionGroup.parentElement.classList.add('animate__animated', 'animate__shakeX');
                        setTimeout(() => {
                            optionGroup.parentElement.classList.remove('animate__animated', 'animate__shakeX');
                        }, 1000);
                    }
                });
                return;
            }

            appState.currentMoodScore = totalScore;

            const checkin = {
                date: new Date().toISOString().split('T')[0],
                score: totalScore,
                timestamp: new Date().toISOString()
            };

            appState.checkinHistory.push(checkin);
            saveData();
            displayMoodResult(totalScore);
        }

        function displayMoodResult(score) {
            const resultSection = document.getElementById('resultSection');
            const suggestionsSection = document.getElementById('suggestionsSection');
            const resultContent = document.getElementById('moodResultContent');
            const suggestionsContent = document.getElementById('suggestionsContent');

            let category = moodCategories.find(cat => score >= cat.min && score <= cat.max);
            if (!category) category = moodCategories[0];

            resultContent.innerHTML = `
                <div class="mood-result">
                    <div class="mood-emoji animate__animated animate__bounceIn">${category.emoji}</div>
                    <h2 class="mood-category animate__animated animate__fadeIn">${category.name}</h2>
                    <p class="mood-description animate__animated animate__fadeIn" style="animation-delay: 0.2s">${category.description}</p>
                    <div class="mood-score animate__animated animate__fadeIn" style="animation-delay: 0.4s">Your wellness garden score: ${score}/35</div>
                    <p style="animation-delay: 0.6s" class="animate__animated animate__fadeIn"><em>Remember: This is not a medical diagnosis, but a reflection of your recent experiences.</em></p>
                </div>
            `;

            resultSection.style.display = 'block';
            resultSection.classList.add('animate__animated', 'animate__fadeInUp');
            resultSection.scrollIntoView({ behavior: 'smooth' });

            let suggestionKey = category.name.toLowerCase().replace(/ /g, '');
            suggestionKey = suggestionKey === 'needingnourishment' ? 'needingNourishment' :
                suggestionKey === 'seasonalshift' ? 'seasonalShift' :
                    suggestionKey === 'gentlegrowth' ? 'gentleGrowth' : 'blooming';

            const categorySuggestions = suggestions[suggestionKey] || suggestions.blooming;

            suggestionsContent.innerHTML = `
                <div class="suggestions-container">
                    ${categorySuggestions.map((suggestion, index) => `
                        <div class="suggestion-card animate__animated animate__fadeInUp ${suggestionKey === 'needingNourishment' ? 'important' : (suggestionKey === 'seasonalShift' ? 'warning' : '')}" style="animation-delay: ${index * 0.1}s">
                            <div class="suggestion-title">
                                <i class="${suggestion.icon}"></i>
                                <h3>${suggestion.title}</h3>
                            </div>
                            <p>${suggestion.text}</p>
                        </div>
                    `).join('')}
                </div>
                
                ${suggestionKey === 'needingNourishment' || suggestionKey === 'seasonalShift' ? `
                <div class="helpline animate__animated animate__fadeIn" style="animation-delay: 0.5s">
                    <h3><i class="fas fa-phone-alt"></i> Support Resources</h3>
                    <p>If you're feeling overwhelmed, consider reaching out to a helpline:</p>
                    <ul style="margin-top: 10px; padding-left: 20px;">
                        ${helplines.map(helpline => `
                            <li style="margin-bottom: 8px;"><strong>${helpline.country}:</strong> ${helpline.number} (${helpline.text})</li>
                        `).join('')}
                    </ul>
                    <p style="margin-top: 10px; font-size: 14px;">These services are confidential and available 24/7 in many countries.</p>
                </div>
                ` : ''}
            `;

            suggestionsSection.style.display = 'block';
            suggestionsSection.classList.add('animate__animated', 'animate__fadeIn');

            setTimeout(() => {
                suggestionsSection.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }

        function saveDailyMood() {
            const selectedEmoji = document.querySelector('.emoji-option.selected');
            if (!selectedEmoji) {
                document.querySelectorAll('.emoji-option').forEach(emoji => {
                    emoji.classList.add('animate__animated', 'animate__shakeX');
                    setTimeout(() => {
                        emoji.classList.remove('animate__animated', 'animate__shakeX');
                    }, 1000);
                });
                return;
            }

            const moodValue = parseInt(selectedEmoji.getAttribute('data-value'));
            const note = document.getElementById('dailyNote').value;
            const today = new Date().toISOString().split('T')[0];

            const existingIndex = appState.dailyMoods.findIndex(entry => entry.date === today);

            if (existingIndex >= 0) {
                appState.dailyMoods[existingIndex] = {
                    date: today,
                    mood: moodValue,
                    note: note,
                    timestamp: new Date().toISOString()
                };
            } else {
                appState.dailyMoods.push({
                    date: today,
                    mood: moodValue,
                    note: note,
                    timestamp: new Date().toISOString()
                });
            }

            saveData();

            const confirmation = document.getElementById('dailyMoodSaved');
            confirmation.style.display = 'block';
            confirmation.classList.add('animate__animated', 'animate__bounceIn');

            document.querySelectorAll('.emoji-option').forEach(e => e.classList.remove('selected'));
            document.getElementById('dailyNote').value = '';

            setTimeout(() => {
                confirmation.classList.add('animate__animated', 'animate__fadeOut');
                setTimeout(() => {
                    confirmation.style.display = 'none';
                    confirmation.classList.remove('animate__animated', 'animate__fadeOut', 'animate__bounceIn');
                }, 500);
            }, 5000);

            if (appState.currentTab === 'history') {
                updateHistoryUI();
            }

            // Update goals if this is a mindfulness day
            if (moodValue >= 3) { // If mood is balanced or better
                const mindfulnessGoal = goals.find(g => g.category === 'mindfulness');
                if (mindfulnessGoal && mindfulnessGoal.current < mindfulnessGoal.target) {
                    mindfulnessGoal.current++;
                    saveGoals();
                    renderGoals();
                }
            }
        }

        function updateHistoryUI(view = 'week') {
            let labels = [];
            let data = [];
            let emojiData = [];

            // Combine both daily moods and check-in history for comprehensive tracking
            const allDataPoints = [
                ...appState.dailyMoods.map(mood => ({
                    date: mood.date,
                    score: calculateWellnessGardenScore(mood),
                    type: 'daily',
                    note: mood.note
                })),
                ...appState.checkinHistory.map(checkin => ({
                    date: checkin.date,
                    score: checkin.score,
                    type: 'checkin'
                }))
            ];

            // Sort by date
            allDataPoints.sort((a, b) => new Date(a.date) - new Date(b.date));

            if (view === 'week') {
                // Last 7 days
                for (let i = 6; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    const dateString = date.toISOString().split('T')[0];
                    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                    labels.push(formattedDate);

                    // Find all entries for this date
                    const dayEntries = allDataPoints.filter(entry => entry.date === dateString);

                    if (dayEntries.length > 0) {
                        // Calculate average score for the day
                        const avgScore = dayEntries.reduce((sum, entry) => sum + entry.score, 0) / dayEntries.length;
                        data.push(avgScore);
                        emojiData.push(getEmojiForScore(avgScore));
                    } else {
                        // No data for this day
                        data.push(null);
                        emojiData.push("—");
                    }
                }
            } else if (view === 'month') {
                // Last 30 days, grouped by week
                const today = new Date();
                const weekData = [];
                const weekLabels = [];
                const weekEmojis = [];

                // Create 4 weeks
                for (let week = 0; week < 4; week++) {
                    const weekStart = new Date(today);
                    weekStart.setDate(today.getDate() - (7 * (week + 1)));
                    const weekEnd = new Date(today);
                    weekEnd.setDate(today.getDate() - (7 * week));

                    // Get entries for this week
                    const weekEntries = allDataPoints.filter(entry => {
                        const entryDate = new Date(entry.date);
                        return entryDate >= weekStart && entryDate < weekEnd;
                    });

                    weekLabels.push(`Week ${4 - week}`);

                    if (weekEntries.length > 0) {
                        // Calculate average score for the week
                        const avgScore = weekEntries.reduce((sum, entry) => sum + entry.score, 0) / weekEntries.length;
                        weekData.push(avgScore);
                        weekEmojis.push(getEmojiForScore(avgScore));
                    } else {
                        weekData.push(null);
                        weekEmojis.push("—");
                    }
                }

                // Reverse to show chronological order
                labels = weekLabels.reverse();
                data = weekData.reverse();
                emojiData = weekEmojis.reverse();
            } else if (view === 'detailed') {
                // Show all individual data points (last 14 days max for readability)
                const recentEntries = allDataPoints.filter(entry => {
                    const entryDate = new Date(entry.date);
                    const today = new Date();
                    const daysAgo = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
                    return daysAgo <= 14;
                }).slice(-20); // Limit to last 20 entries for readability

                recentEntries.forEach(entry => {
                    const date = new Date(entry.date);
                    const formattedDate = date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    labels.push(formattedDate);
                    data.push(entry.score);
                    emojiData.push(getEmojiForScore(entry.score));
                });
            }

            const ctx = document.getElementById('moodChart').getContext('2d');

            if (window.moodChartInstance) {
                window.moodChartInstance.destroy();
            }

            window.moodChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Wellness Garden Score',
                            data: data,
                            backgroundColor: 'rgba(124, 58, 237, 0.1)',
                            borderColor: 'rgba(124, 58, 237, 0.8)',
                            borderWidth: 3,
                            pointBackgroundColor: function (context) {
                                const value = context.dataset.data[context.dataIndex];
                                if (value === null) return 'rgba(200, 200, 200, 0.5)';

                                // Color points based on score range
                                if (value >= 28) return 'rgba(16, 185, 129, 1)'; // Green for high scores
                                if (value >= 21) return 'rgba(245, 158, 11, 1)'; // Amber for medium
                                return 'rgba(239, 68, 68, 1)'; // Red for low scores
                            },
                            pointBorderColor: 'rgba(255, 255, 255, 1)',
                            pointBorderWidth: 2,
                            pointRadius: 6,
                            pointHoverRadius: 10,
                            tension: 0.3,
                            fill: true,
                            spanGaps: true // Connect lines across null values
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 7,
                            max: 35,
                            ticks: {
                                callback: function (value) {
                                    // Show both score and emoji on y-axis
                                    return `${value} ${getEmojiForScore(value)}`;
                                },
                                stepSize: 7,
                                font: {
                                    size: 14
                                }
                            },
                            title: {
                                display: true,
                                text: 'Wellness Garden Score (7-35)',
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            },
                            grid: {
                                color: function (context) {
                                    // Highlight the main score levels
                                    return context.tick.value % 7 === 0 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                                }
                            }
                        },
                        x: {
                            ticks: {
                                maxRotation: 45,
                                font: {
                                    size: view === 'detailed' ? 10 : 12
                                }
                            },
                            title: {
                                display: true,
                                text: view === 'week' ? 'Last 7 Days' :
                                    view === 'month' ? 'Last 4 Weeks' : 'Detailed Timeline',
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                font: {
                                    size: 12
                                },
                                usePointStyle: true
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const value = context.raw;
                                    if (value === null) return 'No data';

                                    // Find category based on exact score
                                    let category = moodCategories.find(cat =>
                                        value >= cat.min && value <= cat.max
                                    ) || moodCategories[0];

                                    return [
                                        `Score: ${value}/35`,
                                        `State: ${category.name} ${category.emoji}`,
                                        `Range: ${category.min}-${category.max}`
                                    ];
                                },
                                afterLabel: function (context) {
                                    const value = context.raw;
                                    if (value === null) return '';

                                    // Get corresponding emoji
                                    const emoji = getEmojiForScore(value);
                                    const entries = allDataPoints.filter(entry =>
                                        Math.round(entry.score) === Math.round(value)
                                    );

                                    if (entries.length > 1) {
                                        return `${emoji} (${entries.length} entries at this level)`;
                                    }
                                    return emoji;
                                }
                            }
                        }
                    }
                }
            });

            // Add emoji indicators below the chart
            addEmojiLegend(emojiData, labels);
            updateStats();
        }

        // Helper function to add emoji legend
        function addEmojiLegend(emojis, labels) {
            const chartContainer = document.querySelector('.chart-container');

            // Remove existing legend if present
            const existingLegend = chartContainer.querySelector('.emoji-legend');
            if (existingLegend) {
                existingLegend.remove();
            }

            // Create new legend
            const legend = document.createElement('div');
            legend.className = 'emoji-legend';
            legend.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        padding: 15px;
        background: rgba(248, 250, 252, 0.8);
        border-radius: 12px;
        border: 1px solid #E5E7EB;
        flex-wrap: wrap;
        gap: 10px;
    `;

            // Add emoji data points
            let legendHTML = '<div style="display: flex; gap: 20px; flex-wrap: wrap;">';

            emojis.forEach((emoji, index) => {
                if (emoji !== "—" && labels[index]) {
                    legendHTML += `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 24px;">${emoji}</span>
                    <span style="font-size: 12px; color: #6B7280;">${labels[index]}</span>
                </div>
            `;
                }
            });

            legendHTML += '</div>';

            // Add score reference
            legendHTML += `
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #D1D5DB; width: 100%;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6B7280;">
                <span>7-13: 😣 Heavy</span>
                <span>14-20: 😔 Tender</span>
                <span>21-27: 😐 Balanced</span>
                <span>28-34: 🙂 Peaceful</span>
                <span>35: 😄 Blooming</span>
            </div>
        </div>
    `;

            legend.innerHTML = legendHTML;
            chartContainer.appendChild(legend);
        }

        function updateStats() {
            let streak = 0;
            const today = new Date().toISOString().split('T')[0];
            const sortedMoods = [...appState.dailyMoods].sort((a, b) => b.date.localeCompare(a.date));

            for (let i = 0; i < sortedMoods.length; i++) {
                const expectedDate = new Date();
                expectedDate.setDate(expectedDate.getDate() - i);
                const expectedDateString = expectedDate.toISOString().split('T')[0];

                if (sortedMoods[i].date === expectedDateString) {
                    streak++;
                } else {
                    break;
                }
            }

            const streakElement = document.getElementById('currentStreak');
            animateValueChange(streakElement, parseInt(streakElement.textContent) || 0, streak);

            const lastWeekMoods = appState.dailyMoods.filter(entry => {
                const entryDate = new Date(entry.date);
                const today = new Date();
                const daysAgo = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
                return daysAgo <= 7;
            });

            const avgMood = lastWeekMoods.length > 0
                ? (lastWeekMoods.reduce((sum, entry) => sum + entry.mood, 0) / lastWeekMoods.length).toFixed(1)
                : '0';

            const avgElement = document.getElementById('avgMood');
            animateValueChange(avgElement, parseFloat(avgElement.textContent) || 0, parseFloat(avgMood));

            if (lastWeekMoods.length > 0) {
                const bestMood = Math.max(...lastWeekMoods.map(entry => entry.mood));
                const bestDayEntry = lastWeekMoods.find(entry => entry.mood === bestMood);
                const bestDayDate = new Date(bestDayEntry.date);
                const bestDayName = bestDayDate.toLocaleDateString('en-US', { weekday: 'long' });
                document.getElementById('bestDay').textContent = bestDayName;
            }

            const totalCheckins = appState.dailyMoods.length + appState.checkinHistory.length;
            const checkinsElement = document.getElementById('checkinCount');
            animateValueChange(checkinsElement, parseInt(checkinsElement.textContent) || 0, totalCheckins);
        }

        function animateValueChange(element, oldValue, newValue) {
            if (oldValue === newValue) {
                element.textContent = newValue;
                return;
            }

            const duration = 1000;
            const startTime = Date.now();
            const endTime = startTime + duration;

            function update() {
                const now = Date.now();
                const progress = Math.min((now - startTime) / duration, 1);
                const currentValue = Math.round(oldValue + (newValue - oldValue) * progress);

                if (typeof newValue === 'string' || newValue % 1 !== 0) {
                    element.textContent = currentValue.toFixed(1);
                } else {
                    element.textContent = currentValue;
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    if (typeof newValue === 'string' || newValue % 1 !== 0) {
                        element.textContent = parseFloat(newValue).toFixed(1);
                    } else {
                        element.textContent = newValue;
                    }
                }
            }

            update();
        }

        function exportData() {
            const data = {
                dailyMoods: appState.dailyMoods,
                checkinHistory: appState.checkinHistory,
                goals: goals,
                favoriteAffirmations: favoriteAffirmations,
                exportDate: new Date().toISOString(),
                appName: "MindBloom Wellness Tracker"
            };

            const dataStr = JSON.stringify(data, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

            const exportFileDefaultName = `mindbloom-data-${new Date().toISOString().split('T')[0]}.json`;

            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();

            const exportBtn = document.getElementById('exportData');
            const originalText = exportBtn.innerHTML;
            exportBtn.innerHTML = '<i class="fas fa-check"></i> Harvested!';
            exportBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';

            setTimeout(() => {
                exportBtn.innerHTML = originalText;
                exportBtn.style.background = '';
            }, 2000);
        }

        function clearHistory() {
            if (confirm('Are you sure you want to prune your mood history? This will clear your daily mood entries but keep check-in history.')) {
                appState.dailyMoods = [];
                saveData();
                updateHistoryUI();

                document.querySelectorAll('.stat-card').forEach(card => {
                    card.classList.add('animate__animated', 'animate__pulse');
                    setTimeout(() => {
                        card.classList.remove('animate__animated', 'animate__pulse');
                    }, 1000);
                });
            }
        }

        function deleteAllData() {
            if (confirm('This will completely clear your entire emotional garden. All mood history and check-ins will be permanently removed. Are you absolutely sure?')) {
                localStorage.removeItem('mindbloom_daily_moods');
                localStorage.removeItem('mindbloom_checkin_history');
                localStorage.removeItem('mindbloom_goals');
                localStorage.removeItem('mindbloom_favorite_affirmations');
                localStorage.removeItem('mindbloom_drawings');

                appState.dailyMoods = [];
                appState.checkinHistory = [];
                goals = [];
                favoriteAffirmations = [];

                updateHistoryUI();
                renderGoals();
                loadRandomAffirmation();

                const deleteBtn = document.getElementById('deleteAllData');
                const originalText = deleteBtn.innerHTML;
                deleteBtn.innerHTML = '<i class="fas fa-check"></i> Garden Cleared';
                deleteBtn.style.background = 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)';

                setTimeout(() => {
                    deleteBtn.innerHTML = originalText;
                    deleteBtn.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
                }, 3000);
            }
        }




        // Add this function to calculate wellness garden score
        function calculateWellnessGardenScore(checkinData) {
            // If it's a daily mood (1-5 scale), convert to 7-35 scale
            if (checkinData.mood >= 1 && checkinData.mood <= 5) {
                // Convert 1-5 scale to 7-35 scale for consistency
                // 1 -> 7, 2 -> 14, 3 -> 21, 4 -> 28, 5 -> 35
                return checkinData.mood * 7;
            }
            // If it's already a check-in score (7-35), return it
            return checkinData.score || checkinData.mood * 7;
        }

        // Update emoji distribution based on 7-35 scale
        const moodEmojisByScore = {
            7: "😣",   // 1 on 1-5 scale
            14: "😔",  // 2 on 1-5 scale
            21: "😐",  // 3 on 1-5 scale
            28: "🙂",  // 4 on 1-5 scale
            35: "😄"   // 5 on 1-5 scale
        };

        // Function to get emoji for a specific score
        function getEmojiForScore(score) {
            // Round to nearest multiple of 7 (since we have 5 emojis for 5 levels)
            const roundedScore = Math.round(score / 7) * 7;
            // Clamp between 7 and 35
            const clampedScore = Math.max(7, Math.min(35, roundedScore));
            return moodEmojisByScore[clampedScore] || "😐";
        }
