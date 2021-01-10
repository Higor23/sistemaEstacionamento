(function() {

    const $ = q => document.querySelector(q) //Também pode ser feito desta forma, substituindo o document.querySelector
    const getGarage = () => localStorage.garage ? JSON.parse(localStorage.garage) : [];

    renderGarage();
    document.querySelector('#send').addEventListener("click", e => {

        const name = $('#name').value;
        const licence = $('#licence').value;

        if (!name || !licence) {
            alert('Todos os campos precisam ser preeenchidos');

            return false; //irá impedir que dê continuidade ao programa.
        }

        const car = { name, licence, time: new Date() }

        const garage = getGarage();

        garage.push(car);
        localStorage.garage = JSON.stringify(garage);

        addCarToGarage(car);

        $('#name').value = "";
        $('#licence').value = "";

    });

    function addCarToGarage(car) {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${car.name}</td>
                <td>${car.licence}</td>
                <td data-time="${car.time}">${new Date(car.time)
                    .toLocaleString("pt-BR", {
                        hour: "numeric", minute: "numeric"
                        })}</td>
                <td>
                    <button class="delete">Excluir</button>
                </td>
            `;
        $('#garage').appendChild(row);
    };

    function renderGarage() {
        const garage = getGarage();
        $("#garage").innerHTML = "";
        garage.forEach(c => addCarToGarage(c))
    };

    $("#garage").addEventListener("click", e => {
        if (e.target.className === "delete")
            checkOut(e.target.parentElement.parentElement.cells);
    });

    function checkOut(info) {
        let period = new Date() - new Date(info[2].dataset.time); //Pega o data-time do td.
        period = convertePeriod(period);
        const licence = info[1].textContent;

        const msg = `O veículo ${info[0].textContent} de placa ${licence} permaneceu estacionado por ${period}. 
        \n Deseja encerrar?`;

        if (!confirm(msg)) return;
        const garage = getGarage().filter(c => c.licence !== licence);
        localStorage.garage = JSON.stringify(garage);

        renderGarage();
    }

    function convertePeriod(mil) {
        var min = Math.floor(mil / 60000);
        var sec = Math.floor((mil % 60000) / 1000);

        return `${min}m  e ${sec}s`;
    }

})();