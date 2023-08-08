// Этап 1. Создайте функцию, генерирующую массив парных чисел. Пример массива, который должна возвратить функция: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8].count - количество пар.


let activeCards = [0, 0];

let tries = 0;

let cardObj = [];

let stopTimer;
let container = document.querySelector(".container");

//status: close, open, fixed


function createNumbersArray(count) {
    let numbersArray = [];
    for (let i = 1; i <= count; i++) {
        numbersArray.push(i, i);
    }

    return numbersArray;

}

// Этап 2. Создайте функцию перемешивания массива.Функция принимает в аргументе исходный массив и возвращает перемешанный массив. arr - массив чисел

function shuffle(arr) {

    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr;

}

// Этап 3. Используйте две созданные функции для создания массива перемешанными номерами. На основе этого массива вы можете создать DOM-элементы карточек. У каждой карточки будет свой номер из массива произвольных чисел. Вы также можете создать для этого специальную функцию. count - количество пар.
function createAppTitle(title = "Игра в пары") {
    let appTitle = document.createElement('h2');
    appTitle.textContent = title;
    return appTitle;

}


function ifYouWin() {
    //может, открыли все карточки? 
    let winnerFlag = 1;
    for (let c of cardObj) {
        if (c.status == "close" || c.status == "open") {
            winnerFlag = 0;
        }
    }
    if (winnerFlag == 1) {
        clearInterval(stopTimer);
        restart();
    }
}



function restart() {

    let l = cardObj.length;
    for (let i = 1; i <= l; i++) {
        cardObj.pop();
    }
    console.log(cardObj);
    let cw = document.querySelector('.cardWrapper');
    setTimeout(() => {
        cw.parentNode.removeChild(cw);
        let restart = document.createElement('button');
        restart.textContent = "Начать заново";
        restart.classList.add("restart");
        restart.classList.add("btn");
        restart.classList.add("btn-secondary");
        document.body.append(restart);
        restart.addEventListener('click', () => {

            restart.parentNode.removeChild(restart);
            startGame(container);
        })
    }, 3000);
}


//Создание обертки для карточек с карточками внутри
function createGameInterface(numbersArray) {
    let cardsWrapper = document.createElement('div');
    cardsWrapper.classList.add('cardWrapper');

    for (let numbersArrayItem of numbersArray) {
        let card = document.createElement('div');
        //добавляем карточку в массив с ее статусом
        cardObj.push({ cardLink: card, status: "close" });

        card.innerHTML = numbersArrayItem;
        card.classList.add('card');

        //обработчик клика по карточке
        card.addEventListener('click', () => {
            //для проверки
            console.log(cardObj);

            //только для карточек close
            for (let c of cardObj) {
                if (c.cardLink == card && c.status != "fixed" && c.status != "open") {
                    c.status = "open";
                    c.cardLink.classList.toggle("card-over");
                    //если открыли не 2 карточки
                    if (activeCards.includes(0)) {
                        activeCards[activeCards.indexOf(0)] = 1;
                        console.log(activeCards);

                    }
                }
            }





            //если открыты две карточки
            if (!activeCards.includes(0)) {
                //сохраняем эти 2 карточки в отдельный массив, не знаю зачем, просто так проще 
                let twoOpenedCard = cardObj.filter(elem => elem.status == "open");
                if (twoOpenedCard[0].cardLink.textContent == twoOpenedCard[1].cardLink.textContent) {
                    //поменять статус на fixed
                    for (let c of cardObj) {
                        if (c.status == "open") {
                            c.status = "fixed";
                            //сделать так, чтобы карточк больше не вращалась
                        }
                    }
                } else {
                    for (let c of cardObj) {
                        if (c.status == "open") {
                            c.status = "close";
                            setTimeout(() => { c.cardLink.classList.remove("card-over") }, 2000);
                        }
                    }
                }
                activeCards = [0, 0];

            }

            //проверка на победу
            ifYouWin();

        });

        cardsWrapper.append(card);
    }

    return cardsWrapper;

}



function startGame(container) {

    let input = document.createElement('input');


    container.append(input);

    input.addEventListener('keyup', (e) => {
        if (e.code == "Enter") {

            //генерация массива
            let numbersArray = createNumbersArray(parseInt(input.value) + input.value % 2);
            //перемешивание массива
            numbersArray = shuffle(numbersArray);

            //создание интерфейса
            let cardsWrapper = createGameInterface(numbersArray);

            container.append(cardsWrapper);
            input.parentNode.removeChild(input);
            stopTimer = setTimeout(restart, 60000);

        }
    })




}