let selectedElement = null;
let offset = { x: 0, y: 0 };
let isMoving = false;
let isRotating = false;

const board = document.querySelector('.board');

// Функция для случайного размещения фигур
const randomizePositions = () => {
    const draggables = document.querySelectorAll('.draggable');
    const boardRect = board.getBoundingClientRect();

    draggables.forEach(item => {
        const randomX = Math.random() * (boardRect.width - item.offsetWidth);
        const randomY = Math.random() * (boardRect.height - item.offsetHeight);

        const randomAngle = Math.random() * 360;

        item.style.left = randomX + 'px';
        item.style.top = randomY + 'px';
        item.style.transform = `rotate(${randomAngle}deg)`;
    });
}

// Проверить правильно ли собраны фигуры
const checkPositions = () => {
    const houseRect = document.getElementById("house").getBoundingClientRect();
    const toysRect = document.getElementById("toys").getBoundingClientRect();
    const dogRect = document.getElementById("dog").getBoundingClientRect();
    const foodRect = document.getElementById("food").getBoundingClientRect();

    const validateRotation = (elementId) => {
        const rotation = parseFloat(document.getElementById(elementId).style.transform.replace(/[^0-9.-]/g, '')) || 0;
        const normalizedRotation = ((Math.abs(rotation) + 180) % 360) - 180; 
        return normalizedRotation;
    };

    const houseRotation = validateRotation("house");
    const toysRotation = validateRotation("toys");
    const dogRotation = validateRotation("dog");
    const foodRotation = validateRotation("food");

    const isValidPos = toysRect.left >= houseRect.left + 97
    && toysRect.left <= houseRect.left + 137 
    && toysRect.top >= houseRect.top + 103 
    && toysRect.top <= houseRect.top + 130
    && toysRect.left >= houseRect.left + 97
    && toysRect.left <= houseRect.left + 137 
    && toysRect.top >= houseRect.top + 103 
    && toysRect.top <= houseRect.top + 130
    && dogRect.left >= houseRect.left - 66 
    && dogRect.left <= houseRect.left + 84 
    && dogRect.top >= houseRect.top + 10 
    && dogRect.top <= houseRect.top + 74
    && foodRect.left >= dogRect.left - 35 
    && foodRect.left <= dogRect.left + 25 
    && foodRect.top >= dogRect.top + 95 
    && foodRect.top <= dogRect.top + 122
    && houseRotation >= -5 && houseRotation <= 5
    && toysRotation >= -10 && toysRotation <= 10
    && dogRotation >= -5 && dogRotation <= 5
    && foodRotation >= -5 && foodRotation <= 5

    if (isValidPos) return true
    return false;
}

// Показать анимацию успешной сборки фигур
const showSuccessAnimation = () => {
    const successAnimation = document.getElementById("successAnimation");
    successAnimation.style.display = 'block'; 
    successAnimation.style.opacity = '1'; 

    setTimeout(() => {
        successAnimation.style.opacity = '0'; 
        setTimeout(() => {
            successAnimation.style.display = 'none'; 
        }, 500); 
    }, 500);
}

// Обработка кнопки "Показать правильное положение фигур"
const showRightPositions = () => {
    const img = document.getElementById("rightPositionsImg");
    img.style.display = 'block';
}

// Обработка клика по фигурам
document.querySelectorAll('.draggable').forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation(); 
        if (selectedElement === item) {
            isMoving = false;
            selectedElement = null;
            board.classList.remove('no-pointer-events');
        } else {
            selectedElement = item;
            offset.x = e.clientX - item.getBoundingClientRect().left;
            offset.y = e.clientY - item.getBoundingClientRect().top;
            isMoving = true;
            board.classList.add('no-pointer-events');
            document.body.classList.add('cursor-rotate');
        }
    });
});

// Обработка нажатия кнопки мыши
document.addEventListener('mousedown', () => {
    if (isMoving) {
        isRotating = true;
    }
});

// Заканчиваем перетаскивание и вращение при отпускании мыши
document.addEventListener('mouseup', () => {
    isRotating = false; 
    isMoving = false; 
    selectedElement = null;
    board.classList.remove('no-pointer-events');
    document.body.classList.remove('cursor-rotate');
});

board.addEventListener('mouseup', () => {
    if (checkPositions()) showSuccessAnimation();
})

// Обработка движения мыши
document.addEventListener('mousemove', (e) => {
    if (isRotating && selectedElement) {
        const deltaY = e.movementY;
        const rotationAmount = deltaY * 2;
        const currentRotation = parseFloat(selectedElement.style.transform.replace(/[^0-9.-]/g, '')) || 0;
        selectedElement.style.transform = `rotate(${currentRotation + rotationAmount}deg)`;
    } else if (isMoving && selectedElement) {
        let newX = e.clientX - offset.x;
        let newY = e.clientY - offset.y;

        const boardRect = board.getBoundingClientRect();
        const elementRect = selectedElement.getBoundingClientRect();

        if (newX < boardRect.left) newX = boardRect.left;
        if (newY < boardRect.top) newY = boardRect.top;
        if (newX + elementRect.width > boardRect.right) newX = boardRect.right - elementRect.width;
        if (newY + elementRect.height > boardRect.bottom) newY = boardRect.bottom - elementRect.height;

        selectedElement.style.left = newX - boardRect.left + 'px';
        selectedElement.style.top = newY - boardRect.top + 'px';  
    }
});

randomizePositions();
