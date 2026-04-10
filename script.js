/**
 * BIRTHDAY PROTOCOL - Interactive Cyber-Themed Birthday Experience
 * For: Dev Sally
 * 
 * Features:
 * - Multi-stage unlock system
 * - Smooth transitions and animations
 * - Easter eggs and hidden features
 * - Confetti celebration
 * - Typing text effects
 */

// ============================================
// CONFIGURATION - CUSTOMIZE HERE
// ============================================

const CONFIG = {
    // Recipient name
    recipientName: 'Dev Sally',
    recipientInitials: 'DS',
    
    // Birthday message (supports multi-line with \n)
    birthdayMessage: `May your code always compile on the first try,\nmay your bugs be easy to fix,\nand may your coffee never run cold.\n\nHere's to another year of building amazing things\nand inspiring everyone around you!`,
    
    // Secret code answer
    secretCode: 'happybirthday',
    
    // Easter egg commands
    easterEggs: {
        legendary: '/legend',
        secret: 'konami'
    },
    
    // Timing settings (in milliseconds)
    timings: {
        scanDuration: 2500,
        identityRevealDelay: 2000,
        progressCheckDelay: 500,
        typingSpeed: 50,
        confettiDuration: 8000
    }
};

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
    currentScreen: 'screen-lock',
    level1Selections: new Set(),
    level1Completed: false,
    level2Completed: false,
    level3Attempts: 0,
    level3Completed: false,
    avatarClicks: 0,
    secretBuffer: '',
    confettiActive: false
};

// ============================================
// DOM ELEMENTS
// ============================================

const screens = {
    lock: document.getElementById('screen-lock'),
    identity: document.getElementById('screen-identity'),
    level1: document.getElementById('screen-level1'),
    level2: document.getElementById('screen-level2'),
    level3: document.getElementById('screen-level3'),
    progress: document.getElementById('screen-progress'),
    reveal: document.getElementById('screen-reveal')
};

const elements = {
    // Lock screen
    lockStatus: document.getElementById('lockStatus'),
    initScanBtn: document.getElementById('initScanBtn'),
    scanOverlay: document.getElementById('scanOverlay'),
    
    // Identity screen
    userAvatar: document.getElementById('userAvatar'),
    userName: document.getElementById('userName'),
    
    // Level 1
    verificationGrid: document.getElementById('verificationGrid'),
    level1Feedback: document.getElementById('level1Feedback'),
    level1Submit: document.getElementById('level1Submit'),
    
    // Level 2
    memoryInput: document.getElementById('memoryInput'),
    memoryResponse: document.getElementById('memoryResponse'),
    level2Submit: document.getElementById('level2Submit'),
    
    // Level 3
    codeInput: document.getElementById('codeInput'),
    codeResponse: document.getElementById('codeResponse'),
    level3Submit: document.getElementById('level3Submit'),
    attemptsCounter: document.getElementById('attemptsCounter'),
    
    // Progress
    progressChecklist: document.getElementById('progressChecklist'),
    progressBar: document.getElementById('progressBar'),
    progressStatus: document.getElementById('progressStatus'),
    
    // Reveal
    accessGranted: document.getElementById('accessGranted'),
    protocolInit: document.getElementById('protocolInit'),
    birthdayMessage: document.getElementById('birthdayMessage'),
    typingText: document.getElementById('typingText'),
    confettiCanvas: document.getElementById('confettiCanvas'),
    
    // Easter eggs
    secretInput: document.getElementById('secretInput'),
    legendaryOverlay: document.getElementById('legendaryOverlay'),
    hiddenMessage: document.getElementById('hiddenMessage')
};

// ============================================
// SCREEN NAVIGATION
// ============================================

function showScreen(screenName) {
    // Hide all screens
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = screens[screenName];
    if (targetScreen) {
        targetScreen.classList.add('active');
        state.currentScreen = screenName;
    }
}

function transitionTo(screenName, delay = 0) {
    setTimeout(() => {
        showScreen(screenName);
    }, delay);
}

// ============================================
// SCREEN 1: SYSTEM LOCK
// ============================================

function initLockScreen() {
    elements.initScanBtn.addEventListener('click', startIdentityScan);
}

