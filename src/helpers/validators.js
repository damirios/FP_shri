/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
const compose = (...funcs) => (arg) => funcs.reduceRight((result, currFunc) => currFunc(result), arg);
const allPass = (funcArr) => {
    return function(arg) {
        return funcArr.reduce((result, currFunc) => result && currFunc(arg), true);
    }
};
const anyPass = (funcArr) => {
    return function(arg) {
        return funcArr.reduce((result, currFunc) => result || currFunc(arg), false);
    }
};

const isAtLeastAmountColor = (argsArr, amount, color) => {
    let colorNumber = 0;
    return argsArr.reduce((prev, curr) => {
        colorNumber += (curr === color) ? 1 : 0;
        return colorNumber >= amount; 
    }, false);
}

const isExactNumberColor = (argsArr, amount, color) => {
    let colorNumber = 0;
    return argsArr.reduce((prev, curr) => {
        colorNumber += (curr === color) ? 1 : 0;
        return colorNumber === amount; 
    }, false);
}

const areFuncResultsEqual = (firstFunc, secondFunc) => (arg) => firstFunc(arg) === secondFunc(arg);

const checkEveryArgPass = (func) => (argsArr) => argsArr.reduce((result, arg) => result && func(arg), true);
const arePropsEqual = (firstProp, secondProp) => (obj) => obj[firstProp] === obj[secondProp];
const isTriangleEqualsToSquare = arePropsEqual('triangle', 'square');

const getObjValues = (obj) => Object.values(obj);
const getObjProp = (prop) => (obj) => obj[prop];

const getTriangle = getObjProp('triangle');
const getStar = getObjProp('star');
const getSquare = getObjProp('square');
const getCircle = getObjProp('circle');

const isWhite = (arg) => arg === 'white';
const isRed = (arg) => arg === 'red';
const isGreen = (arg) => arg === 'green';
const isBlue = (arg) => arg === 'blue';
const isOrange = (arg) => arg === 'orange';

const isWhiteTriangle = compose(isWhite, getTriangle);
const isWhiteCircle = compose(isWhite, getCircle);
const isGreenTriangle = compose(isGreen, getTriangle);
const isGreenSquare = compose(isGreen, getSquare);
const isRedStar = compose(isRed, getStar);
const isOrangeSquare = compose(isOrange, getSquare);
const isBlueCircle = compose(isBlue, getCircle);

const isWhiteCircleWhiteTriangleGreenSquareRedStar = allPass([isWhiteTriangle, isWhiteCircle, isRedStar, isGreenSquare]);
const isBlueCircleOrangeSquareRedStar = allPass([isBlueCircle, isOrangeSquare, isRedStar]);
const isRedOrWhiteStar = compose(anyPass([isRed, isWhite]), getStar);
const isAllOrange = compose(checkEveryArgPass(isOrange), getObjValues);
const isAllGreen = compose(checkEveryArgPass(isGreen), getObjValues);

const isAtLeastAmountGreen = (argsArr, amount) => isAtLeastAmountColor(argsArr, amount, 'green');
const isAtLeastTwoGreen = (argsArr) => isAtLeastAmountGreen(argsArr, 2);
const isAtLeastTwoGreenFromObj = compose(isAtLeastTwoGreen, getObjValues);

const isAtLeastThreeRed = (argsArr) => isAtLeastAmountColor(argsArr, 3, 'red');
const isAtLeastThreeBlue = (argsArr) => isAtLeastAmountColor(argsArr, 3, 'blue');
const isAtLeastThreeGreen = (argsArr) => isAtLeastAmountColor(argsArr, 3, 'green');
const isAtLeastThreeOrange = (argsArr) => isAtLeastAmountColor(argsArr, 3, 'orange');

const getAtLeastThreeRedOrBlueOrGreenOrOrangeFromObj = compose(anyPass([isAtLeastThreeBlue, isAtLeastThreeRed, isAtLeastThreeGreen, isAtLeastThreeOrange]), getObjValues);

const isExactTwoColor = (argsArr, color) => isExactNumberColor(argsArr, 2, color);
const isExactOneColor = (argsArr, color) => isExactNumberColor(argsArr, 1, color);

const isExactTwoGreen = (argsArr) =>  isExactTwoColor(argsArr, 'green');
const isExactTwoGreenFromObj = compose(isExactTwoGreen, getObjValues);
const isExactOneRed = (argsArr) => isExactOneColor(argsArr, 'red');
const isExactOneRedFromObj = compose(isExactOneRed, getObjValues);
const isExactTwoGreenOneRedAndGreenTriangle = allPass([isExactTwoGreenFromObj, isExactOneRedFromObj, isGreenTriangle]);

const getColorAmount = (figuresArr, color) => figuresArr.reduce((prev, curr) => prev + Number(curr === color), 0);
const getRedAmount = (figuresArr) => getColorAmount(figuresArr, 'red');
const getRedAmountFromObj = compose(getRedAmount, getObjValues);
const getBlueAmount = (figuresArr) => getColorAmount(figuresArr, 'blue');
const getBlueAmountFromObj = compose(getBlueAmount, getObjValues);


// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (figuresObj) => isWhiteCircleWhiteTriangleGreenSquareRedStar(figuresObj);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (figuresObj) => isAtLeastTwoGreenFromObj(figuresObj);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (figuresObj) => areFuncResultsEqual(getRedAmountFromObj, getBlueAmountFromObj)(figuresObj);

// 4. Синий круг, красная звезда, оранжевый квадрат, треугольник любого цвета
export const validateFieldN4 = (figuresObj) => isBlueCircleOrangeSquareRedStar(figuresObj);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
// export const validateFieldN5 = () => false;
export const validateFieldN5 = (figuresObj) => getAtLeastThreeRedOrBlueOrGreenOrOrangeFromObj(figuresObj);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (figuresObj) => isExactTwoGreenOneRedAndGreenTriangle(figuresObj);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (figuresObj) => isAllOrange(figuresObj);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = (figuresObj) => !isRedOrWhiteStar(figuresObj);

// 9. Все фигуры зеленые.
export const validateFieldN9 = (figuresObj) => isAllGreen(figuresObj);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = (figuresObj) => isTriangleEqualsToSquare(figuresObj) && !isWhiteTriangle(figuresObj);