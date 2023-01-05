const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
let paddleIndex = 0;

let width = 500;
let height = 650

//paddle
let paddleHeight = 10
let paddleWidth = 50
let paddleDiff = 25
let paddleX = [225, 255]
let trajectoryX = [0, 0]
let playerMoved = false

//ball
let ballX = 250
let ballY = 350
let ballRadius = 5
let ballDirection = 1

//speed
let speedY = 2
let speedX = 0
let computerSpeed = 4

//score for both players
let score = [0, 0]



function createCanvas() {
    canvas.className = 'play-ground'
    canvas.width = width
    canvas.height = height

    document.body.appendChild(canvas)
    renderCanvas()
}

//wait for opponents

function renderIntro() {
    //canvas background
    context.fillStyle = 'black'
    context.fillRect(0, 0, width, height)

    //intro text
    context.fillStyle = 'white'
    context.font = '32px Courier New'
    context.fillText("Waiting for opponent...", 20, (canvas.height / 2) - 30)
}

//Render everything on canvas
function renderCanvas() {
    //canvas background
    context.fillStyle = 'black'
    context.fillRect(0, 0, width, height)

    //paddle color
    context.fillStyle = 'white'

    //bottom paddle
    context.fillRect(paddleX[0], height - 20, paddleWidth, paddleHeight)

    //top paddle
    context.fillRect(paddleX[1], 10, paddleWidth, paddleHeight)

    //Dashed centerline
    context.beginPath()
    context.setLineDash([4])
    context.moveTo(0, height / 2)
    context.lineTo(500, height / 2)
    context.strokeStyle = 'grey'
    context.stroke()

    //ball
    context.beginPath()
    context.arc(ballX, ballY, ballRadius, 2 * Math.PI, false)
    context.fill()

    //score
    context.font = '32px Courier New'
    context.fillText(score[0], 20, (canvas.height / 2) + 50)
    context.fillText(score[1], 20, (canvas.height / 2) - 50)
}

//reset ball to center
function ballReset() {
    ballX = width / 2
    ballY = height / 2
    speedY = 3
    speedX = 0
    trajectoryX = [0,0]
}

//adjust ball movement
function ballMove() {
    //vertical speed
    ballY += speedY * ballDirection

    //horizontal speed
    if (playerMoved) {
        ballX += speedX
    }
}

//Determine what the ball bounces off, score points, reset ball
function ballBoundaries() {
    //bounce off left wall
    if (ballX < 0 && speedX < 0) {
        speedX = -speedX
    }

    //bounce off the right wall
    if (ballX > width && speedX > 0) {
        speedX = -speedX
    }

    //bounce off player paddle -bottom
    if (ballY > height - paddleDiff) {
        if (ballX >= paddleX[0] && ballX <= paddleX[0] + paddleWidth) {
            //add speed on hit
            if (playerMoved) {
                speedY += 1
                //max speed
                if (speedY > 5) {
                    speedY = 5
                }
                ballDirection = -ballDirection
                trajectoryX[0] = ballX - (paddleX[0] + paddleDiff)
                speedX = trajectoryX[0] * 0.3
            }
        } else {
            //reset ball, add to computer score
            ballReset()
            score[1]++
        }
    }

    //bounce off computer paddle -top
    if (ballY < paddleDiff) {
        console.log("computer hit")
        if (ballX >= paddleX[1] && ballX <= paddleX[1] + paddleWidth) {
            //add speed on hit

            if (playerMoved) {
                speedY += 1

                //max speed reset
                if (speedY > 5) {
                    speedY = 5
                }
            }
            ballDirection = -ballDirection
            trajectoryX[1] = ballX - (paddleX[1] - paddleDiff)
            speedX = trajectoryX[1] * 0.03
        } else {
            // reset ball, increase computer difficulty, add to player score
            if (computerSpeed < 6) {
                computerSpeed += 0.5
            }
            ballReset()
            score[0]++
        }
    }
}

//computer movement
function computerAI() {
    if (playerMoved) {
        if (paddleX[1] + paddleDiff < ballX) {
            paddleX[1] += computerSpeed
        } else {
            paddleX[1] -= computerSpeed
        }
        if (paddleX[1] < 0) {
            paddleX[1] = 0
        } else if (paddleX[1] > width - paddleWidth) {
            paddleX[1] = width - paddleWidth
        }
    }
}

//called every frame
function animate() {
    computerAI()
    ballMove()
    renderCanvas()
    ballBoundaries()
    // console.log({ballY, speedX});

    window.requestAnimationFrame(animate)
}

// start game and reset everything
function startGame() {
    createCanvas()
    //renderIntro()

    paddleIndex = 0
    window.requestAnimationFrame(animate)
    canvas.addEventListener('mousemove', (e) => {
        playerMoved = true
        paddleX[paddleIndex] = e.offsetX
        if (paddleX[paddleIndex] < 0) {
            paddleX[paddleIndex] = 0
        }

        if (paddleX[paddleIndex] > (width - paddleWidth)) {
            paddleX[paddleIndex] = width - paddleWidth
        }
        //hide cursor
        canvas.style.cursor = 'none'
    })
}

//onload
startGame()