function startIdentityScan() {
    // Show scan overlay
    elements.scanOverlay.classList.add('active');
    
    // Play scan sound effect (optional - can be added)
    
    // After scan duration, reveal identity
    setTimeout(() => {
        elements.scanOverlay.classList.remove('active');
        showScreen('identity');
        
        // Auto-transition to level 1 after delay
        transitionTo('level1', CONFIG.timings.identityRevealDelay);
    }, CONFIG.timings.scanDuration);
}

// ============================================
// SCREEN 2: IDENTITY (Auto-display)
// ============================================

function initIdentityScreen() {
    // Set recipient info
    elements.userAvatar.textContent = CONFIG.recipientInitials;
    elements.userName.textContent = CONFIG.recipientName;
    
    // Avatar click easter egg (5 clicks)
    elements.userAvatar.addEventListener('click', handleAvatarClick);
}

function handleAvatarClick() {
    state.avatarClicks++;
    
    // Add pulse animation
    elements.userAvatar.classList.add('pulse');
    setTimeout(() => elements.userAvatar.classList.remove('pulse'), 500);
    
    // Reveal hidden message after 5 clicks
    if (state.avatarClicks === 5) {
        showHiddenMessage();
    }
}

function showHiddenMessage() {
    elements.hiddenMessage.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        elements.hiddenMessage.classList.remove('show');
    }, 3000);
    
    // Reset counter
    state.avatarClicks = 0;
}

// ============================================
// SCREEN 3: LEVEL 1 - HUMAN VERIFICATION
// ============================================

function initLevel1() {
    const verifyItems = elements.verificationGrid.querySelectorAll('.verify-item');
    
    verifyItems.forEach(item => {
        item.addEventListener('click', () => toggleVerifyItem(item));
    });
    
    elements.level1Submit.addEventListener('click', validateLevel1);
}

function toggleVerifyItem(item) {
    const isSelected = item.getAttribute('data-selected') === 'true';
    const isCorrect = item.getAttribute('data-correct') === 'true';
    
    if (isSelected) {
        // Deselect
        item.setAttribute('data-selected', 'false');
        item.classList.remove('selected', 'selected-correct', 'selected-wrong');
        state.level1Selections.delete(item);
    } else {
        // Select
        item.setAttribute('data-selected', 'true');
        item.classList.add('selected');
        
        if (isCorrect) {
            item.classList.add('selected-correct');
        } else {
            item.classList.add('selected-wrong');
        }
        
        state.level1Selections.add(item);
    }
    
    // Enable/disable submit button
    elements.level1Submit.disabled = state.level1Selections.size === 0;
    
    // Clear feedback
    elements.level1Feedback.textContent = '';
    elements.level1Feedback.className = 'validation-feedback';
}

function validateLevel1() {
    const selectedItems = Array.from(state.level1Selections);
    const correctItems = selectedItems.filter(item => 
        item.getAttribute('data-correct') === 'true'
    );
    const wrongItems = selectedItems.filter(item => 
        item.getAttribute('data-correct') === 'false'
    );
    
    // All correct items selected and no wrong items
    const allCorrectSelected = correctItems.length === 3 && wrongItems.length === 0;
    
    if (allCorrectSelected) {
        // Success
        elements.level1Feedback.textContent = 'Identity verified ✓';
        elements.level1Feedback.className = 'validation-feedback success';
        state.level1Completed = true;
        
        // Transition to level 2
        setTimeout(() => {
            showScreen('level2');
            elements.memoryInput.focus();
        }, 1000);
    } else {
        // Error
        elements.level1Feedback.textContent = 'Verification failed. Try again.';
        elements.level1Feedback.className = 'validation-feedback error';
        
        // Shake animation
        elements.verificationGrid.classList.add('shake');
        setTimeout(() => elements.verificationGrid.classList.remove('shake'), 500);
    }
}

// ============================================
// SCREEN 4: LEVEL 2 - MEMORY INPUT
// ============================================

function initLevel2() {
    elements.level2Submit.addEventListener('click', validateLevel2);
    
    elements.memoryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            validateLevel2();
        }
    });
}

function validateLevel2() {
    const input = elements.memoryInput.value.trim();
    
    if (input.length === 0) {
        elements.memoryResponse.textContent = 'Please enter a response...';
        elements.memoryResponse.style.color = 'var(--warning)';
        return;
    }
    
    // Show confirmation message
    elements.memoryResponse.textContent = 'Memory confirmed...';
    elements.memoryResponse.style.color = 'var(--success)';
    
    state.level2Completed = true;
    
    // Transition to level 3
    setTimeout(() => {
        showScreen('level3');
        elements.codeInput.focus();
    }, 1500);
}

