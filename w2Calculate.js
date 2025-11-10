function details() {
  let name = "Hishila";
  let age = 25;
  let output = `Name = ${name}<br>Age = ${age}`;
  document.getElementById("variableResult").innerHTML = output;
}

function addition() {
  let a = 5, b = 6;
  let c = a + b;
  return `${a} + ${b} = ${c}`;
}
function displaySum() {
  document.getElementById("demo1").innerHTML = addition();
}

function subtraction() {
  let a = 2, b = 3;
  let c = a - b;
  return `${a} - ${b} = ${c}`;
}
function displaySub() {
  document.getElementById("demo2").innerHTML = subtraction();
}

function multiplication() {
  let a = 2, b = 3;
  let c = a * b;
  return `${a} × ${b} = ${c}`;
}
function displayMul() {
  document.getElementById("demo3").innerHTML = multiplication();
}

function division() {
  let a = 6, b = 3;
  let c = a / b;
  return `${a} ÷ ${b} = ${c}`;
}
function displayDiv() {
  document.getElementById("demo4").innerHTML = division();
}

document.getElementById("check").addEventListener("click", function() {
  finalcheck();
});

function finalcheck() {
  let rdmnum = Number(document.getElementById("input").value);
  let val;

  if (rdmnum > 0) {
    val = "The number is Positive ";
  } else if (rdmnum < 0) {
    val = "The number is Negative ";
  } else {
    val = "The number is Zero ";
  }

  document.getElementById("result").innerHTML = val;
}