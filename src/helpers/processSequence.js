/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import { compose } from './validators';

const api = new Api();

const validateInput = function(value) {
    return !isNaN(+value) && value.length < 10 && value.length > 2 && +value > 0;
}

const executeAndReturn = (func) => (arg) => {
    func(arg);
    return arg;
}

const executeAndReturnResultProp = (func) => (arg) => {
    func(arg.result);
    return arg.result;
}

const getLength = (argWithLength) => argWithLength.length;
const getSquareNumber = (arg) => Number(arg) ** 2;
const getMod3 = (arg) => Number(arg) % 3;

const processSequence = async ({value, writeLog, handleSuccess, handleError}) => {
    writeLog(value);

    if (!validateInput(value)) {
        return handleError("ValidationError");
    }

    const valueRound = Math.round(+value);
    writeLog(valueRound);

    const apiResponse = await api.get('https://api.tech/numbers/base')({from: 10, to: 2, number: valueRound})
        .then(executeAndReturnResultProp(writeLog))
        .catch(executeAndReturn(writeLog));
    if (!apiResponse) {
        return;
    }

    const writeLogAndReturn = executeAndReturn(writeLog);
    const animalId = compose(writeLogAndReturn, getMod3, writeLogAndReturn, getSquareNumber, writeLogAndReturn, getLength)(apiResponse);
    api.get(`https://animals.tech/${getMod3(animalId)}`)({}).then(executeAndReturnResultProp(handleSuccess)).catch(executeAndReturn(writeLog));
}

export default processSequence;
