// dashboard.js

const canvas = document.getElementById("revenueChart");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = 320;

const points = [
    { x: 0, y: 230 },
    { x: 180, y: 180 },
    { x: 360, y: 150 },
    { x: 540, y: 120 },
    { x: 720, y: 90 },
    { x: 900, y: 60 }
];

function drawChart() {

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // grid
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth = 1;

    for (let i = 0; i < 5; i++) {

        const y = i * 70 + 20;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // line
    ctx.beginPath();

    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.strokeStyle = "#7B1F1F";
    ctx.lineWidth = 4;
    ctx.stroke();

    // dots
    points.forEach(point => {

        ctx.beginPath();

        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);

        ctx.fillStyle = "#C9973A";
        ctx.fill();

        ctx.strokeStyle = "#7B1F1F";
        ctx.lineWidth = 3;
        ctx.stroke();
    });
}

drawChart();

window.addEventListener("resize", () => {

    canvas.width = canvas.offsetWidth;
    drawChart();
});