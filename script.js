let allPosition = [];
let valueInputPosition = '';
let valueInputCash = '';
let inputPosition = null;
let inputCash = null;
let activeEditPosition = null;
let countSum = 0;
let newTextValue = '';

window.onload = () => {
  inputPosition = document.getElementById('add-position');
  inputCash = document.getElementById('add-cash');
  inputPosition.addEventListener('change', updateValuePosition);
  inputCash.addEventListener('change', updateValueCash);
}
const updateValuePosition = (event) => valueInputPosition = event.target.value;
const updateValueCash = (event) => valueInputCash = event.target.value;

const onClickButton = () => {
  allPosition.push({
    text: valueInputPosition,
    cach: valueInputCash,
    date: '01.02.2022'
  });
  countSum += +valueInputCash;
  valueInputPosition = '';
  valueInputCash = '';
  inputPosition.value = '';
  inputCash.value = '';
  render();
}

render = () => {
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
      inputText.addEventListener('change', updateTextValue(item.text));
      console.log(item.text);
      container.appendChild(inputText);

      const inputDate = document.createElement('input');
      inputDate.type = 'date';
      inputDate.value = item.text;
      // inputDate.addEventListener('change', updateTaskText);
      container.appendChild(inputDate);

      const inputCach = document.createElement('input');
      inputCach.type = 'text';
      inputCach.value = item.cach;
      // inputText.addEventListener('change', updateTaskText);
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
      cach.innerText = item.cach;
      cach.className = 'cach';
      container.appendChild(cach);
    }


    if (index === activeEditPosition) {
      const imageDone = document.createElement('img');
      imageDone.src = 'img/done.png';
      imageDone.onclick = () => {
        updateAllValue();
        doneEditTask();
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
      deleteTask(index, itemIdDel);
    }
    container.appendChild(imageDelete);


    content.appendChild(container);
  });
}

const updateAllValue = (event) => {
  let { text, cach, date } = allPosition[activeEditPosition];
  console.log(newTextValue);
  text = newTextValue;
  render();
}
const updateTextValue = (text) => {
  newTextValue = text;
  console.log(newTextValue);
}
const doneEditTask = () => activeEditPosition = null;