// ============================================
// SCREEN 5: LEVEL 3 - SECRET CODE
// ============================================

function initLevel3() {
    elements.level3Submit.addEventListener('click', validateLevel3);
    
    elements.codeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            validateLevel3();
        }
    });
    
    updateAttemptsCounter();
}

function validateLevel3() {
    const input = elements.codeInput.value.trim().toLowerCase();
    
    if (input.length === 0) {
        elements.codeResponse.textContent = 'Please enter the access code...';
        elements.codeResponse.style.color = 'var(--warning)';
        return;
    }
    
    if (input === CONFIG.secretCode) {
        // Correct code
        elements.codeResponse.textContent = 'Access code accepted ✓';
        elements.codeResponse.style.color = 'var(--success)';
        state.level3Completed = true;
        
        // Transition to progress screen
        setTimeout(() => {
            showScreen('progress');
            startProgressCheck();
        }, 1000);
    } else {
        // Wrong code
        state.level3Attempts++;
        updateAttemptsCounter();
        
        if (state.level3Attempts >= 3) {
            // Too many attempts - grant access anyway
            elements.codeResponse.innerHTML = 
                'Too many attempts...<br>but since it\'s your birthday, access will be granted 😌';
            elements.codeResponse.style.color = 'var(--success)';
            state.level3Completed = true;
            
            setTimeout(() => {
                showScreen('progress');
                startProgressCheck();
            }, 2500);
        } else {
            // Show error
            elements.codeResponse.textContent = `Invalid code. ${3 - state.level3Attempts} attempts remaining.`;
            elements.codeResponse.style.color = 'var(--error)';
            
            // Shake animation
            elements.codeInput.parentElement.classList.add('shake');
            setTimeout(() => {
                elements.codeInput.parentElement.classList.remove('shake');
            }, 500);
            
            elements.codeInput.value = '';
            elements.codeInput.focus();
        }
    }
}

function updateAttemptsCounter() {
    elements.attemptsCounter.textContent = `Attempts: ${state.level3Attempts}/3`;
}

// ============================================
// SCREEN 6: PROGRESS CHECK
// ============================================

function startProgressCheck() {
    const checklistItems = elements.progressChecklist.querySelectorAll('.checklist-item');
    const stages = [
        { name: 'Identity Verified', delay: 0 },
        { name: 'Memory Confirmed', delay: 800 },
        { name: 'Code Accepted', delay: 1600 }
    ];
    
    // Reset progress
    elements.progressBar.style.width = '0%';
    
    stages.forEach((stage, index) => {
        setTimeout(() => {
            // Update checklist item
            const item = checklistItems[index];
            item.setAttribute('data-status', 'checking');
            item.querySelector('.checklist-icon').textContent = '◐';
            elements.progressStatus.textContent = `Checking: ${stage.name}...`;
            
            setTimeout(() => {
                item.setAttribute('data-status', 'completed');
                item.querySelector('.checklist-icon').textContent = '✓';
                
                // Update progress bar
                const progress = ((index + 1) / stages.length) * 100;
                elements.progressBar.style.width = `${progress}%`;
                
                if (index === stages.length - 1) {
                    elements.progressStatus.textContent = 'All checks passed!';
                    
                    // Transition to final reveal
                    setTimeout(() => {
                        showScreen('reveal');
                        startFinalReveal();
                    }, 800);
                }
            }, 600);
        }, stage.delay);
    });
}

// ============================================
// SCREEN 7: FINAL REVEAL
// ============================================

function startFinalReveal() {
    // Show access granted
    setTimeout(() => {
        elements.accessGranted.classList.add('show');
        
        // Show protocol init
        setTimeout(() => {
            elements.protocolInit.classList.add('show');
            
            // Show birthday message
            setTimeout(() => {
                elements.accessGranted.style.display = 'none';
                elements.protocolInit.style.display = 'none';
                elements.birthdayMessage.classList.add('show');
                
                // Start typing effect
                typeMessage(CONFIG.birthdayMessage, () => {
                    // Start confetti after typing completes
                    startConfetti();
                });
            }, 2000);
        }, 1500);
    }, 500);
}

