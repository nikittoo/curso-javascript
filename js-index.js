console.log('JS conectado: js-index.js');

function Conocer(name) {
	const Saludo = `Hola, ${name}! Bienvenido/a.`;
	alert(Saludo); 
	console.log('Conocer():', Saludo);
	return Saludo;
}

function sum(a, b) {
	const na = Number(a);
	const nb = Number(b);
	const result = na + nb;
	console.log(`sum(${na}, ${nb}) = ${result}`);
	return result;
}

function AgregarArray(arr, item) {
	arr.push(item);
	console.log('AgregarArray():', arr);
	return arr;
}


function NumerosPares(arr) {
	const pares = [];
	for (let i = 0; i < arr.length; i++) {
		const n = Number(arr[i]);
		if (!Number.isNaN(n) && n % 2 === 0) {
			pares.push(n);
		}
	}
	console.log('NumerosPares():', pares);
	return pares;
}

function PreguntarProcesar(count) {
	const numbers = [];
	let i = 0;
	while (i < count) {
		const input = prompt(`Introduce el número ${i + 1} de ${count} (cancel para terminar):`);
		if (input === null || input.trim() === '') {
			console.log('PreguntarProcesar: entrada vacía o cancelada');
			break;
		}
		const num = Number(input);
		if (Number.isNaN(num)) {
			alert('Eso no es un número válido. Intenta de nuevo.');
			continue;
		}
		AgregarArray(numbers, num);
		i++;
	}

	if (numbers.length === 0) {
		alert('No ingresaste números.');
		return;
	}

	const total = numbers.reduce((acc, cur) => acc + cur, 0);
	alert(`Ingresaste ${numbers.length} números. La suma es ${total}.`);
	console.log('PreguntarProcesar: numbers =', numbers, 'total =', total);

	const pares = NumerosPares(numbers);
	if (pares.length > 0) {
		alert(`Números pares: ${pares.join(', ')}`);
	} else {
		alert('No hay números pares entre los ingresados.');
	}
}


(function main() {
	// pedir nombre
	const name = prompt('¿Cómo te llamas?');
	if (name !== null && name.trim() !== '') {
		Conocer(name.trim());
	} else {
		console.log('main: sin nombre proporcionado');
	}

	const a = prompt('Dame un número A:');
	const b = prompt('Dame un número B:');
	if (a !== null && b !== null && a.trim() !== '' && b.trim() !== '') {
		const s = sum(a, b);
		alert(`La suma de ${a} y ${b} es ${s}.`);
	} else {
		console.log('main: suma saltada por entrada vacía o cancel.');
	}

	PreguntarProcesar(3);
})();


