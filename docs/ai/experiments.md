# Código sin IA vs con IA — Comparativa

> Los mismos tres problemas resueltos de dos formas distintas.  
> La diferencia clave: la IA piensa en los casos que pueden romper el código **antes** de escribirlo.

---

## Problema 1 — ¿Par o impar?

<table>
<thead>
<tr><th>Sin IA</th><th>Con IA</th></tr>
</thead>
<tbody>
<tr>
<td>

```js
function parOImpar(numero) {
  if (numero % 2 == 0) {
    console.log("es par");
  } else {
    console.log("es impar");
  }
}

parOImpar(4); // "es par"
parOImpar(7); // "es impar"
```

</td>
<td>

```js
// Función pura: solo evalúa, no imprime.
// Quien llame decide qué hacer con el resultado.
const isEven = (n) => n % 2 === 0;

console.log(isEven(4)); // true
console.log(isEven(7)); // false

// Si necesitas el string, lo separas:
const parity = (n) => (isEven(n) ? "par" : "impar");
```

</td>
</tr>
</tbody>
</table>

---

## Problema 2 — Encontrar duplicado en array

<table>
<thead>
<tr><th>Sin IA</th><th>Con IA</th></tr>
</thead>
<tbody>
<tr>
<td>

```js
function encontrarDuplicado(arr) {
  var duplicado;
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i] == arr[j]) {
        duplicado = arr[i];
      }
    }
  }
  return duplicado;
}

encontrarDuplicado([1, 3, 4, 2, 2]); // 2
```

</td>
<td>

```js
// O(n) en tiempo y espacio usando un Set — sin loops anidados.
// Maneja el caso en que no haya duplicado.
const findDuplicate = (nums) => {
  const seen = new Set();
  for (const num of nums) {
    if (seen.has(num)) return num;
    seen.add(num);
  }
  return null; // contrato claro si no hay duplicado
};

findDuplicate([1, 3, 4, 2, 2]); // 2
findDuplicate([1, 2, 3]);       // null
```

</td>
</tr>
</tbody>
</table>

---

## Problema 3 — Contar palabras en una oración

<table>
<thead>
<tr><th>Sin IA</th><th>Con IA</th></tr>
</thead>
<tbody>
<tr>
<td>

```js
function contarPalabras(oracion) {
  var palabras = oracion.split(" ");
  var contador = 0;
  for (var i = 0; i < palabras.length; i++) {
    contador++;
  }
  return contador;
}

contarPalabras("hola como estas"); // 3
```

</td>
<td>

```js
// Maneja espacios múltiples, strings vacíos y trim.
// La versión sin IA se rompería con "  hola   mundo  ".
const countWords = (str) => {
  if (!str?.trim()) return 0;
  return str.trim().split(/\s+/).length;
};

countWords("hola como estas");   // 3
countWords("  hola   mundo  ");  // 2
countWords("");                  // 0
countWords(null);                // 0
```

</td>
</tr>
</tbody>
</table>

---

## Conclusión

La IA resuelve los mismos problemas en **menos líneas** y con **sintaxis más moderna**, pero la diferencia principal no es estética: la IA actúa como un programador senior porque **anticipa los casos límite** que pueden romper el código antes de escribirlo.