function typeMessage(message, callback) {
    const lines = message.split('\n');
    let currentLine = 0;
    let currentChar = 0;
    
    elements.typingText.innerHTML = '';
    
    function typeNextChar() {
        if (currentLine >= lines.length) {
            if (callback) callback();
            return;
        }
        
        const line = lines[currentLine];
        
        if (currentChar < line.length) {
            // Add character
            const char = line[currentChar];
            elements.typingText.innerHTML += char;
            currentChar++;
            setTimeout(typeNextChar, CONFIG.timings.typingSpeed);
        } else {
            // Move to next line
            elements.typingText.innerHTML += '<br>';
            currentLine++;
            currentChar = 0;
            setTimeout(typeNextChar, CONFIG.timings.typingSpeed * 2);
        }
    }
    
    typeNextChar();
}

// ============================================
// CONFETTI ANIMATION
// ============================================

function startConfetti() {
    const canvas = elements.confettiCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    state.confettiActive = true;
    
    // Confetti particles
    const particles = [];
    const colors = ['#00d4aa', '#00b4d8', '#ff6b35', '#f7931e', '#ffffff', '#ff4757'];
    
    // Create particles
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 4 - 2
        });
    }
    
    function animate() {
        if (!state.confettiActive) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, index) => {
            // Update position
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;
            
            // Reset if off screen
            if (p.y > canvas.height) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }
            
            // Draw particle
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Stop confetti after duration
    setTimeout(() => {
        state.confettiActive = false;
    }, CONFIG.timings.confettiDuration);
}

// ============================================
// EASTER EGGS
// ============================================

function initEasterEggs() {
    // Secret command input (type "/legend" anywhere)
    document.addEventListener('keydown', handleSecretInput);
    
    // Console easter egg
    console.log('%c🔒 Birthday Protocol', 'font-size: 24px; font-weight: bold; color: #00d4aa;');
    console.log('%cHey there, curious developer!', 'font-size: 14px; color: #8b8b9a;');
    console.log('%cTry typing "/legend" anywhere on the page...', 'font-size: 12px; color: #5a5a6a; font-style: italic;');
    console.log('%cOr click the avatar 5 times for a surprise!', 'font-size: 12px; color: #5a5a6a; font-style: italic;');
}

function handleSecretInput(e) {
    // Add character to buffer
    state.secretBuffer += e.key.toLowerCase();
    
    // Keep buffer at reasonable size
    if (state.secretBuffer.length > 20) {
        state.secretBuffer = state.secretBuffer.slice(-20);
    }
    
    // Check for legendary command
    if (state.secretBuffer.includes(CONFIG.easterEggs.legendary)) {
        activateLegendaryMode();
        state.secretBuffer = '';
    }
    
    // Check for konami code (bonus easter egg)
    if (state.secretBuffer.includes(CONFIG.easterEggs.secret)) {
        activateKonamiCode();
        state.secretBuffer = '';
    }
}

function activateLegendaryMode() {
    elements.legendaryOverlay.classList.add('active');
    
    // Play sound effect (optional)
    
    // Hide after 3 seconds
    setTimeout(() => {
        elements.legendaryOverlay.classList.remove('active');
    }, 3000);
}

function activateKonamiCode() {
    // Change background to rainbow gradient temporarily
    document.body.style.background = 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)';
    document.body.style.backgroundSize = '400% 400%';
    document.body.style.animation = 'gradientShift 3s ease infinite';
    
    // Add keyframes if not exists
    if (!document.getElementById('konamiStyles')) {
        const style = document.createElement('style');
        style.id = 'konamiStyles';
        style.textContent = `
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Reset after 5 seconds
    setTimeout(() => {
        document.body.style.background = '';
        document.body.style.animation = '';
    }, 5000);
    
    console.log('%c🌈 KONAMI CODE ACTIVATED!', 'font-size: 20px; color: #ff6b35; font-weight: bold;');
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    // Initialize all screens
    initLockScreen();
    initIdentityScreen();
    initLevel1();
    initLevel2();
    initLevel3();
    initEasterEggs();
    
    // Handle window resize for confetti
    window.addEventListener('resize', () => {
        if (elements.confettiCanvas) {
            elements.confettiCanvas.width = window.innerWidth;
            elements.confettiCanvas.height = window.innerHeight;
        }
    });
    
    console.log('%c🎂 Birthday Protocol initialized', 'color: #00d4aa;');
    console.log('%cReady to celebrate ' + CONFIG.recipientName + '!', 'color: #8b8b9a;');
}

// Start the experience when DOM is ready
document.addEventListener('DOMContentLoaded', init);
