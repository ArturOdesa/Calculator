
let numbers = [];
let actions = [];
let btn;
let btnKey;
let value1;
let value2;
let operation;
let result;

let displayCurr = document.querySelector('#output-field-bottom');
let allBtns = document.querySelectorAll('button');
let calculatorBtns = document.querySelector('.calc-btns');
calculatorBtns.addEventListener('click', btnsClickHandler);
document.addEventListener('keydown', keydownHandler);

function keydownHandler (e) {
    btnKey = e.key;
    if (btnKey === 'Enter') {
        e.preventDefault();
        createSecondOperand();
    }
    if (!isNaN(btnKey) || btnKey === '.') {
        console.log(btnKey)
        if (btnKey === '.' && numbers.length === 0) {
            numbers.push('0', '.')
        }
        else {
            if (numbers.includes('.', 0) && btnKey === '.') {
                return;
            }
            else {
                numbers.push(btnKey);
            }
        }
        displayCurrNumber();
    }
    else if (btnKey !== 'Enter' && isNaN(btnKey)) {
        if (numbers.length === 0 && btnKey === '-' && !result && !value1) {
            numbers.push(btnKey);
            displayCurrNumber();
        }
        else {
            if (btnKey === actions[actions.length - 1]) {
                createSecondOperand();
            }
            else {
                actions.push(btnKey);
                createFirstOperand();
                console.log(actions);
            }
        }
        if (btnKey === 'Backspace' && numbers.length !== 0) {
            clearNumber();
            actions.pop()
        }
        else if (btnKey === 'Backspace' && numbers.length === 0) {
            clearAllData();
        }
    }
}

function btnsClickHandler(e) {
    btn = e.target;
    if ((!isNaN(btn.value) || btn.value === '.')) {
        if (btn.value === '.' && numbers.length === 0) {
            numbers.push('0', '.')
        }
        else {
            if (numbers.includes('.', 0) && btn.value === '.') {
                return;
            }
            else {
                numbers.push(btn.value);
            }
        }
        displayCurrNumber();
    }
    else if (btn.value !== '=' && btn.value !== 'AC' && btn.value !== 'reverse' && btn.value !== 'C') {
        if (btn.value === '%') {
            actions.push(btn.value);
            console.log(actions);
            calculating();
        }
        else {
            if (btn.value === actions[actions.length - 1]) {
                createSecondOperand();
            }
            else {
                actions.push(btn.value);
                createFirstOperand();
                console.log(actions);
            }
        }
    }
    else {
        console.log(btn.value)
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
    if (result) {
        value1 = Number(value1) * -1;
        value1 = String(value1);
    }
    else {
        if (numbers[0] !== "-") {
        numbers.unshift("-");
        console.log(numbers)
        }
        else {
        numbers.shift();
        }
    }
    displayCurrNumber();
}

function clearNumber() {
    numbers=[];
    displayCurrNumber();
}

function clearAllData() {
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
            console.log(result);
            value1 = result;
        }
        else {
            value1 = numbers.reduce((prev, curr) => prev + curr);
            numbers = [];
        }

        console.log(value1);
    }
    else {
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
    if (actions.length === 0) {
        value1 = numbers.reduce((prev, curr) => prev + curr);
        return;
    }
    if (numbers.length !== 0){
        value2 = numbers.reduce((prev, curr) => prev + curr);
        numbers = [];
        console.log(value2)
    }
    else {
        value2 = value1;
        console.log(value2);
    }
    calculating();
}

function createSecondOperandPercent() {
    if (numbers.length !== 0){
        value2 = numbers.reduce((prev, curr) => prev + curr);
        numbers = [];
        console.log(value2)
    }
    else {
        value2 = value1;
        console.log(value2);
    }
}

function calculating() {
    let action = actions[actions.length - 1];
    if (action === "%") {
        if (actions.length === 1) {
            createFirstOperand();
            operation = `${value1} * 0.01`;
            result = eval(operation);
            result = parseFloat(result.toFixed(3));
            value1 = String(result);
        }
        else if (actions.length > 1) {
            createSecondOperandPercent();
            operation = operation = `${value1} ${actions[actions.length - 2]} (${value1} / 100 * ${value2})`;
            console.log(operation);
            result = eval(operation);
            result = parseFloat(result.toFixed(3));
            value1 = String(result);
            console.log(value1)
        }
    }
    else {
        if (action === "/" && value2 === '0') {
            value1 = 'Error'
            clearNumber();
        }
        else {
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
        }
        else {
            displayCurr.textContent = value1;
        }
        let clearBtn = document.querySelector('button[value="C"]');
        if (clearBtn) {
            clearBtn.textContent = "AC";
            clearBtn.value = "AC";
        }
    }
    else {
        displayCurr.textContent = numbers.reduce((prev, curr) => prev + curr);
    }
    if (numbers.length !== 0) {
        let clearBtn = document.querySelector('button[value="AC"]');
        if (clearBtn){
        clearBtn.textContent = "C";
        clearBtn.value = "C";
        }
    }
}

displayCurrNumber();

//  for touched buttons (+ - / *)
//
// for (let button of allBtns) {
//     if (btn.value === button.value) {
//         button.classList.add('test')
//         console.log(allBtns);
//     }
// }



