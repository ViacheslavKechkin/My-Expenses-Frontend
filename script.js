let allPosition = [];
let valueInputPosition = '';
let valueInputCash = '';
let inputPosition = null;
let inputCash = null;
let activeEditPosition = null;
let countSum = 0;

const newDate = new Date();

const options = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
}

const dateNow = newDate.toLocaleString("ru", options)

window.onload = async () => {
  inputPosition = document.getElementById('add-position');
  inputCash = document.getElementById('add-cash');
  inputPosition.addEventListener('change', updateValuePosition);
  inputCash.addEventListener('change', updateValueCash);
  const response = await fetch('http://localhost:5000/allExpenses', {
    method: 'GET'
  });
  let result = await response.json();
  allPosition = result.data;
  getSum();
  render();
}

const updateValuePosition = (event) => valueInputPosition = event.target.value;

const updateValueCash = (event) => valueInputCash = event.target.value;

const onClickButton = async () => {
  if (inputPosition.value != '' && inputCash.value != '') {
    const response = await fetch('http://localhost:5000/createExpense', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        text: valueInputPosition,
        cach: valueInputCash,
        date: dateNow
      })
    });
    let result = await response.json();
    allPosition = result.data;
    countSum += +valueInputCash;
    valueInputPosition = '';
    valueInputCash = '';
    inputPosition.value = '';
    inputCash.value = '';
    render();
  }
}

const render = () => {
  const content = document.getElementById('content-page');
  const Sum = document.getElementById('totalSum');
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  while (Sum.firstChild) {
    Sum.removeChild(Sum.firstChild);
  }

  const totalSum = document.createElement('p');
  totalSum.innerText = `Итого: ${countSum} р.`;
  totalSum.className = 'totalSum';
  Sum.appendChild(totalSum);

  allPosition.map((item, index) => {
    const container = document.createElement('div');
    container.id = `position-${index}`;
    container.className = 'position-container';

    if (index === activeEditPosition) {
      const inputText = document.createElement('input');
      inputText.type = 'text';
      inputText.value = item.text;
      inputText.className = 'input-text';
      inputText.addEventListener('change', updateTextValue);
      container.appendChild(inputText);

      const inputDate = document.createElement('input');
      inputDate.type = 'date';
      inputDate.value = item.date;
      inputDate.className = 'input-date';
      inputDate.addEventListener('change', updateDateValue);
      container.appendChild(inputDate);

      const inputCach = document.createElement('input');
      inputCach.type = 'text';
      inputCach.value = item.cach;
      inputCach.className = 'input-cach';
      inputCach.addEventListener('change', updateCachValue);
      container.appendChild(inputCach);
    } else {
      const text = document.createElement('p');
      text.innerText = (index + 1) + ") " + item.text;
      text.className = 'text';
      container.appendChild(text);

      const data = document.createElement('p');
      data.innerText = item.date;
      data.className = 'date';
      container.appendChild(data);

      const cach = document.createElement('p');
      cach.innerText = `${item.cach} р.`;
      cach.className = 'cach';
      container.appendChild(cach);
    }
    if (index === activeEditPosition) {
      const imageDone = document.createElement('img');
      imageDone.src = 'img/done.png';
      imageDone.onclick = () => {
        updateAllValue();
        doneEditPosition();
      }
      container.appendChild(imageDone);
    } else {
      const imageEdit = document.createElement('img');
      imageEdit.src = 'img/edit.png';
      imageEdit.onclick = () => {
        activeEditPosition = index;
        render();
      }
      container.appendChild(imageEdit);
    }

    const imageDelete = document.createElement('img');
    imageDelete.src = 'img/delete.png';
    imageDelete.onclick = () => {
      const itemIdDel = item._id;
      deleteExpense(index, itemIdDel);
      render();
    }
    container.appendChild(imageDelete);
    content.appendChild(container);
  });
}

const updateAllValue = async (event) => {
  let { _id, text, cach, date } = allPosition[activeEditPosition];
  const response = await fetch('http://localhost:5000/updateExpense', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      _id,
      text,
      cach,
      date
    })
  });
  let result = await response.json();
  allPosition = result.data;
  countSum = null;
  getSum();
  render();
}

const updateTextValue = (event) => {
  let { text } = allPosition[activeEditPosition];
  if (text !== event.target.value) {
    allPosition[activeEditPosition].text = event.target.value;
  }
}

const updateCachValue = (event) => {
  let { cach } = allPosition[activeEditPosition];
  if (cach !== event.target.value) {
    allPosition[activeEditPosition].cach = event.target.value;
  }
}

const updateDateValue = (event) => {
  let { date } = allPosition[activeEditPosition];
  if (date !== event.target.value) {
    let badDate = event.target.value.split('-');
    let correctDate = `${badDate[2]}.${badDate[1]}.${badDate[0]}`; 
    allPosition[activeEditPosition].date = correctDate;
  }
}

const deleteExpense = async (index, itemIdDel) => {
  const response = await fetch(`http://localhost:5000/deleteExpense?id=${itemIdDel}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  let result = await response.json();
  allPosition = result.data;
  render();
}

const getSum = () => {
  allPosition.map(item => countSum += +item.cach);
  render();
}

const doneEditPosition = () => activeEditPosition = null;