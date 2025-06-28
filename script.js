class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = 
            this.getDisplayNumber(this.currentOperand) || '0';
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// Initialize calculator
const previousOperandElement = document.getElementById('previousOperand');
const currentOperandElement = document.getElementById('currentOperand');
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Button event listeners
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const clearButton = document.querySelector('[data-clear]');

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
        animateButton(button);
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
        animateButton(button);
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
    animateButton(equalsButton);
});

clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
    animateButton(clearButton);
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
    animateButton(deleteButton);
});

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    let button = null;

    // Numbers and decimal point
    if (key >= '0' && key <= '9' || key === '.') {
        calculator.appendNumber(key);
        button = document.querySelector(`[data-number]:nth-of-type(${getNumberButtonIndex(key)})`);
    }
    
    // Operators
    else if (key === '+') {
        calculator.chooseOperation('+');
        button = document.querySelector('[data-operator]:last-of-type');
    }
    else if (key === '-') {
        calculator.chooseOperation('-');
        button = document.querySelector('[data-operator]:nth-of-type(3)');
    }
    else if (key === '*') {
        calculator.chooseOperation('×');
        button = document.querySelector('[data-operator]:nth-of-type(2)');
    }
    else if (key === '/') {
        event.preventDefault(); // Prevent browser search
        calculator.chooseOperation('÷');
        button = document.querySelector('[data-operator]:first-of-type');
    }
    
    // Equals
    else if (key === 'Enter' || key === '=') {
        calculator.compute();
        button = equalsButton;
    }
    
    // Clear
    else if (key === 'Escape' || key.toLowerCase() === 'c') {
        calculator.clear();
        button = clearButton;
    }
    
    // Delete/Backspace
    else if (key === 'Backspace' || key === 'Delete') {
        calculator.delete();
        button = deleteButton;
    }

    calculator.updateDisplay();
    
    if (button) {
        animateButton(button);
        highlightKeyboardButton(button);
    }
});

// Helper functions
function animateButton(button) {
    button.classList.add('pressed');
    setTimeout(() => {
        button.classList.remove('pressed');
    }, 100);
}

function highlightKeyboardButton(button) {
    button.classList.add('keyboard-active');
    setTimeout(() => {
        button.classList.remove('keyboard-active');
    }, 150);
}

function getNumberButtonIndex(key) {
    const numberMap = {
        '7': 1, '8': 2, '9': 3,
        '4': 4, '5': 5, '6': 6,
        '1': 7, '2': 8, '3': 9,
        '0': 10, '.': 11
    };
    return numberMap[key] || 1;
}

// Initialize display
calculator.updateDisplay();

// Add visual feedback for touch devices
if ('ontouchstart' in window) {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', () => {
            setTimeout(() => {
                button.style.transform = '';
            }, 100);
        });
    });
}