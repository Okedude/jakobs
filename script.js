const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const jakobSizeDisplay = document.getElementById("jakobSize");
const hochstrasserSizeDisplay = document.getElementById("hochstrasserSize");
const replayButton = document.getElementById("replayButton");
const gameMessage = document.getElementById("game-message");
const level2Button = document.createElement("button");
level2Button.textContent = "Level 2";
level2Button.style.position = "absolute";
level2Button.style.top = "60px";
level2Button.style.left = "50%";
level2Button.style.transform = "translateX(-50%)";
level2Button.style.display = "none";
document.getElementById("game-container").appendChild(level2Button);

const level3Button = document.createElement("button");
level3Button.textContent = "Level 3";
level3Button.style.position = "absolute";
level3Button.style.top = "100px";
level3Button.style.left = "50%";
level3Button.style.transform = "translateX(-50%)";
level3Button.style.display = "none";
document.getElementById("game-container").appendChild(level3Button);

const level4Button = document.createElement("button");
level4Button.textContent = "Level 4";
level4Button.style.position = "absolute";
level4Button.style.top = "140px";
level4Button.style.left = "50%";
level4Button.style.transform = "translateX(-50%)";
level4Button.style.display = "none";
document.getElementById("game-container").appendChild(level4Button);

const restartLevel1Button = document.createElement("button");
restartLevel1Button.textContent = "Restart from Level 1";
restartLevel1Button.style.position = "absolute";
restartLevel1Button.style.top = "180px";
restartLevel1Button.style.left = "50%";
restartLevel1Button.style.transform = "translateX(-50%)";
restartLevel1Button.style.display = "none";
document.getElementById("game-container").appendChild(restartLevel1Button);

// Level-Auswahl-Element erstellen
const levelSelection = document.createElement("div");
levelSelection.style.position = "absolute";
levelSelection.style.top = "20px";
levelSelection.style.right = "20px";
levelSelection.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
levelSelection.style.padding = "10px";
levelSelection.style.borderRadius = "5px";
levelSelection.style.color = "white";
document.getElementById("game-container").appendChild(levelSelection);

// Level-Auswahl-Buttons erstellen
for (let i = 1; i <= 4; i++) {
    const levelButton = document.createElement("button");
    levelButton.textContent = `Level ${i}`;
    levelButton.style.display = "block";
    levelButton.style.marginBottom = "5px";
    levelButton.addEventListener("click", () => {
        if (i > level + 1) {
            // Fehlermeldung anzeigen
            const errorMessage = document.createElement("div");
            errorMessage.textContent = "Dieses Level haben Sie noch nicht freigeschaltet.";
            errorMessage.style.position = "absolute";
            errorMessage.style.top = "50%";
            errorMessage.style.left = "50%";
            errorMessage.style.transform = "translate(-50%, -50%)";
            errorMessage.style.backgroundColor = "red";
            errorMessage.style.color = "white";
            errorMessage.style.padding = "10px";
            errorMessage.style.borderRadius = "5px";
            document.body.appendChild(errorMessage);

            // Fehlermeldung nach 5 Sekunden entfernen
            setTimeout(() => {
                errorMessage.remove();
            }, 5000);
        } else {
            level = i;
            resetGame();
            gameLoop();
        }
    });
    levelSelection.appendChild(levelButton);
}

// Farben
const JAKOB_COLOR = "blue";
const HOCHSTRASSER_COLOR = "red";
const GREEN_ORB_COLOR = "green";
const VIOLET_ORB_COLOR = "violet";
const GRAY_ORB_COLOR = "gray";
const YELLOW_ORB_COLOR = "yellow";
const BEIGE_ORB_COLOR = "beige";
const BLACK_ORB_COLOR = "black";
const SPEED_ORB_COLOR = "orange";
const OBSTACLE_COLOR = "black";

const TEXT_COLOR = "white";

// Jakob-Figur (Kreis)
let jakobRadius;
let jakobX;
let jakobY;
let jakobSpeed = 5; // Jakob's Geschwindigkeit wurde reduziert
let jakobSpeedMultiplier = 1; // Multiplikator für Jakob's Geschwindigkeit

// Hochstrasser (roter Kreis)
let hochstrasserRadius;
let hochstrasserX;
let hochstrasserY;
let hochstrasserSpeed;
let hochstrasserDirectionX;
let hochstrasserDirectionY;

