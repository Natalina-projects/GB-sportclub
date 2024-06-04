const classesData = [
    {
        title: "Фитнес",
        time: "10-00",
        maxParticipants: 10,
        currentParticipants: 5
    },
    {
        title: "Борьба",
        time: "12-00",
        maxParticipants: 8,
        currentParticipants: 8
    },
    {
        title: "Пилатес",
        time: "14-00",
        maxParticipants: 10,
        currentParticipants: 10
    }
]


const classesList = document.getElementById('classes-list');
const loadedClassesData = JSON.parse(localStorage.getItem('classesData') || JSON.stringify(classesData));

function updateLocalStorage() {
    localStorage.setItem('classesData', JSON.stringify(loadedClassesData));
}

loadedClassesData.forEach(classData => {
    const classItem = createClassElement(classData.title, classData.time, classData.maxParticipants, classData.currentParticipants);
    classesList.appendChild(classItem);
});

function createClassElement(title, time, max, current) {
    const classItem = document.createElement('li');
    classItem.classList.add('list-group-item');

    const classTitle = document.createElement('h2');
    classTitle.classList.add('mb-3');
    classTitle.textContent = title;

    const classTime = document.createElement('p');
    classTime.textContent = `Начало занятия: ${time}`;

    const maxParticipants = document.createElement('p');
    maxParticipants.classList.add('max-participants-count');
    maxParticipants.textContent = `Максимальное количество участников: ${max}`;

    const currentParticipants = document.createElement('p');
    currentParticipants.classList.add('current-participants-count');
    currentParticipants.textContent = `Текущее количество участников: ${current}`;

    const signUpBtn = document.createElement('button');
    signUpBtn.classList.add('btn', 'btn-primary', 'mt-3', 'me-2');
    signUpBtn.textContent = 'Записаться';
    if (current >= max) {
        signUpBtn.disabled = true;
    }

    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('btn', 'btn-danger', 'mt-3');
    cancelBtn.textContent = 'Отменить запись';

    classItem.appendChild(classTitle);
    classItem.appendChild(classTime);
    classItem.appendChild(maxParticipants);
    classItem.appendChild(currentParticipants);

    classItem.appendChild(signUpBtn);
    classItem.appendChild(cancelBtn);

    return classItem;
}

classesList.addEventListener('click', e => {
    const classElement = e.target.closest('li');
    const title = classElement.querySelector('h2').textContent;
    const currentParticipantsCount = classElement.querySelector('.current-participants-count');
    let currentParticipants = parseInt(currentParticipantsCount.textContent.replace(/[^0-9]/g, ''), 10);

    const maxParticipantsCount = classElement.querySelector('.max-participants-count');
    const maxParticipants = parseInt(maxParticipantsCount.textContent.replace(/[^0-9]/g, ''), 10);

    const signUp = classElement.querySelector('.btn-primary');
    let changed = false;

    if (e.target.textContent === 'Записаться') {
        if(!isNaN(currentParticipants) && currentParticipants < maxParticipants) {
            currentParticipants += 1;
            changed = true;
            if (currentParticipants === maxParticipants) {
                signUp.disabled = true;
            }
        }
    } else if (e.target.textContent === 'Отменить запись') {
        if(!isNaN(currentParticipants) && currentParticipants > 0 ) {
            currentParticipants -= 1;
            changed = true;
            if (currentParticipants < maxParticipants) {
                signUp.disabled = false;
            }
        }
        if (changed) {
            currentParticipantsCount.textContent = `Текущее количество участников: ${currentParticipants}`;
        }
    }

    const classData = loadedClassesData.find(c => c.title === title);
    if (classData) {
        classData.currentParticipants = currentParticipants;
        updateLocalStorage();
    }
    currentParticipantsCount.textContent = `Текущее количество участников: ${currentParticipants}`;
});
