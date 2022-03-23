const apikey = '979f0060-d589-4619-be78-e6dfb93ea74d';
const apihost = 'https://todo-api.coderslab.pl';

if(apikey == '') {
  alert('Wejdź na https://todo-api.coderslab.pl/apikey/create oraz skopiuj token i wklej do stałej "apikey", w pliku script.js. Inaczej nic się nie uda!');
}

function apiListAllTasks() {  //pobranie zadań
  return fetch(
    apihost + '/api/tasks',
    { headers: { 'Authorization': apikey } }
  ).then(
    function (resp) {
      if(!resp.ok) {
        alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
      }
      return resp.json();
    }
  );
}

function apiCreateTask(title, description) { //Funkcja która za pomocą API utworzy zadanie
  return fetch(
    apihost + '/api/tasks',
    {
      headers: { Authorization: apikey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title, description: description, status: 'open' }),
      method: 'POST'
    }
  ).then(
    function (resp) {
      if(!resp.ok) {
        alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
      }
      return resp.json();
    }
  );
}

function apiUpdateTask(taskId, title, description, status) {  //korzysta z metody PUT która potrafi zastąpić obecną treść zasobu, nową
  return fetch(
    apihost + '/api/tasks/' + taskId,
    {
      headers: { Authorization: apikey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title, description: description, status: status }),
      method: 'PUT'
    }
  ).then(
    function (resp) {
      if(!resp.ok) {
        alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
      }
      return resp.json();
    }
  );
}

function apiDeleteTask(taskId) {  //funkcja usuwa zadanie (korzysta z API)
  return fetch(
    apihost + '/api/tasks/' + taskId,
    {
      headers: { Authorization: apikey },
      method: 'DELETE'
    }
  ).then(
    function (resp) {
      if(!resp.ok) {
        alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
      }
      return resp.json();
    }
  )
}

function apiListOperationsForTask(taskId) {  //funkcja do komunikacji z API
  return fetch(
    apihost + '/api/tasks/' + taskId + '/operations',
    { headers: { 'Authorization': apikey } }
  ).then(
    function (resp) { return resp.json(); }
  );
}

function apiCreateOperationForTask(taskId, description) {  //funkcja do komunikacji z API, dodaje operacje poprzez
  return fetch(                                            // wykonywanie zapytań metoda post
    apihost + '/api/tasks/' + taskId + '/operations',
    {
      headers: { Authorization: apikey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: description, timeSpent: 0 }),
      method: 'POST'
    }
  ).then(
    function (resp) {
      if(!resp.ok) {
        alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
      }
      return resp.json();
    }
  );
}

function apiUpdateOperation(operationId, description, timeSpent) {  //zmiana czasu operacji będzie wymagała wykonania zapytania typu PUT
  return fetch(
    apihost + '/api/operations/' + operationId,
    {
      headers: { Authorization: apikey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: description, timeSpent: timeSpent }),
      method: 'PUT'
    }
  ).then(
    function (resp) {
      if(!resp.ok) {
        alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
      }
      return resp.json();
    }
  );
}

function apiDeleteOperation(operationId) {  //usuwa operacje o znanym ID
  return fetch(
    apihost + '/api/operations/' + operationId,
    {
      headers: { Authorization: apikey },
      method: 'DELETE'
    }
  ).then(
    function (resp) {
      if(!resp.ok) {
        alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
      }
      return resp.json();
    }
  )
}