// Orbs
let orbs;
const orbCount = 10;

// Hindernisse
let obstacles;
let obstacleCount = 5;

// Tastenstatus
const keys = {};

// Spielstatus
let gameOver = false;
let win = false;
let level = 1;

function resetGame() {
    // Standardwerte zurücksetzen
    jakobRadius = 25;
    jakobX = Math.random() * canvas.width;
    jakobY = Math.random() * canvas.height;
    hochstrasserRadius = jakobRadius * 2; // Standardgröße für Hochstrasser
    hochstrasserX = Math.random() * canvas.width;
    hochstrasserY = Math.random() * canvas.height;
    hochstrasserSpeed = jakobSpeed * 1; // Standardgeschwindigkeit für Hochstrasser
    hochstrasserDirectionX = (Math.random() - 0.5) * 2;
    hochstrasserDirectionY = (Math.random() - 0.5) * 2;
    orbs = [];
    obstacleCount = 5;
    obstacles = [];
    gameOver = false;
    win = false;
    gameMessage.style.display = "none";
    level2Button.style.display = "none";
    level3Button.style.display = "none";
    level4Button.style.display = "none";
    restartLevel1Button.style.display = "none";
    canvas.style.backgroundColor = "#ddd";
    jakobSpeedMultiplier = 1;

    // Level-spezifische Änderungen anwenden
    if (level === 2) {
        hochstrasserSpeed = jakobSpeed * 1.25;
    } else if (level === 3) {
        hochstrasserSpeed = jakobSpeed * 1.5;
        createObstacles();
    } else if (level === 4) {
        hochstrasserSpeed = jakobSpeed * 1.75;
        hochstrasserRadius = jakobRadius * 3;
        obstacleCount = 8;
        createObstacles();
    }

    createOrbs();
}

function createOrbs() {
    orbs = [];
    for (let i = 0; i < orbCount; i++) {
        const randomValue = Math.random();
        let orbColor = GREEN_ORB_COLOR;
        let orbSizeIncrease = 0.01;
        let orbShape = "circle";

        if (randomValue < 0.10) {
            orbColor = VIOLET_ORB_COLOR;
            orbSizeIncrease = 0.02;
        } else if (randomValue < 0.15) {
            orbColor = GRAY_ORB_COLOR;
            orbSizeIncrease = 0.05;
        } else if (randomValue < 0.175) {
            orbColor = YELLOW_ORB_COLOR;
            orbSizeIncrease = 0.1;
        } else if (randomValue < 1 / 75) {
            orbColor = BEIGE_ORB_COLOR;
            orbSizeIncrease = 1;
        } else if (randomValue < 1 / 23 && level === 4) {
            orbColor = SPEED_ORB_COLOR;
            orbShape = "triangle";
        } else if (randomValue < 1 / 100) {
            orbColor = BLACK_ORB_COLOR;
            orbSizeIncrease = 5;
        }

        orbs.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: orbColor === BLACK_ORB_COLOR ? 65 : Math.floor(Math.random() * 11) + 10,
            color: orbColor,
            sizeIncrease: orbSizeIncrease,
            shape: orbShape,
        });
    }
}

function createObstacles() {
    obstacles = [];
    for (let i = 0; i < obstacleCount; i++) {
        obstacles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            width: Math.floor(Math.random() * 50) + 20,
            height: Math.floor(Math.random() * 50) + 20,
        });
    }
}

resetGame();

