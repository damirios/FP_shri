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
// вспомогательные функции
const compose = (...funcs) => (arg) => funcs.reduceRight((result, currFunc) => currFunc(result), arg);
const partial = (func, ...partArgs) => (...args) => func(...partArgs, ...args);
const flip = (func) => (...args) => func(...args.reverse());
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
const arePropsEqual = (firstProp, secondProp) => (obj) => obj[firstProp] === obj[secondProp];
const isArgEqual = (value) => (arg) => arg === value;
const checkEveryArgPass = (func) => (argsArr) => argsArr.reduce((result, arg) => result && func(arg), true);

const getObjValues = Object.values;
const getObjProp = (prop) => (obj) => obj[prop];
const getColorAmount = (figuresArr, color) => figuresArr.reduce((prev, curr) => prev + Number(curr === color), 0);

const isTriangleEqualsToSquare = arePropsEqual('triangle', 'square');

const getTriangle = getObjProp('triangle');
const getStar = getObjProp('star');
const getSquare = getObjProp('square');
const getCircle = getObjProp('circle');

const isWhite = isArgEqual('white');
const isRed = isArgEqual('red');
const isGreen = isArgEqual('green');
const isBlue = isArgEqual('blue');
const isOrange = isArgEqual('orange');

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

const isAtLeastAmountGreen = flip(partial(flip(isAtLeastAmountColor), 'green'));

const isAtLeastTwoGreen = partial(flip(isAtLeastAmountGreen), 2);
const isAtLeastTwoGreenFromObj = compose(isAtLeastTwoGreen, getObjValues);

const isAtLeastThreeRed = partial(flip(isAtLeastAmountColor), 'red', 3);
const isAtLeastThreeBlue = partial(flip(isAtLeastAmountColor), 'blue', 3);
const isAtLeastThreeGreen = partial(flip(isAtLeastAmountColor), 'green', 3);
const isAtLeastThreeOrange = partial(flip(isAtLeastAmountColor), 'orange', 3);

const getAtLeastThreeRedOrBlueOrGreenOrOrangeFromObj = compose(anyPass([isAtLeastThreeBlue, isAtLeastThreeRed, isAtLeastThreeGreen, isAtLeastThreeOrange]), getObjValues);

const isExactTwoGreen = partial(flip(isExactNumberColor), 'green', 2);
const isExactTwoGreenFromObj = compose(isExactTwoGreen, getObjValues);
const isExactOneRed = partial(flip(isExactNumberColor), 'red', 1);
const isExactOneRedFromObj = compose(isExactOneRed, getObjValues);
const isExactTwoGreenOneRedAndGreenTriangle = allPass([isExactTwoGreenFromObj, isExactOneRedFromObj, isGreenTriangle]);

const getRedAmount = partial(flip(getColorAmount), 'red');
const getRedAmountFromObj = compose(getRedAmount, getObjValues);
const getBlueAmount = partial(flip(getColorAmount), 'blue');
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