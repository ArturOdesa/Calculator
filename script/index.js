let numbers = [];
let actions = [];
let btn;
let btnKey;
let value1;
let value2;
let operation;
let result;

let timePara = document.querySelector('#time');
let displayCurr = document.querySelector('#output-field-bottom');
let allBtns = document.querySelectorAll('button');
let calculatorBtns = document.querySelector('.calc-btns');
calculatorBtns.addEventListener('click', btnsClickHandler);
document.addEventListener('keydown', keydownHandler);
document.addEventListener('keyup', keyupHandler);

function setTime() {
    let time = new Date();
    let hours = time.getHours().toString().padStart(2, '0');
    let minutes = time.getMinutes().toString().padStart(2, '0');
    timePara.textContent = `${hours}:${minutes}`;
}

function keyupHandler(e) {
    let key = e.key;
    for (let button of allBtns) {
        if (button.value === key) {
            button.classList.remove('number-touch');
        } else {
            button.classList.remove('equal-btn-touch');
        }
    }
}

function keydownHandler(e) {
    btnKey = e.key;
    if (btnKey === 'Enter') {
        for (let button of allBtns) {
            if (button.value === '=') {
                button.classList.add('equal-btn-touch');
            }
        }
        e.preventDefault();
        createSecondOperand();
    }
    if (!isNaN(btnKey) || btnKey === '.') {
        for (let button of allBtns) {
            button.classList.remove('selected');
            if (button.value === btnKey) {
                button.classList.add('number-touch');
            }
        }
        if (btnKey === '.' && numbers.length === 0) {
            numbers.push('0', '.')
        } else {
            if (numbers.includes('.', 0) && btnKey === '.') {
                return;
            } else {
                numbers.push(btnKey);
            }
        }
        displayCurrNumber();
    } else if (btnKey !== 'Enter' && isNaN(btnKey)) {
        if (numbers.length === 0 && btnKey === '-' && !result && !value1) {
            numbers.push(btnKey);
            displayCurrNumber();
        } else {
            if (btnKey === actions[actions.length - 1]) {
                createSecondOperand();
            } else {
                for (let button of allBtns) {
                    if (btnKey === button.value) {
                        button.classList.add('selected')
                    } else {
                        button.classList.remove('selected')
                    }
                }
                actions.push(btnKey);
                createFirstOperand();
            }
        }
        if (btnKey === 'Backspace' && numbers.length !== 0) {
            clearNumber();
            actions.pop()
        } else if (btnKey === 'Backspace' && numbers.length === 0) {
            clearAllData();
        } else if (btnKey === "Escape") {
            clearAllData();
        }
    }
}

function btnsClickHandler(e) {
    btn = e.target;
    if ((!isNaN(btn.value) || btn.value === '.')) {
        for (let button of allBtns) {
            button.classList.remove('selected')
        }
        if (btn.value === '.' && numbers.length === 0) {
            numbers.push('0', '.')
        } else {
            if (numbers.includes('.', 0) && btn.value === '.') {
                return;
            } else {
                numbers.push(btn.value);
            }
        }
        displayCurrNumber();
    } else if (btn.value !== '=' && btn.value !== 'AC' && btn.value !== 'reverse' && btn.value !== 'C') {
        if (btn.value === '%') {
            actions.push(btn.value);
            calculating();
        } else {
            if (btn.value === actions[actions.length - 1]) {
                createSecondOperand();
            } else {
                for (let button of allBtns) {
                    if (btn.value === button.value) {
                        button.classList.add('selected')
                    } else {
                        button.classList.remove('selected')
                    }
                }
                actions.push(btn.value);
                createFirstOperand();
            }
        }
    } else {
        switch (btn.value) {
            case "reverse":
                switchNumberState()
                break;
            case 'C':
                clearNumber();
                break;
            case "AC":
                clearAllData();
                break;
            case '=':
                createSecondOperand();
        }
    }
}

function switchNumberState() {
    if (result && numbers.length === 0) {
        value1 = Number(value1) * -1;
        value1 = String(value1);
    } else {
        if (numbers[0] !== "-") {
            numbers.unshift("-");
        } else {
            numbers.shift();
        }
    }
    displayCurrNumber();
}

function clearNumber() {
    numbers = [];
    displayCurrNumber();
}

function clearAllData() {
    for (let button of allBtns) {
        button.classList.remove('selected')
    }
    numbers = [];
    actions = [];
    value1 = '';
    value2 = '';
    result = '';
    displayCurrNumber();
}

function createFirstOperand() {
    if (numbers.length !== 0) {
        if (result) {
            value1 = result;
        } else {
            value1 = numbers.reduce((prev, curr) => prev + curr);
            numbers = [];
        }
    } else {
        if (value1) {
            return;
        }
        if (!result) {
            value1 = '0';
        }
    }
    displayCurrNumber();
}

function createSecondOperand() {
    if (actions.length === 0 && numbers.length === 0) {
        return;
    }
    if (actions.length === 0) {
        value1 = numbers.reduce((prev, curr) => prev + curr);
        return;
    }
    if (numbers.length !== 0) {
        value2 = numbers.reduce((prev, curr) => prev + curr);
        numbers = [];
    } else {
        value2 = value1;
    }
    calculating();
}

function createSecondOperandPercent() {
    if (numbers.length !== 0) {
        value2 = numbers.reduce((prev, curr) => prev + curr);
        numbers = [];
    } else {
        value2 = value1;
    }
}

function calculating() {
    for (let button of allBtns) {
        button.classList.remove('selected')
    }
    let action = actions[actions.length - 1];
    if (action === "%") {
        if (actions.length === 1) {
            createFirstOperand();
            operation = `${value1} * 0.01`;
            result = eval(operation);
            result = parseFloat(result.toFixed(3));
            value1 = String(result);
        } else if (actions.length > 1) {
            createSecondOperandPercent();
            operation = `${value1} ${actions[actions.length - 2]} (${value1} / 100 * ${value2})`;
            result = eval(operation);
            result = parseFloat(result.toFixed(3));
            value1 = String(result);
        }
    } else {
        if (action === "/" && value2 === '0') {
            value1 = 'Error'
            clearNumber();
        } else {
            operation = `${value1} ${action} ${value2}`
            result = eval(operation);
            result = parseFloat(result.toFixed(3));
            value1 = String(result);
        }
    }
    actions = [];
    displayCurrNumber();
}

function displayCurrNumber() {
    if (numbers.length === 0) {
        if (!value1) {
            displayCurr.textContent = '0';
        } else {
            displayCurr.textContent = value1;
        }
        let clearBtn = document.querySelector('button[value="C"]');
        if (clearBtn) {
            clearBtn.textContent = "AC";
            clearBtn.value = "AC";
        }
    } else {
        displayCurr.textContent = numbers.reduce((prev, curr) => prev + curr);
    }
    if (numbers.length !== 0) {
        let clearBtn = document.querySelector('button[value="AC"]');
        if (clearBtn) {
            clearBtn.textContent = "C";
            clearBtn.value = "C";
        }
    }
    setTime();
}

setTime();
displayCurrNumber();