function renderTask(taskId, title, description, status) {  //otrzyma szczegóły każdego zadania i doda odpowiednie elementy do drzewa DOM
  const section = document.createElement('section');
  section.className = 'card mt-5 shadow-sm';
  document.querySelector('main').appendChild(section);

  const headerDiv = document.createElement('div');
  headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
  section.appendChild(headerDiv);

  const headerLeftDiv = document.createElement('div');
  headerDiv.appendChild(headerLeftDiv);

  const h5 = document.createElement('h5');
  h5.innerText = title;
  headerLeftDiv.appendChild(h5);

  const h6 = document.createElement('h6');
  h6.className = 'card-subtitle text-muted';
  h6.innerText = description;
  headerLeftDiv.appendChild(h6);

  const headerRightDiv = document.createElement('div');
  headerDiv.appendChild(headerRightDiv);

  if(status == 'open') {  // kiedy zadanie ma status "closed", nie chcemy widzieć przycisku "Finish"
    const finishButton = document.createElement('button');
    finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
    finishButton.innerText = 'Finish';
    headerRightDiv.appendChild(finishButton);
    finishButton.addEventListener('click', function() { // tu znajdzie się obsługa kliknięcia przycisku "Finish"
      apiUpdateTask(taskId, title, description, 'closed');
      section.querySelectorAll('.js-task-open-only').forEach(
        function(element) { element.parentElement.removeChild(element); }
      );
    });
  }

  const deleteButton = document.createElement('button');
  deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
  deleteButton.innerText = 'Delete';
  headerRightDiv.appendChild(deleteButton);
  deleteButton.addEventListener('click', function() { // tu znajdzie się obsługa kliknięcia przycisku "Delete"
    apiDeleteTask(taskId).then(function() { section.parentElement.removeChild(section); });
  });

  const ul = document.createElement('ul');  //tworzenie pustej listy <ul> jako kolejnego dziecka elementu <section>
  ul.className = 'list-group list-group-flush';
  section.appendChild(ul);

  apiListOperationsForTask(taskId).then(
    function(response) {
      response.data.forEach(
        function(operation) {
          renderOperation(ul, status, operation.id, operation.description, operation.timeSpent);
        }
      )
    }
  )

    // formularz dodawania nowych operacji chcemy widzieć tylko w otwartych zadaniach
  if(status == 'open') {
    const addOperationDiv = document.createElement('div');
    addOperationDiv.className = 'card-body js-task-open-only';
    section.appendChild(addOperationDiv);

    const form = document.createElement('form');
    addOperationDiv.appendChild(form);

    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    form.appendChild(inputGroup);

    const descriptionInput = document.createElement('input');
    descriptionInput.setAttribute('type', 'text');
    descriptionInput.setAttribute('placeholder', 'Operation description');
    descriptionInput.setAttribute('minlength', '5');
    descriptionInput.className = 'form-control';
    inputGroup.appendChild(descriptionInput);

    const inputGroupAppend = document.createElement('div');
    inputGroupAppend.className = 'input-group-append';
    inputGroup.appendChild(inputGroupAppend);

    const addButton = document.createElement('button');
    addButton.className = 'btn btn-info';
    addButton.innerText = 'Add';
    inputGroupAppend.appendChild(addButton);

    form.addEventListener('submit', function(event) {
      event.preventDefault();
      apiCreateOperationForTask(taskId, descriptionInput.value).then(
        function(response) {
          renderOperation(
            ul,
            status,
            response.data.id,
            response.data.description,
            response.data.timeSpent
          );
        }
      )
    });
  }
}

function renderOperation(ul, status, operationId, operationDescription, timeSpent) {  //funkcja dostaje jako argumenty listę <ul>, status zadania:
  const li = document.createElement('li');                                     // (przyciski +1h, +15m, delete) i szczegóły operacji
  li.className = 'list-group-item d-flex justify-content-between align-items-center';
  ul.appendChild(li);

  const descriptionDiv = document.createElement('div');
  descriptionDiv.innerText = operationDescription;
  li.appendChild(descriptionDiv);

  const time = document.createElement('span');
  time.className = 'badge badge-success badge-pill ml-2';
  time.innerText = formatTime(timeSpent);
  descriptionDiv.appendChild(time);

  if(status == "open") {
    const controlDiv = document.createElement('div');
    controlDiv.className = 'js-task-open-only';
    li.appendChild(controlDiv);

    const add15minButton = document.createElement('button');
    add15minButton.className = 'btn btn-outline-success btn-sm mr-2';
    add15minButton.innerText = '+15m';
    controlDiv.appendChild(add15minButton);

    add15minButton.addEventListener('click', function() {
      apiUpdateOperation(operationId, operationDescription, timeSpent + 15).then(
        function(response) {
          time.innerText = formatTime(response.data.timeSpent);
          timeSpent = response.data.timeSpent;
        }
      );
    });

    const add1hButton = document.createElement('button');
    add1hButton.className = 'btn btn-outline-success btn-sm mr-2';
    add1hButton.innerText = '+1h';
    controlDiv.appendChild(add1hButton);

    add1hButton.addEventListener('click', function() {
      apiUpdateOperation(operationId, operationDescription, timeSpent + 60).then(
        function(response) {
          time.innerText = formatTime(response.data.timeSpent);
          timeSpent = response.data.timeSpent;
        }
      );
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger btn-sm';
    deleteButton.innerText = 'Delete';
    controlDiv.appendChild(deleteButton);

    deleteButton.addEventListener('click', function() {  //usuwa operację z servera wraz z jej elementem <li>
      apiDeleteOperation(operationId).then(
        function() { li.parentElement.removeChild(li); }
      );
    });
  }
}

function formatTime(total) {  //zamienia minuty na format ...h ...m
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if(hours > 0) {
    return hours + 'h ' + minutes + 'm';
  } else {
    return minutes + 'm';
  }
}

//uruchomienie funkcji renderTask
document.addEventListener('DOMContentLoaded', function() {
  apiListAllTasks().then(
    function(response) {
      response.data.forEach(
        function(task) {
          renderTask(task.id, task.title, task.description, task.status);
        }
      )
    }
  );
  document.querySelector('.js-task-adding-form').addEventListener('submit', function(event) {
    event.preventDefault();
    apiCreateTask(event.target.elements.title.value, event.target.elements.description.value).then(
      function(response) { renderTask(response.data.id, response.data.title, response.data.description, response.data.status) }
    )
  });
});
