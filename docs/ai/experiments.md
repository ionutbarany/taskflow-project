Resultados sin usar IA:


 PROBLEMA 1: ¿Par o impar? 

function parOImpar(numero) {
  if (numero % 2 == 0) {
    console.log("es par");
  } else {
    console.log("es impar");
  }
}

parOImpar(4); // "es par"
parOImpar(7); // "es impar"


 PROBLEMA 2: Encontrar duplicado en array

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



 PROBLEMA 3: Contar palabras en una oración

function contarPalabras(oracion) {
  var palabras = oracion.split(" ");
  var contador = 0;
  for (var i = 0; i < palabras.length; i++) {
    contador++;
  }
  return contador;
}

contarPalabras("hola como estas"); // 3

Resultados usando la IA:


 PROBLEMA 1: ¿Par o impar?


// Función pura: solo evalúa, no imprime. Quien llame decide qué hacer con el resultado.
const isEven = (n) => n % 2 === 0;

console.log(isEven(4)); // true
console.log(isEven(7)); // false

// Si necesitás el string, lo separás:
const parity = (n) => (isEven(n) ? "par" : "impar");



 PROBLEMA 2: Encontrar duplicado en array


// O(n) en tiempo y espacio usando un Set — sin loops anidados.
// Además maneja el caso en que no haya duplicado.
const findDuplicate = (nums) => {
  const seen = new Set();
  for (const num of nums) {
    if (seen.has(num)) return num;
    seen.add(num);
  }
  return null; // explícito: contrato claro si no hay duplicado
};

findDuplicate([1, 3, 4, 2, 2]); // 2
findDuplicate([1, 2, 3]);        // null



 PROBLEMA 3: Contar palabras en una oración


// Maneja espacios múltiples, strings vacíos y trim.
// El Junior se hubiera roto con "  hola   mundo  ".
const countWords = (str) => {
  if (!str?.trim()) return 0;
  return str.trim().split(/\s+/).length;
};

countWords("hola como estas");     // 3
countWords("  hola   mundo  ");    // 2  
countWords("");                    // 0  
countWords(null);                  // 0  



La principal diferencia que veo es que la IA es capaz de resolver estos mismos problemas en menos lineas de codigo y con sintaxis diferente pero sobretodo es que ejecuta como un programador senior y piensa en los casos que podrian romper el codigo antes de escribirlo.