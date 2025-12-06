const display = document.getElementById("display");

function ClickToDisplay(input) {

    const operators = ["+", "-", "*", "/", "%"];
    if (operators.includes(input)) {
        let lastChar = display.value.slice(-1);
        if (operators.includes(lastChar)) return;
    }

    if (input === ".") {
        let parts = display.value.split(/[\+\-\*\/]/);
        let lastPart = parts[parts.length - 1];
        if (lastPart.includes(".")) return;
    }

    display.value += input;
}

function ClickToCorrect() {
    display.value = display.value.slice(0, -1);
}

function ClickToErase() {
    display.value = "";
}

function SumAndSubtract() {
    if (!display.value) return;

    let num = Number(display.value);
    display.value = String(num * -1);
}

function WrongCal() {
    display.value = "Error";
    setTimeout(() => display.value = "", 1200);
}

function Calculate() {
    if (!display.value) return;

    try {
        let result = eval(display.value);
        if (isNaN(result) || result === Infinity) {
            WrongCal();
            return;
        }
        display.value = result;
    } catch {
        WrongCal();
    }
}
