function calculate() {
    const calcType = document.getElementById("calcType").value;
    const expression = document.getElementById("expression").value;
    const resultDiv = document.getElementById("result");
    const graphCanvas = document.getElementById("graphCanvas");
    const ctx = graphCanvas.getContext("2d");

    graphCanvas.style.display = "none";
    resultDiv.innerHTML = "";

    try {
        switch (calcType) {
            case "linear":
                resultDiv.innerHTML = `<strong>Solution:</strong> ${solveLinearEquation(expression)}`;
                break;
            case "quadratic":
                resultDiv.innerHTML = `<strong>Solution:</strong> ${solveQuadraticEquation(expression)}`;
                break;
            case "triangle":
                resultDiv.innerHTML = `<strong>Area:</strong> ${calculateTriangleArea(expression)}`;
                break;
            case "pythagorean":
                resultDiv.innerHTML = `<strong>Hypotenuse:</strong> ${calculatePythagorean(expression)}`;
                break;
            case "graph":
                graphFunction(expression, ctx);
                graphCanvas.style.display = "block";
                resultDiv.innerHTML = "<strong>Graph:</strong> See below";
                break;
        }
    } catch (error) {
        resultDiv.innerHTML = `<strong>Error:</strong> ${error.message}`;
    }
}

function solveLinearEquation(equation) {
    const parts = equation.split("=");
    if (parts.length !== 2) throw new Error("Use format like 'x + 3 = 6'");

    const left = parts[0].trim();
    const right = parts[1].trim();

    const xTerm = left.includes("x") ? left : right;
    const constantTerm = left.includes("x") ? right : left;

    const xCoefficient = parseFloat(xTerm.replace("x", "")) || 1;
    const constant = parseFloat(constantTerm);

    if (isNaN(constant)) throw new Error("Invalid numbers");

    const xValue = constant / xCoefficient;
    return `x = ${xValue}`;
}

function solveQuadraticEquation(equation) {
    const parts = equation.split("=");
    if (parts.length !== 2) throw new Error("Use format like 'x² - 5x + 6 = 0'");

    const quadratic = parts[0].trim().replace(/\s+/g, "");
    const [a, b, c] = quadratic.split(/x\²|x/).map(term => parseFloat(term) || 0);

    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return "No real solutions";

    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);

    return `x = ${x1} or x = ${x2}`;
}

function calculateTriangleArea(input) {
    const values = input.split(/\s+/).reduce((acc, val) => {
        const [key, value] = val.split("=");
        acc[key] = parseFloat(value);
        return acc;
    }, {});

    if (!values.base || !values.height) throw new Error("Use format like 'base=5 height=10'");

    const area = 0.5 * values.base * values.height;
    return area;
}

function calculatePythagorean(input) {
    const values = input.split(/\s+/).reduce((acc, val) => {
        const [key, value] = val.split("=");
        acc[key] = parseFloat(value);
        return acc;
    }, {});

    if (!values.a || !values.b) throw new Error("Use format like 'a=3 b=4'");

    const hypotenuse = Math.sqrt(values.a * values.a + values.b * values.b);
    return hypotenuse;
}

function graphFunction(expression, ctx) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight / 2);
    ctx.lineTo(canvasWidth, canvasHeight / 2);
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.strokeStyle = "white";
    ctx.stroke();

    // Plot function
    const yExpression = expression.replace("y = ", "").trim();
    ctx.strokeStyle = "#e74c3c";
    ctx.beginPath();

    for (let x = -10; x <= 10; x += 0.1) {
        let y;
        try {
            y = eval(yExpression.replace(/x/g, `(${x})`));
        } catch (e) {
            continue;
        }
        const plotX = (x + 10) * (canvasWidth / 20);
        const plotY = (canvasHeight / 2) - (y * (canvasHeight / 20));
        if (x === -10) ctx.moveTo(plotX, plotY);
        else ctx.lineTo(plotX, plotY);
    }
    ctx.stroke();
}
