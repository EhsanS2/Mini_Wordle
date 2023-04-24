let wordList = "";
let puzzleWord = "";
let isFinished = false;
let counter = 1; // to count columns
let row = 1;
const gray = "#949494";
const yellow = "#ebd705";
const green = "#188535";
const red = "#f00c17";

String.prototype.replaceAt = function (index, char) {
    if (index >= this.length) {
        return this.valueOf();
    }

    let chars = this.split("");
    chars[index] = char;
    return chars.join("");
};

document.addEventListener("DOMContentLoaded", () => {
    const getData = fetchWords((data) => {
        wordList = data;
        const rndNumber = Math.floor(Math.random() * data.length);
        puzzleWord = data[rndNumber];
        // puzzleWord = "while"; //for test
    });
    //const row = findFirstEmptyRow()[1];

    document.addEventListener("keydown", keyManager);
});

function keyManager(e) {
    let cellId = "";
    if (e.code === "Backspace") {
        counter = counter - 1;
        counter < 1 ? (counter = 1) : counter;
        cellId = `c${row}-${counter}`;
        document.getElementById(cellId).innerText = "";
    } else if (e.keyCode >= 65 && e.keyCode <= 90) {
        if (counter <= 5) {
            cellId = `c${row}-${counter}`;
            counter = counter + 1;
            document.getElementById(cellId).innerText = e.key.toUpperCase();
        }
    } else if (e.code === "Enter") {
        const userWord = createWord(row).toLowerCase();
        if (wordList.includes(userWord)) {
            const compareResult = compare(puzzleWord, userWord);
            styling(compareResult, row);
            if (calculateFinalScore(compareResult) === 10) {
                document.removeEventListener("keydown", keyManager);
                isFinished = true;
                finish(true);
            }
            if (row === 6 && !isFinished) {
                finish(false);
            }
            row = row + 1;
            counter = 1;
        }
    }
}

function calculateFinalScore(arr) {
    /*
    / This function gets compareResult array
    / It returns final score of your guess
    */
    let finalScore = 0;
    arr.forEach((e) => {
        finalScore += e[1];
    });
    return finalScore;
}

function styling(arr, row) {
    /*
    / This function get compare result array and apply it on cells' style
    / Returns nothing
    */

    arr.forEach((elem) => {
        let cl = "";
        switch (elem[1]) {
            case 0:
                cl = gray;
                break;
            case 1:
                cl = yellow;
                break;
            case 2:
                cl = green;
                break;
            default:
                break;
        }
        document.getElementById(`c${row}-${elem[0]}`).style.background = cl;
    });
}

function compare(pzl, wrd) {
    /*
    / This function compares user's word with puzzle word
    / It returns an array of chracters indexes and status codes : 0: not correct, 1: correct with wrong position, 2: correct with correct position
    */
    const result = [];
    // puzzle word iteration
    for (let i = 0; i < 5; i++) {
        console.log(pzl);
        let flag = 0;
        // user word iteration
        for (let j = 0; j < 5; j++) {
            //console.log(wrd);
            //checking if i(th) letter is in puzzle word
            if (wrd[i] === pzl[j]) {
                flag = 1;
                //checking if position is correct or not
                if (pzl[i] === wrd[i]) {
                    result.push([i + 1, 2]);
                } else {
                    result.push([i + 1, 1]);
                }
                // swap recongnized letters with special character to prevent double recognition
                pzl = pzl.replaceAt(j, "*");
                wrd = wrd.replaceAt(i, "+");
            }
        }
        if (flag === 0) {
            result.push([i + 1, 0]);
        }
    }
    return result;
}

function createWord(row) {
    /*
    / This function gets row number and checks if row is full. if true, puts all character together and creates a word
    / It return created word
    */
    if (document.getElementById(`c${row}-5`).innerText != "") {
        let word = "";
        for (i = 1; i < 6; i++) {
            word = word.concat(
                document.getElementById(`c${row}-${i}`).innerText
            );
        }
        return word;
    }
}

function fetchWords(callback) {
    /*
    / This function fetchs data from json file
    / It returns array of words
    */
    let words = "";
    const path = `./assets/words.json`;
    fetch(path)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
        })
        .then((json) => {
            callback(Object.values(json));
        });
}

function finish(bool) {
    const result_text = document.querySelector(".result_text");
    const result_box = document.querySelector(".result_box");
    const mouth = document.getElementById("mouth");
    const eye = document.querySelectorAll(".eye");
    let color = "";
    puzzleWord = puzzleWord.toUpperCase();
    if (bool) {
        color = green;
        mouth.style.borderBottom = `10px solid ${green}`;
        mouth.style.top = "30px";
        result_text.innerText = "GOOD JOB";
    } else {
        color = red;
        mouth.style.borderTop = `10px solid ${red}`;
        mouth.style.top = "70px";
        result_text.innerText = `TRY AGAIN\nMISTRY WORD WAS : ${puzzleWord}`;
    }
    eye.forEach((e) => {
        e.style.background = color;
    });
    result_text.style.color = color;
    result_box.style.display = "flex";
}
