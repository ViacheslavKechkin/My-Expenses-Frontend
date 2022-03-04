let allPosition = [];
let valueInputPosition = '';
let valueInputCash = '';
let inputPosition = null;
let inputCash = null;
let activeEditPosition = null;
let countSum = 0;
let intermediateResultCash = '';
let intermediateResultText = '';

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
  const result = await response.json();
  allPosition = result.data;
  getSum();
  render();
}

const updateValuePosition = (event) => valueInputPosition = event.target.value;

const updateValueCash = (event) => valueInputCash = event.target.value;

const onClickButton = async () => {
  if (inputPosition.value === '' || inputCash.value === '') {
    alert(`Недостаточно данных для ввода расходов.\nВведите пожалуйста все данные о расходах`)
  } else {
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
    const result = await response.json();
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
      inputText.onchange = (event) => intermediateResultText = event.target.value;
      container.appendChild(inputText);

      const inputDate = document.createElement('input');
      inputDate.type = 'date';
      inputDate.value = ((item.date).split('.').reverse().join('-'));
      inputDate.min = '2000-01-01';
      inputDate.min = '2022-12-31';
      inputDate.className = 'input-date';
      inputDate.addEventListener('change', updateDateValue);
      container.appendChild(inputDate);

      const inputCach = document.createElement('input');
      inputCach.type = 'text';
      inputCach.value = item.cach;
      inputCach.className = 'input-cach';
      inputCach.onchange = (event) => intermediateResultCash = event.target.value;

      container.appendChild(inputCach);
      const imageDone = document.createElement('img');
      imageDone.src = 'img/done.png';
      imageDone.onclick = () => {
        saveResult(index);
      }
      container.appendChild(imageDone);
      const imageCancel = document.createElement('img');
      imageCancel.src = 'img/cansel.png';
      imageCancel.onclick = () => {
        activeEditPosition = null;
        render();
      }
      container.appendChild(imageCancel);
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

      const imageEdit = document.createElement('img');
      imageEdit.src = 'img/edit.png';
      imageEdit.onclick = () => {

        let { cach, text } = allPosition[index];
        activeEditPosition = index;
        intermediateResultCash = cach;
        intermediateResultText = text;
        render();
      }
      container.appendChild(imageEdit);

      const imageDelete = document.createElement('img');
      imageDelete.src = 'img/delete.png';
      imageDelete.onclick = () => {
        const itemIdDel = item._id;
        deleteExpense(index, itemIdDel);
        render();
      }
      container.appendChild(imageDelete);
    }

    content.appendChild(container);
  });
}

const saveResult = (ind) => {
  let task = allPosition[ind];
  allPosition[ind] = {
    ...task,
    cach: intermediateResultCash,
    text: intermediateResultText
  }

  updateAllValue(allPosition[ind])
}

const updateAllValue = async (task) => {

  const response = await fetch('http://localhost:5000/updateExpense', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(task)
  });
  let result = await response.json();
  allPosition = result.data;

  countSum = null;
  activeEditPosition = null;
  getSum();
  render();
}

const updateTextValue = (event) => {
  let { text } = allPosition[activeEditPosition];
  if (text !== event.target.value) {
    intermediateResultText = event.target.value;
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
  const result = await response.json();
  allPosition = result.data;
  countSum = null;
  getSum();
  activeEditPosition = null
  render();
}

const getSum = () => {
  allPosition.map(item => countSum += +item.cach);
  render();
}