// Spielschleife
function gameLoop() {
    if (gameOver || win) return;

    let newJakobX = jakobX;
    let newJakobY = jakobY;
    if (keys["w"]) newJakobY -= jakobSpeed * jakobSpeedMultiplier;
    if (keys["s"]) newJakobY += jakobSpeed * jakobSpeedMultiplier;
    if (keys["a"]) newJakobX -= jakobSpeed * jakobSpeedMultiplier;
    if (keys["d"]) newJakobX += jakobSpeed * jakobSpeedMultiplier;

    let jakobCollides = false;
    if (level === 3 || level === 4) {
        obstacles.forEach((obstacle) => {
            if (newJakobX + jakobRadius > obstacle.x &&
                newJakobX - jakobRadius < obstacle.x + obstacle.width &&
                newJakobY + jakobRadius > obstacle.y &&
                newJakobY - jakobRadius < obstacle.y + obstacle.height) {
                jakobCollides = true;
            }
        });
    }

    if (!jakobCollides) {
        jakobX = newJakobX;
        jakobY = newJakobY;
    }

    hochstrasserX += hochstrasserDirectionX * hochstrasserSpeed;
    hochstrasserY += hochstrasserDirectionY * hochstrasserSpeed;

    let hochstrasserCollides = false;
    let collisionSide = null; // Speichert die Kollisionsseite (top, bottom, left, right)

    if (level === 3 || level === 4) {
        obstacles.forEach((obstacle) => {
            if (hochstrasserX + hochstrasserRadius > obstacle.x &&
                hochstrasserX - hochstrasserRadius < obstacle.x + obstacle.width &&
                hochstrasserY + hochstrasserRadius > obstacle.y &&
                hochstrasserY - hochstrasserRadius < obstacle.y + obstacle.height) {
                hochstrasserCollides = true;

                // Bestimme die Kollisionsseite
                const dx = hochstrasserX - (obstacle.x + obstacle.width / 2);
                const dy = hochstrasserY - (obstacle.y + obstacle.height / 2);
                const width = (obstacle.width + hochstrasserRadius) / 2;
                const height = (obstacle.height + hochstrasserRadius) / 2;
                const crossWidth = width * dy;
                const crossHeight = height * dx;

                if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
                    if (crossWidth > crossHeight) {
                        collisionSide = (crossWidth > -crossHeight) ? "bottom" : "left";
                    } else {
                        collisionSide = (crossWidth > -crossHeight) ? "right" : "top";
                    }
                }
            }
        });
    }

    if (hochstrasserCollides) {
        // Hochstrasser prallt ab, basierend auf der Kollisionsseite
        if (collisionSide === "left" || collisionSide === "right") {
            hochstrasserDirectionX *= -1;
        }
        if (collisionSide === "top" || collisionSide === "bottom") {
            hochstrasserDirectionY *= -1;
        }
    } else {
        hochstrasserX += hochstrasserDirectionX * hochstrasserSpeed;
        hochstrasserY += hochstrasserDirectionY * hochstrasserSpeed;
    }

    if (hochstrasserX < 0 || hochstrasserX > canvas.width) {
        hochstrasserDirectionX *= -1;
    }
    if (hochstrasserY < 0 || hochstrasserY > canvas.height) {
        hochstrasserDirectionY *= -1;
    }

    if (level !== 3 && level !== 4) {
        for (let i = orbs.length - 1; i >= 0; i--) {
            const orb = orbs[i];
            const dxHochstrasser = hochstrasserX - orb.x;
            const dyHochstrasser = hochstrasserY - orb.y;
            const distanceHochstrasser = Math.sqrt(dxHochstrasser * dxHochstrasser + dyHochstrasser * dyHochstrasser);

            if (distanceHochstrasser < hochstrasserRadius + orb.radius) {
                orbs.splice(i, 1);
                hochstrasserRadius += hochstrasserRadius * orb.sizeIncrease;
            }
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = JAKOB_COLOR;
    ctx.beginPath();
    ctx.arc(jakobX, jakobY, jakobRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = TEXT_COLOR;
    ctx.font = "20px Arial";
    ctx.fillText("Jakob", jakobX - 20, jakobY - jakobRadius - 10);

    ctx.fillStyle = HOCHSTRASSER_COLOR;
    ctx.beginPath();
    ctx.arc(hochstrasserX, hochstrasserY, hochstrasserRadius, 0, Math.PI * 2);
    ctx.fill();

    orbs.forEach((orb) => {
        ctx.fillStyle = orb.color;
        ctx.beginPath();
        if (orb.shape === "triangle") {
            ctx.moveTo(orb.x, orb.y - orb.radius);
            ctx.lineTo(orb.x + orb.radius, orb.y + orb.radius);
            ctx.lineTo(orb.x - orb.radius, orb.y + orb.radius);
        } else {
            ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        }
        ctx.fill();
    });

    if (level === 3 || level === 4) {
        obstacles.forEach((obstacle) => {
            ctx.fillStyle = OBSTACLE_COLOR;
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    const dx = jakobX - hochstrasserX;
    const dy = jakobY - hochstrasserY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < hochstrasserRadius && hochstrasserRadius > jakobRadius) {
        gameOver = true;
    }

    if (distance < jakobRadius && jakobRadius > hochstrasserRadius) {
        win = true;
    }

    for (let i = orbs.length - 1; i >= 0; i--) {
        const orb = orbs[i];
        const dxOrb = jakobX - orb.x;
        const dyOrb = jakobY - orb.y;
        const distanceOrb = Math.sqrt(dxOrb * dxOrb + dyOrb * dyOrb);

        if (distanceOrb < jakobRadius + orb.radius) {
            orbs.splice(i, 1);
            if (orb.color === SPEED_ORB_COLOR) {
                jakobSpeedMultiplier += 0.1;
            } else if (orb.color === BLACK_ORB_COLOR && jakobRadius > orb.radius) {
                jakobRadius *= 6;
            } else if (orb.color !== BLACK_ORB_COLOR) {
                jakobRadius += jakobRadius * orb.sizeIncrease;
            }
            orbs.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.floor(Math.random() * 11) + 10,
                color: GREEN_ORB_COLOR,
                sizeIncrease: 0.01,
                shape: "circle",
            });
        }
    }

    if (level === 4) {
        for (let i = orbs.length - 1; i >= 0; i--) {
            const orb = orbs[i];
            const dxOrb = hochstrasserX - orb.x;
            const dyOrb = hochstrasserY - orb.y;
            const distanceOrb = Math.sqrt(dxOrb * dxOrb + dyOrb * dyOrb);

            if (distanceOrb < hochstrasserRadius + orb.radius) {
                orbs.splice(i, 1);
                if (orb.color === BLACK_ORB_COLOR && hochstrasserRadius > 100) {
                    hochstrasserRadius *= 6;
                } else if (orb.color !== BLACK_ORB_COLOR) {
                    hochstrasserRadius += hochstrasserRadius * orb.sizeIncrease;
                }
            }
        }
    }

    if (orbs.length === 0) {
        for (let i = 0; i < 15; i++) {
            orbs.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.floor(Math.random() * 11) + 10,
                color: GREEN_ORB_COLOR,
                sizeIncrease: 0.01,
                shape: "circle",
            });
        }
    }

    if (gameOver) {
        canvas.style.backgroundColor = "red";
        gameMessage.textContent = "Tot.";
        gameMessage.style.display = "block";
        if (level === 2 || level === 3 || level === 4) {
            restartLevel1Button.style.display = "block";
        }
    } else if (win) {
        canvas.style.backgroundColor = "green";
        gameMessage.textContent = "Gut.";
        gameMessage.style.display = "block";
        if (level === 1) {
            level2Button.style.display = "block";
        } else if (level === 2) {
            level3Button.style.display = "block";
        } else if (level === 3) {
            level4Button.style.display = "block";
        }
        // "Nächstes Level"-Button hinzufügen
        if (level < 4) {
            const nextLevelButton = document.createElement("button");
            nextLevelButton.textContent = `Nächstes Level (${level + 1})`;
            nextLevelButton.style.position = "absolute";
            nextLevelButton.style.top = "220px";
            nextLevelButton.style.left = "50%";
            nextLevelButton.style.transform = "translateX(-50%)";
            nextLevelButton.addEventListener("click", () => {
                level++;
                resetGame();
                gameLoop();
                nextLevelButton.remove(); // Button nach Klick entfernen
            });
            document.getElementById("game-container").appendChild(nextLevelButton);
        }
    }

    jakobSizeDisplay.textContent = `Jakob: ${Math.floor(jakobRadius)}`;
    hochstrasserSizeDisplay.textContent = `Hochstrasser: ${Math.floor(hochstrasserRadius)}`;

    // Steuerungshinweise hinzufügen
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = "16px Arial";
    ctx.fillText("Steuerung:", 10, 20);
    ctx.fillText("W: Vorwärts", 10, 40);
    ctx.fillText("S: Rückwärts", 10, 60);
    ctx.fillText("A: Links", 10, 80);
    ctx.fillText("D: Rechts", 10, 100);

    requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

replayButton.addEventListener("click", () => {
    resetGame();
    gameLoop();
});

level2Button.addEventListener("click", () => {
    level = 2;
    resetGame();
    gameLoop();
});

level3Button.addEventListener("click", () => {
    level = 3;
    resetGame();
    gameLoop();
});

level4Button.addEventListener("click", () => {
    level = 4;
    resetGame();
    gameLoop();
});

restartLevel1Button.addEventListener("click", () => {
    level = 1;
    resetGame();
    gameLoop();
});

gameLoop();
