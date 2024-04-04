const backGround = document.querySelector('.container');

const button = document.querySelector('.button');

const colorName = document.querySelector('.colorName');

const color = ['red', 'aliceblue', 'chocolate', 'yellow', 'pink', 'blue', 'chartreuse', 'gray', 'purple', 'aqua', 'darkgoldenrod']

console.log('We have ' + color.length + ' Background Colors');
const random = () => {
    const randomIndex = parseInt(Math.random() * color.length);
    backGround.style.backgroundColor = color[randomIndex]
    colorName.innerHTML = 'Color is - ' + color[randomIndex];
    colorName.style.color = color[randomIndex];
    console.log('index = ' + randomIndex + ' and color is = ' + color[randomIndex]);
};

button.addEventListener('click', random);