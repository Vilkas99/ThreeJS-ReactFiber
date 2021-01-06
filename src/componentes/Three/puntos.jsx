import React, { useRef, useLayoutEffect, useMemo } from "react";
import { Canvas, useFrame } from "react-three-fiber";

import * as THREE from "three";

//Función de onda suavizada para la animación de zoom in y out de los puntos
const animacionOndaSuavizada = (t, delta, a, f) => {
  return ((2 * a) / Math.PI) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta);
};

function Puntos() {
  const ref = useRef();

  const { vec, transform, positions, distancia } = useMemo(() => {
    const vec = new THREE.Vector3(); //Creamos un vector que almacenará la posicion de cada punto
    const transform = new THREE.Matrix4(); //Establecemos una matriz en la variable, que permite que los vectores en 3D tengan trasnformaciones
    const positions = [...Array(10000)].map((_, i) => {
      //Creamos un arreglo de 10000 posiciones
      const position = new THREE.Vector3(); //Creamos un vector de posicion
      // Place in a grid
      position.x = (i % 100) - 50; //Establecemos su posicion en x
      position.y = Math.floor(i / 100) - 50; //Caso similar para y

      // Realizamos un pequeño offset, permitiendo así un desplazamiento en hexagono
      position.y += (i % 2) * 0.5;

      //Agregamos "ruido"
      position.x += Math.random() * 0.3;
      position.y += Math.random() * 0.3;
      return position; //Regresamos el vector
    });

    const derecha = new THREE.Vector3(1, 0, 0);
    const distancia = positions.map(
      //Metodo que nos permite no solo conocer la longitud de cada punto con respecto al centro, sino también modificarla
      //... para que esta conforme un desplazamiento en hexágono
      (pos) => pos.length() + Math.cos(pos.angleTo(derecha) * 8) * 0.5
    );

    return { vec, transform, positions, distancia }; //Regresmaos las tres variables
  }, []);

  //Hook que nos permite renderizar en cada frame
  useFrame(({ clock }) => {
    //Creamos un ciclo que recorre cada uno de los puntos
    for (let i = 0; i < 10000; ++i) {
      const tiempo = clock.elapsedTime - distancia[i] / 80;
      const onda = animacionOndaSuavizada(tiempo, 0.1, 1, 1 / 3);
      //Creamos una variable de escala que se ve modificada por la onda de suavizado
      const scale = 1 + onda * 0.8;
      //copiamos en nuestro vector principal, el vector de posicion en cuestion y lo multiplicamos por un escalar
      vec.copy(positions[i]).multiplyScalar(scale);
      //Establecemos la posicion de nuestro transform a través de este vector
      transform.setPosition(vec);
      //Y a través de nuestra referencia, estblecemos que el punto i tendrá su respectivo objeto transform
      ref.current.setMatrixAt(i, transform);
    }
    //Establecemos que necesitamos actualizar las matrices de nuestra referencias
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[null, null, 10000]}>
      <circleBufferGeometry args={[0.15]} />
      <meshBasicMaterial />
    </instancedMesh>
  );
}

export default Puntos;
