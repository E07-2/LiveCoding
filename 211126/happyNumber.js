const sumOfSquareOfDigits = function (num) {
  const text = num.toString();   // 13 => "13"
  const digits = text.split(""); // "13" = ["1", "3 "]

  let sum = 0;
  for (ii = 0; ii < digits.length; ii++) {
    const digit = digits[ii];
    sum += digit * digit;
  }

  return sum;
};

// console.log("sumOfSquareOfDigits(34):", sumOfSquareOfDigits(34));

const isHappyNumber = function (num, logIt) {
  for (let ii = 0; ii < 5; ii++) {
    if (logIt) {
      console.log(num, sumOfSquareOfDigits(num));
    }

    num = sumOfSquareOfDigits(num);

    if (num == 1) {
      return true;
    }
  }
  return false;
};

// console.log("isHappyNumber(7):", isHappyNumber(7, true));

const findFiveHappyNumbers = () => {
  const happyNumbers = []
  for ( let ii = 0; ; ii += 1 ) {
    if (isHappyNumber(ii)) {
      happyNumbers.push(ii)
      if (happyNumbers.length === 5) {
        return happyNumbers
      }
    }
  }
}


console.log("findFiveHappyNumbers():", findFiveHappyNumbers())