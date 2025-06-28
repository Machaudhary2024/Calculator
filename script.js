class ScientificCalculator {
    constructor(currentOperandElement) {
        this.currentOperandElement = currentOperandElement;
        this.memory = 0;
        this.secondFunction = false;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.waitingForOperand = false;
    }

    delete() {
        if (this.currentOperand.length > 1) {
            this.currentOperand = this.currentOperand.slice(0, -1);
        } else {
            this.currentOperand = '0';
        }
    }

    appendNumber(number) {
        if (this.waitingForOperand) {
            this.currentOperand = number;
            this.waitingForOperand = false;
        } else {
            if (number === '.' && this.currentOperand.includes('.')) return;
            this.currentOperand = this.currentOperand === '0' ? number : this.currentOperand + number;
        }
    }

    chooseOperation(operation) {
        if (this.previousOperand !== '' && !this.waitingForOperand) {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.waitingForOperand = true;
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
            case 'mod':
                computation = prev % current;
                break;
            case 'yx':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.waitingForOperand = true;
    }

    executeFunction(func) {
        const current = parseFloat(this.currentOperand);
        let result;

        switch (func) {
            case 'x2':
                result = Math.pow(current, 2);
                break;
            case 'sqrt':
                result = Math.sqrt(current);
                break;
            case 'cbrt':
                result = Math.cbrt(current);
                break;
            case 'abs':
                result = Math.abs(current);
                break;
            case 'exp':
                result = Math.exp(current);
                break;
            case '10x':
                result = Math.pow(10, current);
                break;
            case 'log':
                result = Math.log10(current);
                break;
            case 'ln':
                result = Math.log(current);
                break;
            case 'factorial':
                result = this.factorial(current);
                break;
            case 'pi':
                result = Math.PI;
                break;
            case 'e':
                result = Math.E;
                break;
            case 'plusminus':
                result = -current;
                break;
            case 'sin':
                result = Math.sin(current);
                break;
            case 'cos':
                result = Math.cos(current);
                break;
            case 'tan':
                result = Math.tan(current);
                break;
            default:
                return;
        }

        this.currentOperand = result.toString();
        this.waitingForOperand = true;
    }

    factorial(n) {
        if (n < 0 || n !== Math.floor(n)) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    memoryOperation(operation) {
        const current = parseFloat(this.currentOperand);
        
        switch (operation) {
            case 'clear':
                this.memory = 0;
                break;
            case 'recall':
                this.currentOperand = this.memory.toString();
                this.waitingForOperand = true;
                break;
            case 'add':
                this.memory += current;
                break;
            case 'subtract':
                this.memory -= current;
                break;
            case 'store':
                this.memory = current;
                break;
        }
    }

    updateDisplay() {
        const displayValue = parseFloat(this.currentOperand);
        if (isNaN(displayValue)) {
            this.currentOperandElement.innerText = 'Error';
        } else {
            this.currentOperandElement.innerText = this.formatNumber(displayValue);
        }
    }

    formatNumber(number) {
        if (number.toString().length > 12) {
            return number.toExponential(6);
        }
        return number.toLocaleString('en', { maximumFractionDigits: 10 });
    }
}

// Initialize calculator
const currentOperandElement = document.getElementById('currentOperand');
const calculator = new ScientificCalculator(currentOperandElement);

// Button event listeners
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const functionButtons = document.querySelectorAll('[data-function]');
const memoryButtons = document.querySelectorAll('[data-memory]');
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

functionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const func = button.getAttribute('data-function');
        if (func === '(' || func === ')') {
            // Handle parentheses (simplified for this example)
            calculator.appendNumber(func);
        } else {
            calculator.executeFunction(func);
        }
        calculator.updateDisplay();
        animateButton(button);
    });
});

memoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const operation = button.getAttribute('data-memory');
        calculator.memoryOperation(operation);
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

    if (key >= '0' && key <= '9' || key === '.') {
        calculator.appendNumber(key);
        button = Array.from(numberButtons).find(btn => btn.innerText === key);
    }
    else if (key === '+' || key === '-' || key === '*' || key === '/') {
        const op = key === '*' ? '×' : key === '/' ? '÷' : key;
        calculator.chooseOperation(op);
        button = Array.from(operatorButtons).find(btn => btn.innerText === op);
    }
    else if (key === 'Enter' || key === '=') {
        calculator.compute();
        button = equalsButton;
    }
    else if (key === 'Escape' || key.toLowerCase() === 'c') {
        calculator.clear();
        button = clearButton;
    }
    else if (key === 'Backspace') {
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

// Dropdown functionality (simplified)
document.getElementById('trigDropdown').addEventListener('click', () => {
    alert('Trigonometry functions: sin, cos, tan available via function buttons');
});

document.getElementById('funcDropdown').addEventListener('click', () => {
    alert('Additional functions available via function buttons');
});

// Initialize display
calculator.updateDisplay();

// Touch device support
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