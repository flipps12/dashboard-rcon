const listPlayer = document.getElementById('listPlayers');
const input = document.getElementById('input');
const consolaDisplay = document.getElementById('consolaDisplay');
const tpsson = document.getElementById('tpsson');
const memoriaLibrediv = document.getElementById('memoriaLibrediv');
const memoriaUsadadiv = document.getElementById('memoriaUsadadiv');
const memoriaTotaldiv = document.getElementById('memoriaTotaldiv');
const tpsdiv = document.getElementById('tpsdiv');
const reload = document.getElementById('reload');
const off = document.getElementById('off');
const contra = prompt('contraseña:');

reload.addEventListener('click', () => {
    listPlayer.innerHTML = ''
    main()
})

off.addEventListener('click', ()=>{
    const contra2 = prompt('Ingresa contraseña:')
    postData('/ejecutar', { comando: 'stop', password: contra2 })
})

async function postData(url = '', data = {}) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data), // Datos que deseas enviar en formato clave-valor
            headers: {
                'Content-Type': 'application/json' // Tipo de contenido
            }
        });

        if (response.ok) {
            const responseData = await response.json();
            return responseData
        } else {
            console.error('Error en la solicitud:', response.status);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
}

const graficar = (value1, value2) => {
    const pieData = [
        { value: value2, color: "#00000044", label: "Libre" },
        { value: value1, color: "#4e3", label: "En uso" }
    ];

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false
    };

    const pieCtx = document.getElementById("myPieGraph").getContext("2d");
    new Chart(pieCtx, {
        type: "pie",
        data: {
            datasets: [{
                data: pieData.map(item => item.value),
                backgroundColor: pieData.map(item => item.color)
            }],
            labels: pieData.map(item => item.label)
        },
        options: pieOptions
    });
}

const main = async () => {
    const list = await postData('/ejecutar', { comando: 'list', password: contra });
    const tps = await postData('/ejecutar', { comando: 'tps', password: contra });
    const memoriaUsada = tps.data.replace(/§./g, "").split('Usage: ')[1].split('/')[0]
    const memoriaTotal = tps.data.replace(/§./g, "").split('Usage: ')[1].split('Max: ')[1].split(' mb')[0]
    const memoryUsedPercentage = (memoriaUsada / memoriaTotal) * 100;
    const memoryFreePercentage = 100 - memoryUsedPercentage;
    memoriaUsadadiv.textContent = `Memoria usada: ${memoriaUsada}`
    memoriaLibrediv.textContent = `Memoria libre: ${memoriaTotal - memoriaUsada}`
    memoriaTotaldiv.textContent = `Memoria total: ${memoriaTotal}`
    tpsdiv.textContent = tps.data.replace(/§./g, "").split('Current')[0]
    graficar(memoryUsedPercentage, memoryFreePercentage)
    if (list != true) {
        const listPlayers = list.data.split(':')[1].split(',');
        console.log(listPlayers)
        if (listPlayers[0] == undefined) {
            const li = document.createElement('li');
            li.textContent = 'No hay jugadores conectados';
            listPlayer.appendChild(li);
        }
        for (const player in listPlayers) {
            console.log(listPlayers[player]);
            const li = document.createElement('li');
            li.textContent = listPlayers[player].slice(1);
            listPlayer.appendChild(li);
            // También puedes usar listPlayer.innerHTML += `<li>${listPlayers[player]}</li>`;
        }
    };
};

const ejecutar = async () => {
    const list = await postData('/ejecutar', { comando: input.value, password: contra });
    if (list.status != true) {
        const div = document.createElement('div');
        div.textContent = 'Error: auth false';
        consolaDisplay.appendChild(div);
        return
    }
    const div = document.createElement('div');
    div.textContent = await list.data.replace(/§./g, "");
    consolaDisplay.appendChild(div);
    console.log(await list);
    input.value = '';
};

main()