import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useMouseStore = defineStore('mouse', () => {
  const mouseCoordinates = reactive({ x: 0, y: 0 });

  const createListeners = () => {
    window.addEventListener('mousemove', ({ clientX, clientY }) => {
      mouseCoordinates.x = clientX;
      mouseCoordinates.y = clientY;
    });
  };

  return { createListeners };
});
